package com.nikitarybalko.food_delivery.catalog.repository;

import com.nikitarybalko.food_delivery.catalog.model.Dish;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DishRepository extends JpaRepository<Dish, Long> {

    @EntityGraph(attributePaths = {"categories"})
    List<Dish> findByRestaurantId(Long restaurantId);

    List<Dish> findAllByCategoriesId(Long categoryId);

    @Query("SELECT d FROM Dish d " +
            "WHERE (:search IS NULL OR LOWER(d.name) LIKE :search OR LOWER(d.description) LIKE :search) " +
            "AND (:restaurantId IS NULL OR d.restaurant.id = :restaurantId) " +
            "AND (:categoryId IS NULL OR EXISTS (SELECT c FROM d.categories c WHERE c.id = :categoryId))")
    Page<Dish> findFilteredDishes(
            @Param("search") String search,
            @Param("categoryId") Long categoryId,
            @Param("restaurantId") Long restaurantId,
            Pageable pageable
    );
}
