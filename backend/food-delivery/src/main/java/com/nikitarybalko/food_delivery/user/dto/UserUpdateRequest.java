package org.nikitarybalko.food_delivery.user.dto;

import jakarta.validation.constraints.NotBlank;

public record UserUpdateRequest(
        @NotBlank(message = "Ім'я не може бути порожнім")
        String fullName,
        String phoneNumber
) { }
