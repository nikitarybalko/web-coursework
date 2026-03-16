package org.nikitarybalko.food_delivery.dto;

public record UserResponse(

        String email,
        String fullName,
        String phoneNumber
) { }
