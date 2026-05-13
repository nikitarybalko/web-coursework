package com.nikitarybalko.food_delivery.catalog.dto;

public record CategoryShortResponse(
        String name,
        String imagePath,
        Integer sortOrder
) {
}
