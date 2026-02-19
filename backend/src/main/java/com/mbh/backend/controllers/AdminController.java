package com.mbh.backend.controllers;

import com.mbh.backend.services.DatabaseResetService;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final DatabaseResetService databaseResetService;
    public AdminController(DatabaseResetService databaseResetService) {
        this.databaseResetService = databaseResetService;
    }
    @PostMapping("/reset")
    public ResponseEntity<?> resetDatabase(Authentication authentication) {
        System.out.println("AUTH: " + authentication);
        if (authentication == null ||
            authentication.getAuthorities().stream()
                .noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
                System.out.println(authentication);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        databaseResetService.resetDatabase();
        System.out.println(authentication);
        return ResponseEntity.ok("Database reset successfully.");
    }
}
