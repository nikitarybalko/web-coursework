package org.nikitarybalko.food_delivery.user.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.nikitarybalko.food_delivery.user.dto.UserResponse;
import org.nikitarybalko.food_delivery.user.dto.UserUpdateRequest;
import org.nikitarybalko.food_delivery.user.enums.AuthProvider;
import org.nikitarybalko.food_delivery.user.enums.Role;
import org.nikitarybalko.food_delivery.user.model.User;
import org.nikitarybalko.food_delivery.user.repository.UserRepository;
import org.nikitarybalko.food_delivery.user.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

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

    @PutMapping
    public ResponseEntity<UserResponse> updateUser(@AuthenticationPrincipal Jwt jwt,
                                                   @Valid @RequestBody UserUpdateRequest request) {
        String email = jwt.getSubject();

        userService.updateUser(email, request);

        return ResponseEntity.ok().build();
    }
}
