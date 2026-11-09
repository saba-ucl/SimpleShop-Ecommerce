package com.examplesimpleshop.ecommerce.service;

import com.examplesimpleshop.ecommerce.dto.ReviewRequest;
import com.examplesimpleshop.ecommerce.dto.ReviewResponse;
import com.examplesimpleshop.ecommerce.entity.Order;
import com.examplesimpleshop.ecommerce.entity.Product;
import com.examplesimpleshop.ecommerce.entity.Review;
import com.examplesimpleshop.ecommerce.repository.OrderRepository;
import com.examplesimpleshop.ecommerce.repository.ProductRepository;
import com.examplesimpleshop.ecommerce.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

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

    public ReviewResponse create(ReviewRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new IllegalArgumentException("Order not found with id: " + request.getOrderId()));
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + request.getProductId()));

        Review review = new Review();
        review.setOrder(order);
        review.setProduct(product);
        review.setRating(request.getRating());
        review.setCreatedAt(LocalDateTime.now());
        return new ReviewResponse(reviewRepository.save(review));
    }
}
