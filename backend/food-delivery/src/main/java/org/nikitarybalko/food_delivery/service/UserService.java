package org.nikitarybalko.food_delivery.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.nikitarybalko.food_delivery.dto.UserRegistrationRequest;
import org.nikitarybalko.food_delivery.dto.UserResponse;
import org.nikitarybalko.food_delivery.mapper.UserMapper;
import org.nikitarybalko.food_delivery.model.enums.Role;
import org.nikitarybalko.food_delivery.model.User;
import org.nikitarybalko.food_delivery.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

//    public User save(UserRegistrationRequest request) {
//        User user = new User(
//                request.email(),
//                passwordEncoder.encode(request.rawPassword()),
//                request.fullName(),
//                request.phoneNumber(),
//                Role.CUSTOMER
//        );
//        return userRepository.save(user);
//    }
//
//    public UserResponse findByEmail(String email) {
//        User user = userRepository.findByEmail(email).orElseThrow(
//                        () -> new EntityNotFoundException("User with email " + email + " not found")
//                );
//
//        return userMapper.toResponse(user);
//    }
}
