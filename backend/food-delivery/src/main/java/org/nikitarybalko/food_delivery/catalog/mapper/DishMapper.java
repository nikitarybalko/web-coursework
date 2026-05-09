package org.nikitarybalko.food_delivery.catalog.mapper;

import org.mapstruct.Mapper;
import org.nikitarybalko.food_delivery.catalog.dto.DishCreateRequest;
import org.nikitarybalko.food_delivery.catalog.dto.DishResponse;
import org.nikitarybalko.food_delivery.catalog.dto.DishShortDTO;
import org.nikitarybalko.food_delivery.catalog.model.Dish;

@Mapper
public interface DishMapper {

    DishResponse toResponse(Dish savedDish);

    Dish toModel(DishCreateRequest dishCreateRequest);

    DishShortDTO toDishShortDTO(Dish dish);
}
