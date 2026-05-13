package com.nikitarybalko.food_delivery.catalog.dto;

import jakarta.validation.constraints.NotBlank;

public record CategoryAddRequest(

        @NotBlank(message = "Category must have a name")
        String name,

        @NotBlank(message = "Category must have an image")
        String imagePath,

        int sortOrder,

        Long parentId
) {
}
