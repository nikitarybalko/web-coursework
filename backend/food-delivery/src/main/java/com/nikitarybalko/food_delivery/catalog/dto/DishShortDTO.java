package com.nikitarybalko.food_delivery.catalog.dto;

import java.math.BigDecimal;

public record DishShortDTO(
        Long id,
        String name,
        BigDecimal price,
        String imagePath,
        String description,
        Long restaurantId,
        String restaurantName
) {
}
