package org.nikitarybalko.food_delivery.controller;

import lombok.RequiredArgsConstructor;
import org.nikitarybalko.food_delivery.model.User;
import org.nikitarybalko.food_delivery.model.enums.AuthProvider;
import org.nikitarybalko.food_delivery.model.enums.Role;
import org.nikitarybalko.food_delivery.repository.UserRepository;
import org.nikitarybalko.food_delivery.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    @PostMapping("/sync")
    public ResponseEntity<String> syncUser(@AuthenticationPrincipal Jwt jwt) {
        String email = jwt.getClaimAsString("email");
        String fullName = jwt.getClaimAsString("name");

        if (userRepository.findByEmail(email).isEmpty()) {
            if (fullName == null || fullName.isBlank()) {
                fullName = email;
            }

            User newUser = new User(
                    email,
                    null,
                    fullName,
                    null,
                    Role.CUSTOMER,
                    AuthProvider.GOOGLE
            );

            userRepository.save(newUser);

            return ResponseEntity.ok("New user registered successfully.");
        }

        return ResponseEntity.ok("User already exists. Welcome back!");
    }
}
