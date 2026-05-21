package com.nikitarybalko.food_delivery.catalog.repository;

import com.nikitarybalko.food_delivery.catalog.model.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface PromotionRepository extends JpaRepository<Promotion, Long> {

    @Query("SELECT p FROM Promotion p " +
            "WHERE p.isActive = true " +
            "AND (p.validUntil IS NULL OR p.validUntil > :now) " +
            "ORDER BY p.createdAt DESC")
    List<Promotion> findActivePromotions(LocalDateTime now);
}
