package com.nikitarybalko.food_delivery.catalog.mapper;

import org.mapstruct.Mapper;
import com.nikitarybalko.food_delivery.catalog.dto.DishCreateRequest;
import com.nikitarybalko.food_delivery.catalog.dto.DishResponse;
import com.nikitarybalko.food_delivery.catalog.dto.DishShortDTO;
import com.nikitarybalko.food_delivery.catalog.model.Dish;
import org.mapstruct.Mapping;

@Mapper
public interface DishMapper {

    DishResponse toResponse(Dish savedDish);

    Dish toModel(DishCreateRequest dishCreateRequest);

    @Mapping(source = "restaurant.id", target = "restaurantId")
    DishShortDTO toDishShortDTO(Dish dish);
}
