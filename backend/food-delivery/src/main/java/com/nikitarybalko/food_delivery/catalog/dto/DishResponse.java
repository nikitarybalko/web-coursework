package org.nikitarybalko.food_delivery.catalog.dto;

import java.math.BigDecimal;
import java.util.Set;

public record DishResponse(
        Long id,
        String name,
        String description,
        BigDecimal price,
        String imagePath,
        Set<CategoryShortResponse> categories
) {
}
