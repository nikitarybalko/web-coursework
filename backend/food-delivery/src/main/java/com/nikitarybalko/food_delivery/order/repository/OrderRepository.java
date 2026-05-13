package com.nikitarybalko.food_delivery.order.repository;

import com.nikitarybalko.food_delivery.order.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findAllByUserEmailOrderByCreatedAtDesc(String userEmail);

    List<Order> findAllByRestaurantId(Long restaurantId);
}