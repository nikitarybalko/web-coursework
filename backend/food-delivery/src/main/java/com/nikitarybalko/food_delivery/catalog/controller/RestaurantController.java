package com.nikitarybalko.food_delivery.catalog.controller;

import com.nikitarybalko.food_delivery.catalog.dto.RestaurantResponse;
import com.nikitarybalko.food_delivery.catalog.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/restaurants")
public class RestaurantController {

    private final RestaurantService restaurantService;

    @GetMapping
    public ResponseEntity<List<RestaurantResponse>> getAllRestaurants() {
        return ResponseEntity.ok(restaurantService.getAllRestaurants());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RestaurantResponse> getRestaurantById(@PathVariable Long id) {
        return ResponseEntity.ok(restaurantService.getRestaurantById(id));
    }

    @GetMapping("/owner")
    public ResponseEntity<RestaurantResponse> getRestaurantByOwner(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(restaurantService.getRestaurantByOwner(email));
    }

//    @GetMapping("/{restaurantId}/categories")
//    public ResponseEntity<List<CategoryResponse>> getRestaurantCategories(@PathVariable Long restaurantId) {
//        return ResponseEntity.ok(restaurantService.getRestaurantCategories(restaurantId));
//    }
}
