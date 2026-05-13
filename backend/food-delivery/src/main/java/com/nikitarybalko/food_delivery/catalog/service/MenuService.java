package com.nikitarybalko.food_delivery.catalog.service;

import lombok.RequiredArgsConstructor;
import com.nikitarybalko.food_delivery.catalog.dto.CategoryWithDishesDTO;
import com.nikitarybalko.food_delivery.catalog.mapper.MenuMapper;
import com.nikitarybalko.food_delivery.catalog.model.Category;
import com.nikitarybalko.food_delivery.catalog.model.Dish;
import com.nikitarybalko.food_delivery.catalog.repository.DishRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MenuService {

    private final DishRepository dishRepository;
    private final MenuMapper menuMapper;

    public List<CategoryWithDishesDTO> getMenuForRestaurant(Long restaurantId) {
        List<Dish> dishes = dishRepository.findByRestaurantId(restaurantId);

        Map<Category, List<Dish>> groupedDishes = new HashMap<>();
        for (Dish dish : dishes) {
            for (Category category : dish.getCategories()) {
                groupedDishes.computeIfAbsent(category, k -> new ArrayList<>()).add(dish);
            }
        }

        return groupedDishes.entrySet().stream()
                .map(entry -> menuMapper.toCategoryWithDishesDTO(entry.getKey(), entry.getValue()))
                .sorted(Comparator.comparing(CategoryWithDishesDTO::sortOrder))
                .toList();
    }
}
