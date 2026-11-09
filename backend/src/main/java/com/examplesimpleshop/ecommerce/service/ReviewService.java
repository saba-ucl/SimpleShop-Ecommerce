package com.examplesimpleshop.ecommerce.service;

import com.examplesimpleshop.ecommerce.dto.ReviewRequest;
import com.examplesimpleshop.ecommerce.dto.ReviewResponse;
import com.examplesimpleshop.ecommerce.dto.ReviewSummaryResponse;
import com.examplesimpleshop.ecommerce.dto.ReviewUpdateRequest;
import com.examplesimpleshop.ecommerce.entity.Order;
import com.examplesimpleshop.ecommerce.entity.OrderStatus;
import com.examplesimpleshop.ecommerce.entity.Product;
import com.examplesimpleshop.ecommerce.entity.Review;
import com.examplesimpleshop.ecommerce.repository.OrderRepository;
import com.examplesimpleshop.ecommerce.repository.ProductRepository;
import com.examplesimpleshop.ecommerce.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         OrderRepository orderRepository,
                         ProductRepository productRepository) {
        this.reviewRepository = reviewRepository;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    public List<ReviewResponse> getByProduct(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDescIdDesc(productId).stream()
                .map(ReviewResponse::new)
                .toList();
    }

    // Average (one decimal) and count per product. Products without reviews are not included.
    public Map<Long, ReviewSummaryResponse> getSummaries() {
        Map<Long, ReviewSummaryResponse> summaries = new LinkedHashMap<>();
        for (Object[] row : reviewRepository.findRatingSummaries()) {
            Long productId = ((Number) row[0]).longValue();
            double average = BigDecimal.valueOf(((Number) row[1]).doubleValue())
                    .setScale(1, RoundingMode.HALF_UP)
                    .doubleValue();
            long count = ((Number) row[2]).longValue();
            summaries.put(productId, new ReviewSummaryResponse(average, count));
        }
        return summaries;
    }

    public ReviewResponse create(ReviewRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new IllegalArgumentException("Order not found with id: " + request.getOrderId()));
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + request.getProductId()));

        // Only a customer who has received the product can review it. Checked in this order.
        if (order.getUser() == null || !order.getUser().getId().equals(request.getUserId())) {
            throw new IllegalArgumentException("You can only review products from your own orders.");
        }
        if (order.getStatus() != OrderStatus.DELIVERED) {
            throw new IllegalArgumentException("You can only review products from delivered orders.");
        }
        // Several order lines with the same product count as one: it is enough that one line has it.
        boolean productOnOrder = order.getItems().stream()
                .anyMatch(item -> item.getProduct().getId().equals(product.getId()));
        if (!productOnOrder) {
            throw new IllegalArgumentException("This product is not part of the order.");
        }

        // One review per order and product, regardless of how many order lines hold the product.
        // Checked here so the client gets a clear message instead of the generic integrity error.
        if (reviewRepository.existsByOrderIdAndProductId(order.getId(), product.getId())) {
            throw new IllegalArgumentException("You have already reviewed this product for this order.");
        }

        Review review = new Review();
        review.setOrder(order);
        review.setProduct(product);
        review.setRating(request.getRating());
        review.setComment(normalizeComment(request.getComment()));
        review.setCreatedAt(LocalDateTime.now());
        return new ReviewResponse(reviewRepository.save(review));
    }

    // Only the rating and comment can change. The order, product and created date stay as they were.
    public ReviewResponse update(Long id, ReviewUpdateRequest request) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Review not found with id: " + id));

        // The customer is the owner of the reviewed order. Compared against the id sent by the client.
        if (review.getOrder().getUser() == null || !review.getOrder().getUser().getId().equals(request.getUserId())) {
            throw new IllegalArgumentException("You can only edit your own reviews.");
        }

        review.setRating(request.getRating());
        review.setComment(normalizeComment(request.getComment()));
        return new ReviewResponse(reviewRepository.save(review));
    }

    // After deleting, the customer can review the same order and product again.
    public void delete(Long id, Long userId) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Review not found with id: " + id));

        // The customer is the owner of the reviewed order. Compared against the id sent by the client.
        if (review.getOrder().getUser() == null || !review.getOrder().getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You can only delete your own reviews.");
        }

        reviewRepository.delete(review);
    }

    // The comment is optional: an absent or blank comment is stored as "no comment".
    private String normalizeComment(String rawComment) {
        String comment = rawComment == null ? "" : rawComment.trim();
        return comment.isEmpty() ? null : comment;
    }
}
