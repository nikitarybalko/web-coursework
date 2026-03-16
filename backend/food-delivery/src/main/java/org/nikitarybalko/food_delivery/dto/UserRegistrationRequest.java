package org.nikitarybalko.food_delivery.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.hibernate.validator.constraints.Length;

public record UserRegistrationRequest(

        @NotBlank
        @Email(message = "Please provide a valid email address")
        String email,

        @NotBlank
        @Length(min = 8, max = 50)
        @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$", message = "must contain at least one uppercase letter, one lowercase letter, and one digit.")
        String rawPassword,

        @NotBlank
        String fullName,

        @NotBlank
        String phoneNumber
) {
}
