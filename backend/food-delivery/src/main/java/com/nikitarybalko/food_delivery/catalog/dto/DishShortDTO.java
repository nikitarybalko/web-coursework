package org.nikitarybalko.food_delivery.catalog.dto;

import java.math.BigDecimal;

public record DishShortDTO(
        Long id,
        String name,
        BigDecimal price,
        String imagePath,
        String description
) {
}
