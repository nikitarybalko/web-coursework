package org.nikitarybalko.food_delivery.dto;

import jakarta.validation.constraints.NotBlank;

public record UserLoginRequest(

        @NotBlank
        String email,

        @NotBlank
        String password
) { }
