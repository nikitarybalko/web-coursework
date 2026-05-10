package org.nikitarybalko.food_delivery.user.service;

import lombok.RequiredArgsConstructor;
import org.nikitarybalko.food_delivery.shared.exception.ResourceNotFoundException;
import org.nikitarybalko.food_delivery.user.dto.UserUpdateRequest;
import org.nikitarybalko.food_delivery.user.mapper.UserMapper;
import org.nikitarybalko.food_delivery.user.model.User;
import org.nikitarybalko.food_delivery.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    @Transactional
    public void updateUser(String email, UserUpdateRequest request) {
        User user = getUserByEmail(email);

        user.setFullName(request.fullName());
        user.setPhoneNumber(request.phoneNumber().isBlank() ? null : request.phoneNumber());
        userRepository.save(user);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(
                () -> new ResourceNotFoundException("User with Email " + email + " not found"));
    }
}
