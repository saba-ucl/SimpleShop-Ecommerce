package com.examplesimpleshop.ecommerce.controller;

import com.examplesimpleshop.ecommerce.dto.ReviewRequest;
import com.examplesimpleshop.ecommerce.dto.ReviewResponse;
import com.examplesimpleshop.ecommerce.dto.ReviewSummaryResponse;
import com.examplesimpleshop.ecommerce.dto.ReviewUpdateRequest;
import com.examplesimpleshop.ecommerce.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

    @GetMapping("/summary")
    public Map<Long, ReviewSummaryResponse> getSummaries() {
        return reviewService.getSummaries();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReviewResponse create(@Valid @RequestBody ReviewRequest request) {
        return reviewService.create(request);
    }

    @PutMapping("/{id}")
    public ReviewResponse update(@PathVariable Long id, @Valid @RequestBody ReviewUpdateRequest request) {
        return reviewService.update(id, request);
    }
}
