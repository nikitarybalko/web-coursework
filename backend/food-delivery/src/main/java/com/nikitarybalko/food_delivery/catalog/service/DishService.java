package org.nikitarybalko.food_delivery.catalog.service;

import lombok.RequiredArgsConstructor;
import org.nikitarybalko.food_delivery.catalog.dto.DishCreateRequest;
import org.nikitarybalko.food_delivery.catalog.dto.DishResponse;
import org.nikitarybalko.food_delivery.catalog.dto.DishShortDTO;
import org.nikitarybalko.food_delivery.catalog.dto.DishUpdateRequest;
import org.nikitarybalko.food_delivery.catalog.mapper.DishMapper;
import org.nikitarybalko.food_delivery.catalog.model.Category;
import org.nikitarybalko.food_delivery.catalog.model.Dish;
import org.nikitarybalko.food_delivery.catalog.model.Restaurant;
import org.nikitarybalko.food_delivery.catalog.repository.CategoryRepository;
import org.nikitarybalko.food_delivery.catalog.repository.DishRepository;
import org.nikitarybalko.food_delivery.catalog.repository.RestaurantRepository;
import org.nikitarybalko.food_delivery.shared.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class DishService {

    private final DishRepository dishRepository;
    private final CategoryRepository categoryRepository;
    private final RestaurantRepository restaurantRepository;
    private final DishMapper dishMapper;

    public Page<DishShortDTO> getDishes(Pageable pageable, String search, Long categoryId) {
        String safeSearch = (search == null) ? "" : search.trim();

        Page<Dish> dishPage = dishRepository.findFilteredDishes(safeSearch, categoryId, pageable);

        return dishPage.map(dishMapper::toDishShortDTO);
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
