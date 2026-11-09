package com.examplesimpleshop.ecommerce.controller;

import com.examplesimpleshop.ecommerce.dto.ReviewRequest;
import com.examplesimpleshop.ecommerce.dto.ReviewResponse;
import com.examplesimpleshop.ecommerce.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public List<ReviewResponse> getByProduct(@RequestParam Long productId) {
        return reviewService.getByProduct(productId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReviewResponse create(@Valid @RequestBody ReviewRequest request) {
        return reviewService.create(request);
    }
}
