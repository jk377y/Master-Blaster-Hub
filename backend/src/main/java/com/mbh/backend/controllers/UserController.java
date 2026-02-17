package com.mbh.backend.controllers;

import com.mbh.backend.models.User;
import com.mbh.backend.repositories.UserRepository;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository userRepository;
    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }

    // used early for testing, disabled since adding authentication logic
    // @GetMapping("/users")
    // public List<User> getAllUsers() {
    //     return userRepository.findAll();
    // }
}
