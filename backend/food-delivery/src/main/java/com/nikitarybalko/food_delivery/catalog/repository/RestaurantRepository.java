package com.nikitarybalko.food_delivery.catalog.repository;

import com.nikitarybalko.food_delivery.catalog.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    Optional<Restaurant> findByOwnerEmail(String ownerEmail);
}
