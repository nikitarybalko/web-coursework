package com.nikitarybalko.food_delivery.catalog.repository;

import com.nikitarybalko.food_delivery.catalog.model.Category;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByParentIsNullOrderBySortOrderAsc(Pageable pageable);

    @Query("SELECT DISTINCT c FROM Dish d JOIN d.categories c WHERE d.restaurant.id = :restaurantId")
    List<Category> findCategoriesByRestaurantId(@Param("restaurantId") Long restaurantId);
}
