package com.mbh.backend.controllers;

import com.mbh.backend.models.Address;
import com.mbh.backend.models.User;
import com.mbh.backend.repositories.UserRepository;
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

    @PostMapping("/address")
    public User addAddress(@RequestBody Address newAddress,
                       Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        newAddress.setId(java.util.UUID.randomUUID().toString());
    if (user.getAddresses() == null) {
        user.setAddresses(new java.util.ArrayList<>());
    }
    user.getAddresses().add(newAddress);
    return userRepository.save(user);
    }

    @PatchMapping("/address/{addressId}/deactivate")
    public User deactivateAddress(@PathVariable String addressId,
                        Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getAddresses() != null) {
            user.getAddresses().forEach(addr -> {
                if (addr.getId().equals(addressId)) {
                    addr.setIsActive(false);
                }
            });
        }
        return userRepository.save(user);
    }
}