package com.nikitarybalko.food_delivery.order.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record OrderCreateRequest(
        @NotBlank(message = "Ім'я користувача обов'язкове") String customerName,
        @NotBlank(message = "Номер телефону обов'язковий") String customerPhone,
        @NotBlank(message = "Адреса доставки обов'язкова") String deliveryAddress,
        @NotNull(message = "ID ресторану обов'язковий") Long restaurantId,
        @NotEmpty(message = "Кошик не може бути порожнім") List<OrderItemRequest> items
) {}
