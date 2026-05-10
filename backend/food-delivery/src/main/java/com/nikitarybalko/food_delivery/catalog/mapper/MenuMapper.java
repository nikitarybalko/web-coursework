package org.nikitarybalko.food_delivery.catalog.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.nikitarybalko.food_delivery.catalog.dto.CategoryWithDishesDTO;
import org.nikitarybalko.food_delivery.catalog.dto.DishShortDTO;
import org.nikitarybalko.food_delivery.catalog.model.Category;
import org.nikitarybalko.food_delivery.catalog.model.Dish;

import java.util.List;

@Mapper(componentModel = "spring")
public interface MenuMapper {

    @Mapping(source = "category.id", target = "id")
    @Mapping(source = "category.name", target = "name")
    @Mapping(source = "dishes", target = "dishes")
    CategoryWithDishesDTO toCategoryWithDishesDTO(Category category, List<Dish> dishes);

    DishShortDTO toDishShortDTO(Dish dish);
}