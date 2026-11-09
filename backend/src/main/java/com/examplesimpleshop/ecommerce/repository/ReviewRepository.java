package com.examplesimpleshop.ecommerce.repository;

import com.examplesimpleshop.ecommerce.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    boolean existsByOrderIdAndProductId(Long orderId, Long productId);

    List<Review> findByProductIdOrderByCreatedAtDescIdDesc(Long productId);
}
