package com.nikitarybalko.food_delivery.user.dto;

public record UserResponse(

        String email,
        String fullName,
        String phoneNumber
) { }
