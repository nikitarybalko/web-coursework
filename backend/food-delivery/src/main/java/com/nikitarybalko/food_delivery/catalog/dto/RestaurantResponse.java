package org.nikitarybalko.food_delivery.catalog.dto;

import java.util.List;

public record RestaurantResponse(
        Long id,
        String name,
        String address,
        List<String> tags,
        Double rating
) {}
