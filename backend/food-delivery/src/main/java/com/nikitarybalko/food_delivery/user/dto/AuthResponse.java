package com.nikitarybalko.food_delivery.user.dto;

public record AuthResponse(
        Long id,
        String email,
        String role,
        String token
) {}
