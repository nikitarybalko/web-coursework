package com.nikitarybalko.food_delivery.catalog.service;

import lombok.RequiredArgsConstructor;
import com.nikitarybalko.food_delivery.catalog.dto.DishCreateRequest;
import com.nikitarybalko.food_delivery.catalog.dto.DishResponse;
import com.nikitarybalko.food_delivery.catalog.dto.DishShortDTO;
import com.nikitarybalko.food_delivery.catalog.dto.DishUpdateRequest;
import com.nikitarybalko.food_delivery.catalog.mapper.DishMapper;
import com.nikitarybalko.food_delivery.catalog.model.Category;
import com.nikitarybalko.food_delivery.catalog.model.Dish;
import com.nikitarybalko.food_delivery.catalog.model.Restaurant;
import com.nikitarybalko.food_delivery.catalog.repository.CategoryRepository;
import com.nikitarybalko.food_delivery.catalog.repository.DishRepository;
import com.nikitarybalko.food_delivery.catalog.repository.RestaurantRepository;
import com.nikitarybalko.food_delivery.shared.exception.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashSet;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class DishService {

    private final DishRepository dishRepository;
    private final CategoryRepository categoryRepository;
    private final RestaurantRepository restaurantRepository;
    private final DishMapper dishMapper;

    public Page<DishShortDTO> getDishes(Pageable pageable, String search, Long categoryId, Long restaurantId) {
        String searchParam = null;

        if (search != null && !search.trim().isEmpty()) {
            try {
                String decodedSearch = URLDecoder.decode(search.trim(), StandardCharsets.UTF_8);

                log.info("Отримано пошуковий запит (сирий): {}", search);
                log.info("Розкодовано в нормальний текст: {}", decodedSearch);

                searchParam = "%" + decodedSearch.toLowerCase() + "%";
            } catch (Exception e) {
                log.error("Помилка декодування URL параметра пошуку", e);
                searchParam = "%" + search.trim().toLowerCase() + "%";
            }
        }

        Page<Dish> dishPage = dishRepository.findFilteredDishes(searchParam, categoryId, restaurantId, pageable);

        dishPage.forEach(dish -> log.info("Dish name: {}", dish.getName()));
        Page<DishShortDTO> mappedDishes = dishPage.map(dishMapper::toDishShortDTO);
        mappedDishes.forEach(dish -> log.info("Dish restaurantId: {}", dish.restaurantId()));
        return mappedDishes;
    }

    @Transactional
    public DishResponse createDish(DishCreateRequest request, String ownerEmail) {
        Restaurant myRestaurant = getMyRestaurant(ownerEmail);

        Dish dish = dishMapper.toModel(request);
        dish.setRestaurant(myRestaurant);

        if (request.categoryIds() != null && !request.categoryIds().isEmpty()) {
            Set<Category> categories = new HashSet<>(categoryRepository.findAllById(request.categoryIds()));
            dish.setCategories(categories);
        }

        Dish savedDish = dishRepository.save(dish);
        return dishMapper.toResponse(savedDish);
    }

    @Transactional
    public DishResponse updateDish(Long dishId, DishUpdateRequest request, String ownerEmail) {
        Restaurant myRestaurant = getMyRestaurant(ownerEmail);

        Dish dish = dishRepository.findById(dishId)
                .orElseThrow(() -> new ResourceNotFoundException("Страву з ID " + dishId + " не знайдено"));

        verifyDishOwnership(dish, myRestaurant.getId());

        dish.setName(request.name());
        dish.setDescription(request.description());
        dish.setPrice(request.price());
        dish.setImagePath(request.imagePath());

        if (request.categoryIds() != null) {
            Set<Category> categories = new HashSet<>(categoryRepository.findAllById(request.categoryIds()));
            dish.setCategories(categories);
        } else {
            dish.getCategories().clear();
        }

        Dish updatedDish = dishRepository.save(dish);
        return dishMapper.toResponse(updatedDish);
    }

    @Transactional
    public void deleteDishById(Long dishId, String ownerEmail) {
        Restaurant myRestaurant = getMyRestaurant(ownerEmail);

        Dish dish = dishRepository.findById(dishId)
                .orElseThrow(() -> new ResourceNotFoundException("Страву з ID " + dishId + " не знайдено"));

        verifyDishOwnership(dish, myRestaurant.getId());

        dishRepository.delete(dish);
    }

    private Restaurant getMyRestaurant(String ownerEmail) {
        return restaurantRepository.findByOwnerEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Ресторан не знайдено для користувача: " + ownerEmail));
    }

    private void verifyDishOwnership(Dish dish, Long myRestaurantId) {
        if (!dish.getRestaurant().getId().equals(myRestaurantId)) {
            throw new AccessDeniedException("У вас немає прав для керування цією стравою");
        }
    }
}
