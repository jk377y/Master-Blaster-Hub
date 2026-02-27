package com.mbh.backend.controllers;

import com.mbh.backend.dto.LoginRequest;
import com.mbh.backend.dto.SignupRequest;
import com.mbh.backend.models.User;
import com.mbh.backend.repositories.UserRepository;
import com.mbh.backend.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
// Handles user login and registration
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // Injects repository, encoder, and JWT utility
    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // Authenticates user and returns JWT if valid
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        var userOptional = userRepository.findByEmail(request.getEmail());

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Invalid credentials"));
        }

        User user = userOptional.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Invalid credentials"));
        }

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name(),
                user.getFirstName()
        );

        return ResponseEntity.ok(
                Map.of(
                        "token", token,
                        "email", user.getEmail(),
                        "role", user.getRole().name(),
                        "userFirstName", user.getFirstName()
                )
        );
    }

    // Registers new customer account and returns JWT
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest request) {
        try {
            User user = new User();
            user.setEmail(request.getEmail().trim().toLowerCase());
            user.setFirstName(request.getFirstName().trim());
            user.setLastName(request.getLastName().trim());
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
            user.setRole(com.mbh.backend.models.Role.CUSTOMER);
            user.setIsActive(true);
            user.setIsSystemAccount(false);
            user.setCreatedAt(Instant.now());

            userRepository.save(user);

            String token = jwtUtil.generateToken(
                    user.getEmail(),
                    user.getRole().name(),
                    user.getFirstName()
            );

            return ResponseEntity.ok(
                    Map.of("token", token)
            );

        } catch (DuplicateKeyException ex) {
            return ResponseEntity
                    .status(409)
                    .body(Map.of("message", "Email already in use"));
        }
    }
}