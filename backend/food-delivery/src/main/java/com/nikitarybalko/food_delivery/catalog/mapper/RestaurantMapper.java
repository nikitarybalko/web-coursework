package com.nikitarybalko.food_delivery.catalog.mapper;

import org.mapstruct.Mapper;
import com.nikitarybalko.food_delivery.catalog.dto.RestaurantResponse;
import com.nikitarybalko.food_delivery.catalog.model.Restaurant;

@Mapper
public interface RestaurantMapper {

    RestaurantResponse toResponse(Restaurant restaurant);
}
