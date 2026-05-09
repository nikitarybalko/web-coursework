package org.nikitarybalko.food_delivery.catalog.dto;

import jakarta.validation.constraints.NotBlank;

public record CategoryEditRequest(

        @NotBlank(message = "Category must have a name")
        String name,

        String imagePath,

        int sortOrder,

        Long parentId
) {
}
