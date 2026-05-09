package org.nikitarybalko.food_delivery.catalog.dto;

import java.util.List;

public record CategoryWithDishesDTO(
        Long id,
        String name,
        List<DishShortDTO> dishes,
        Integer sortOrder,
        Long parentId,
        String imagePath
) {
}
