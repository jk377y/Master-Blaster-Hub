package com.mbh.backend.controllers;

import org.springframework.dao.DuplicateKeyException;
import com.mbh.backend.dto.LoginRequest;
import com.mbh.backend.dto.SignupRequest;
import com.mbh.backend.models.User;
import com.mbh.backend.repositories.UserRepository;
import com.mbh.backend.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
        User user = userOptional.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
        String token = jwtUtil.generateToken(
            user.getEmail(),
            user.getRole().name(),
            user.getFirstName()
        );
        return ResponseEntity.ok(
                java.util.Map.of(
                        "token", token,
                        "email", user.getEmail(),
                        "role", user.getRole().name(),
                        "userFirstName", user.getFirstName()
                )
        );
    }
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
            user.setCreatedAt(java.time.Instant.now());
            userRepository.save(user);
            String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name(),
                user.getFirstName()
        );
        return ResponseEntity.ok(Map.of("token", token));
        }   catch (DuplicateKeyException ex) {
            return ResponseEntity
                    .status(409)
                    .body("Email already in use");
        }
    }
}
