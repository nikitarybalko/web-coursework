package com.nikitarybalko.food_delivery.user.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.nikitarybalko.food_delivery.user.dto.AuthResponse;
import com.nikitarybalko.food_delivery.user.dto.GoogleAuthRequest;
import com.nikitarybalko.food_delivery.user.model.User;
import com.nikitarybalko.food_delivery.user.repository.UserRepository;
import com.nikitarybalko.food_delivery.user.dto.LoginRequest;
import com.nikitarybalko.food_delivery.user.dto.RegistrationRequest;
import com.nikitarybalko.food_delivery.shared.exception.AuthException;
import com.nikitarybalko.food_delivery.user.enums.AuthProvider;
import com.nikitarybalko.food_delivery.user.enums.Role;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Slf4j
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtEncoder jwtEncoder;

    @Transactional
    public String login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new AuthException(HttpStatus.UNAUTHORIZED, "Невірний Email або пароль"));

        if (user.getProvider() == AuthProvider.GOOGLE && user.getPassword() == null) {
            throw new AuthException(HttpStatus.BAD_REQUEST, "Будь ласка, увійдіть із Google для цього акаунту");
        }

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new AuthException(HttpStatus.UNAUTHORIZED, "Невірний Email або пароль");
        }

        return generateJwtToken(user);
    }

    @Transactional
    public void register(RegistrationRequest request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new AuthException(HttpStatus.BAD_REQUEST, "Email вже використовується!");
        }

        String hashedPassword = passwordEncoder.encode(request.password());

        User newUser = new User(
                request.email(),
                hashedPassword,
                request.fullName(),
                request.phoneNumber(),
                Role.CUSTOMER,
                AuthProvider.LOCAL
        );

        userRepository.save(newUser);
    }

    @Transactional
    public AuthResponse processGoogleLogin(GoogleAuthRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseGet(() -> {
                    User newUser = new User(
                            request.email(),
                            null,
                            request.name(),
                            null,
                            Role.CUSTOMER,
                            AuthProvider.GOOGLE
                    );
                    return userRepository.save(newUser);
                });

        String jwtToken = generateJwtToken(user);

        return new AuthResponse(user.getId(), user.getEmail(), user.getRole().name(), jwtToken);
    }

    private String generateJwtToken(User user) {
        Instant now = Instant.now();
        JwtClaimsSet.Builder claimsBuilder = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(now.plus(24, ChronoUnit.HOURS))
                .subject(user.getEmail())
                .claim("email", user.getEmail())
                .claim("name", user.getFullName());

        if (user.getPhoneNumber() != null && !user.getPhoneNumber().isEmpty()) {
            claimsBuilder.claim("phoneNumber", user.getPhoneNumber());
        }

        if (user.getRole() != null) {
            claimsBuilder.claim("role", user.getRole().name());
        } else {
            claimsBuilder.claim("role", "CUSTOMER");
        }

        JwtClaimsSet claims = claimsBuilder.build();

        return jwtEncoder.encode(
                JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(), claims)
        ).getTokenValue();
    }
}