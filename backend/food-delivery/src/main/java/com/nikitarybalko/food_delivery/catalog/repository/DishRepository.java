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

    @Query("SELECT DISTINCT d FROM Dish d " +
            "LEFT JOIN d.categories c " +
            "WHERE (:search = '' OR " +
            "       LOWER(d.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "       LOWER(d.description) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "AND (:restaurantId IS NULL OR d.restaurant.id = :restaurantId) " +
            "AND (:categoryId IS NULL OR c.id = :categoryId)")
    Page<Dish> findFilteredDishes(
            @Param("search") String search,
            @Param("categoryId") Long categoryId,
            @Param("restaurantId") long restaurantId,
            Pageable pageable
    );
}
