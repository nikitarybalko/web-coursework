package com.nikitarybalko.food_delivery.catalog.dto;

import java.util.List;

public record RestaurantResponse(
        Long id,
        String name,
        String address,
        String description,
        String imagePath,
        List<String> tags,
        Double rating
) {}
