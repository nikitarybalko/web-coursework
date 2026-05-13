package com.nikitarybalko.food_delivery.order.dto;

import java.math.BigDecimal;

public record OrderItemResponse(
        Long id,
        Long dishId,
        String dishName,
        BigDecimal priceAtPurchase,
        Integer quantity
) {}
