package com.nikitarybalko.food_delivery.catalog.dto;

import java.time.LocalDateTime;

public record PromotionDTO(
        Long id,
        String title,
        String description,
        String imagePath,
        Long restaurantId,
        String restaurantName,
        LocalDateTime validUntil
) {}
