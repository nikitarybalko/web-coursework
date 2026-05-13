package com.nikitarybalko.food_delivery.catalog.service;

import com.nikitarybalko.food_delivery.catalog.dto.CategoryResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.nikitarybalko.food_delivery.catalog.dto.RestaurantResponse;
import com.nikitarybalko.food_delivery.catalog.mapper.RestaurantMapper;
import com.nikitarybalko.food_delivery.catalog.model.Restaurant;
import com.nikitarybalko.food_delivery.catalog.repository.RestaurantRepository;
import com.nikitarybalko.food_delivery.shared.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final RestaurantMapper restaurantMapper;

    public List<RestaurantResponse> getAllRestaurants() {
        return restaurantRepository.findAll()
                .stream()
                .map(restaurantMapper::toResponse)
                .toList();
    }

    public RestaurantResponse getRestaurantByOwner(String email) {
        Restaurant restaurant = restaurantRepository.findByOwnerEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Restaurant with owner " + email + " not found"));

        return restaurantMapper.toResponse(restaurant);
    }

    public RestaurantResponse getRestaurantById(Long id) {
        Restaurant restaurant = getRestaurantEntityById(id);
        return restaurantMapper.toResponse(restaurant);
    }

    public Restaurant getRestaurantEntityById(Long id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant with id " + id + " not found"));
    }

//    public List<CategoryResponse> getRestaurantCategories(Long restaurantId) {
//        Restaurant restaurant = getRestaurantById(restaurantId);
//        restaurant.g
//    }
}
