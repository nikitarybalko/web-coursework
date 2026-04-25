package org.nikitarybalko.food_delivery.dto;

import jakarta.validation.constraints.NotBlank;

public record CategoryEditRequest(

        @NotBlank(message = "Category must have a name")
        String name,

        int sortOrder,

        Boolean isActive
) {
}
