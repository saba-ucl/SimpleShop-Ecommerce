package com.examplesimpleshop.ecommerce.dto;

import com.examplesimpleshop.ecommerce.entity.Review;

import java.time.LocalDateTime;

public class ReviewResponse {

    private final Long id;
    private final Long productId;
    private final Long orderId;
    private final Integer rating;
    private final String comment;
    private final LocalDateTime createdAt;
    private final String reviewerName;

    public ReviewResponse(Review review) {
        this.id = review.getId();
        this.productId = review.getProduct().getId();
        this.orderId = review.getOrder().getId();
        this.rating = review.getRating();
        this.comment = review.getComment();
        this.createdAt = review.getCreatedAt();
        this.reviewerName = buildReviewerName(review);
    }

    // First word of the customer's name plus the city of the reviewed order, e.g. "Susie, Aarhus".
    private static String buildReviewerName(Review review) {
        String fullName = review.getOrder().getUser().getName();
        String trimmed = fullName == null ? "" : fullName.trim();
        String firstName = trimmed.isEmpty() ? "" : trimmed.split("\\s+")[0];
        return firstName + ", " + review.getOrder().getCity();
    }

    public Long getId() {
        return id;
    }

    public Long getProductId() {
        return productId;
    }

    public Long getOrderId() {
        return orderId;
    }

    public Integer getRating() {
        return rating;
    }

    public String getComment() {
        return comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getReviewerName() {
        return reviewerName;
    }
}
