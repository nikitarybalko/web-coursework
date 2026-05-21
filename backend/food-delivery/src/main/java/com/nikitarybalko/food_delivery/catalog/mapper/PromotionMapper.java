package com.nikitarybalko.food_delivery.catalog.mapper;

import com.nikitarybalko.food_delivery.catalog.dto.PromotionDTO;
import com.nikitarybalko.food_delivery.catalog.model.Promotion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper
public interface PromotionMapper {

    @Mapping( target = "restaurantName", source = "restaurant.name")
    @Mapping( target = "restaurantId", source = "restaurant.id")
    PromotionDTO toPromotionDTO(Promotion promotion);
}
