package org.nikitarybalko.food_delivery.order.dto;

import org.nikitarybalko.food_delivery.order.model.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        Long id,
        Long restaurantId,
        String customerEmail,
        String deliveryAddress,
        BigDecimal totalPrice,
        OrderStatus status,
        LocalDateTime createdAt,
        List<OrderItemResponse> items
) {}
