package org.nikitarybalko.food_delivery.catalog.mapper;

import org.mapstruct.Mapper;
import org.nikitarybalko.food_delivery.catalog.dto.RestaurantResponse;
import org.nikitarybalko.food_delivery.catalog.model.Restaurant;

import java.util.List;

@Mapper
public interface RestaurantMapper {

    RestaurantResponse toResponse(Restaurant restaurant);
}
