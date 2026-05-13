package com.nikitarybalko.food_delivery.order.dto;

import jakarta.validation.constraints.NotNull;

public record OrderItemRequest(
        @NotNull Long dishId,
        @NotNull Integer quantity
) {}
