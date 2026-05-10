package org.nikitarybalko.food_delivery.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.hibernate.validator.constraints.Length;

public record RegistrationRequest(

        @NotBlank
        @Email(message = "Please provide a valid email address")
        String email,

        @NotBlank
        @Length(min = 8, max = 50)
        @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$", message = "Password must contain at least one uppercase letter, one lowercase letter, and one digit")
        String password,

        @NotBlank
        String fullName,

        String phoneNumber
) {
}
