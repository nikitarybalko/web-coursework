package org.nikitarybalko.food_delivery.catalog.controller;

import lombok.RequiredArgsConstructor;
import org.nikitarybalko.food_delivery.catalog.dto.RestaurantResponse;
import org.nikitarybalko.food_delivery.catalog.service.RestaurantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/restaurants")
public class RestaurantController {

    private final RestaurantService restaurantService;

    @GetMapping
    public ResponseEntity<RestaurantResponse> searchRestaurants(
            @RequestParam(required = false) String email) {
        return ResponseEntity.ok(restaurantService.getRestaurantsByOwner(email));
    }
}
