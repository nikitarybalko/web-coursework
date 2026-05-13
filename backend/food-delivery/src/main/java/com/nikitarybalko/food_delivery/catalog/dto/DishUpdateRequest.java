package com.nikitarybalko.food_delivery.catalog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.Set;

public record DishUpdateRequest(
        @NotBlank(message = "Назва страви обов'язкова")
        String name,

        String description,

        @NotNull(message = "Ціна обов'язкова")
        @Positive(message = "Ціна має бути більшою за нуль")
        BigDecimal price,

        String imagePath,

        Set<Long> categoryIds
) {
}
