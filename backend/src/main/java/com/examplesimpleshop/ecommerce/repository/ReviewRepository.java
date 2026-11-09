package com.examplesimpleshop.ecommerce.repository;

import com.examplesimpleshop.ecommerce.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    // One row per reviewed product: [productId, average rating, number of reviews]
    @Query("select r.product.id, avg(r.rating), count(r) from Review r group by r.product.id")
    List<Object[]> findRatingSummaries();

    boolean existsByOrderIdAndProductId(Long orderId, Long productId);

    List<Review> findByProductIdOrderByCreatedAtDescIdDesc(Long productId);
}
