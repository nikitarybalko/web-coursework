package com.nikitarybalko.food_delivery.catalog.controller;

import com.nikitarybalko.food_delivery.catalog.dto.CategoryAddRequest;
import com.nikitarybalko.food_delivery.catalog.dto.CategoryEditRequest;
import com.nikitarybalko.food_delivery.catalog.dto.CategoryResponse;
import com.nikitarybalko.food_delivery.catalog.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getCategories(
            @RequestParam(required = false) Integer limit) {

        List<CategoryResponse> categories = categoryService.getRootCategories(limit);
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<CategoryResponse>> getCategoriesByRestaurant(@PathVariable Long restaurantId) {
        List<CategoryResponse> categories = categoryService.getCategoriesByRestaurant(restaurantId);
        return ResponseEntity.ok(categories);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryResponse> addCategory(@Valid @RequestBody CategoryAddRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(categoryService.addCategory(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryResponse> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryEditRequest request) {

        CategoryResponse updated = categoryService.updateCategory(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok().build();
    }
}
