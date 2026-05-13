package com.nikitarybalko.food_delivery.catalog.dto;

import lombok.Builder;
import java.util.List;

@Builder
public record CategoryResponse(
        Long id,
        String name,
        String imagePath,
        Integer sortOrder,
        List<CategoryResponse> children
) {
}
