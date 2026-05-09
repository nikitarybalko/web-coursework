package org.nikitarybalko.food_delivery.catalog.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.nikitarybalko.food_delivery.catalog.dto.RestaurantResponse;
import org.nikitarybalko.food_delivery.catalog.mapper.RestaurantMapper;
import org.nikitarybalko.food_delivery.catalog.model.Restaurant;
import org.nikitarybalko.food_delivery.catalog.repository.RestaurantRepository;
import org.nikitarybalko.food_delivery.shared.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final RestaurantMapper restaurantMapper;

    public RestaurantResponse getRestaurantsByOwner(String email) {
        Restaurant restaurant = restaurantRepository.findByOwnerEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Restaurant with owner " + email + " not found"));

        return restaurantMapper.toResponse(restaurant);
    }
}
