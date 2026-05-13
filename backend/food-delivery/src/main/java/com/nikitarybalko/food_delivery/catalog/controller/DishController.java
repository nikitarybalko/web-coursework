package com.nikitarybalko.food_delivery.catalog.controller;

import com.nikitarybalko.food_delivery.catalog.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import com.nikitarybalko.food_delivery.catalog.dto.*;
import com.nikitarybalko.food_delivery.catalog.service.DishService;
import com.nikitarybalko.food_delivery.catalog.service.MenuService;
import com.nikitarybalko.food_delivery.catalog.service.RestaurantService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dishes")
@RequiredArgsConstructor
public class DishController {

    private final MenuService menuService;
    private final RestaurantService restaurantService;
    private final DishService dishService;

    @GetMapping
    public ResponseEntity<Page<DishShortDTO>> getDishes(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long restaurantId,
            @PageableDefault(size = 12) Pageable pageable) {
        return ResponseEntity.ok(dishService.getDishes(pageable, search, categoryId, restaurantId));
    }

    @GetMapping("/menu")
    public ResponseEntity<List<CategoryWithDishesDTO>> getMenuForRestaurant(
            @RequestParam Long restaurantId) {

        return ResponseEntity.ok(menuService.getMenuForRestaurant(restaurantId));
    }

    @PostMapping
    public ResponseEntity<DishResponse> createDish(
            @Valid @RequestBody DishCreateRequest request,
            Authentication authentication
    ) {
        String ownerEmail = authentication.getName();
        DishResponse response = dishService.createDish(request, ownerEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{dishId}")
    public ResponseEntity<DishResponse> updateDish(
            @PathVariable Long dishId,
            @Valid @RequestBody DishUpdateRequest request,
            Authentication authentication
    ) {
        String ownerEmail = authentication.getName();
        DishResponse response = dishService.updateDish(dishId, request, ownerEmail);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{dishId}")
    public ResponseEntity<Void> deleteDish(
            @PathVariable Long dishId, Authentication authentication) {

        String email = authentication.getName();

        dishService.deleteDishById(dishId, email);

        return ResponseEntity.noContent().build();
    }
}
