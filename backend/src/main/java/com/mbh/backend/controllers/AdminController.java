package com.mbh.backend.controllers;

import com.mbh.backend.models.User;
import com.mbh.backend.repositories.UserRepository;
import com.mbh.backend.services.DatabaseResetService;
import com.mbh.backend.services.PermissionService;
import com.mbh.backend.services.PermissionServiceFactory;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final DatabaseResetService databaseResetService;
    private final UserRepository userRepository;
    private final PermissionServiceFactory permissionServiceFactory;
    public AdminController(DatabaseResetService databaseResetService,
        UserRepository userRepository, PermissionServiceFactory permissionServiceFactory) {
            this.databaseResetService = databaseResetService;
            this.userRepository = userRepository;
            this.permissionServiceFactory = permissionServiceFactory;
        }
    @PostMapping("/reset")
    public ResponseEntity<?> resetDatabase(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String currentUserEmail = authentication.getName();
        User currentUser = userRepository.findByEmail(currentUserEmail).orElse(null);
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        PermissionService permissionService =
                permissionServiceFactory.getPermissionService(currentUser);
        if (!permissionService.canResetDatabase(currentUser)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        databaseResetService.resetDatabase();
        return ResponseEntity.ok("Database reset successfully.");
    }
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String currentUserEmail = authentication.getName();
        User currentUser = userRepository.findByEmail(currentUserEmail).orElse(null);
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        User targetUser = userRepository.findById(id).orElse(null);
        if (targetUser == null) {
            return ResponseEntity.notFound().build();
        }
        PermissionService permissionService =
                permissionServiceFactory.getPermissionService(currentUser);
        if (!permissionService.canDeleteUser(currentUser, targetUser)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        userRepository.delete(targetUser);
        return ResponseEntity.ok("User deleted successfully.");
    }

}
