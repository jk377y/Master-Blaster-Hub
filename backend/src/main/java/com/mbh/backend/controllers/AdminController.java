package com.mbh.backend.controllers;

import com.mbh.backend.dto.CustomerSearchResult;
import com.mbh.backend.dto.JobSearchResult;
import com.mbh.backend.models.Address;
import com.mbh.backend.models.JobHistory;
import com.mbh.backend.models.User;
import com.mbh.backend.repositories.UserRepository;
import com.mbh.backend.services.DatabaseResetService;
import com.mbh.backend.services.PermissionService;
import com.mbh.backend.services.PermissionServiceFactory;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
// Handles admin-only operations like resets, user management, and reports
public class AdminController {

    private final DatabaseResetService databaseResetService;
    private final UserRepository userRepository;
    private final PermissionServiceFactory permissionServiceFactory;

    // Injects required services and repositories
    public AdminController(
            DatabaseResetService databaseResetService,
            UserRepository userRepository,
            PermissionServiceFactory permissionServiceFactory) {
        this.databaseResetService = databaseResetService;
        this.userRepository = userRepository;
        this.permissionServiceFactory = permissionServiceFactory;
    }

    // Resets the database if user has permission
    @PostMapping("/reset")
    public ResponseEntity<?> resetDatabase(Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Unauthorized."));
        }

        String currentUserEmail = authentication.getName();
        User currentUser = userRepository.findByEmail(currentUserEmail).orElse(null);

        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Unauthorized."));
        }

        PermissionService permissionService =
                permissionServiceFactory.getPermissionService(currentUser);

        if (!permissionService.canResetDatabase(currentUser)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Forbidden."));
        }

        databaseResetService.resetDatabase();
        return ResponseEntity.ok(
                Map.of("message", "Database reset successfully.")
        );
    }

    // Deletes a user if allowed by permission rules
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(
            @PathVariable String id,
            Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Unauthorized."));
        }

        String currentUserEmail = authentication.getName();
        User currentUser = userRepository.findByEmail(currentUserEmail).orElse(null);

        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Unauthorized."));
        }

        User targetUser = userRepository.findById(id).orElse(null);
        if (targetUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User not found."));
        }

        PermissionService permissionService =
                permissionServiceFactory.getPermissionService(currentUser);

        if (!permissionService.canDeleteUser(currentUser, targetUser)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Forbidden."));
        }

        userRepository.delete(targetUser);
        return ResponseEntity.ok(
                Map.of("message", "User deleted successfully.")
        );
    }

    // Searches customers with optional field filtering
    @GetMapping("/customers/search")
    public ResponseEntity<?> searchCustomers(
            @RequestParam(required = false) String field,
            @RequestParam(required = false) String value,
            Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Unauthorized."));
        }

        String currentUserEmail = authentication.getName();
        User currentUser = userRepository.findByEmail(currentUserEmail).orElse(null);

        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Unauthorized."));
        }

        PermissionService permissionService =
                permissionServiceFactory.getPermissionService(currentUser);

        if (!permissionService.canViewReports(currentUser)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Forbidden."));
        }

        List<CustomerSearchResult> results = new ArrayList<>();
        List<User> users = userRepository.findAll();

        for (User user : users) {

            CustomerSearchResult row = new CustomerSearchResult(
                    user.getId(),
                    user.getEmail(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getAddresses() != null && !user.getAddresses().isEmpty()
                            ? user.getAddresses().get(0).getStreet() : "",
                    user.getAddresses() != null && !user.getAddresses().isEmpty()
                            ? user.getAddresses().get(0).getCity() : "",
                    user.getRole(),
                    user.getIsActive(),
                    user.getCreatedAt()
            );

            boolean matches = true;

            if (field != null && value != null && !field.equalsIgnoreCase("all")) {
                String lowerValue = value.toLowerCase();

                switch (field.toLowerCase()) {
                    case "email" ->
                            matches = user.getEmail() != null &&
                                    user.getEmail().toLowerCase().contains(lowerValue);
                    case "lastname" ->
                            matches = user.getLastName() != null &&
                                    user.getLastName().toLowerCase().contains(lowerValue);
                    case "role" ->
                            matches = user.getRole() != null &&
                                    user.getRole().name().toLowerCase().contains(lowerValue);
                    default -> matches = true;
                }
            }

            if (matches) {
                results.add(row);
            }
        }

        return ResponseEntity.ok(results);
    }

    // Updates selected customer fields
    @PatchMapping("/customers/{id}")
    public ResponseEntity<?> updateCustomer(
            @PathVariable String id,
            @RequestBody User updatedUser,
            Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Unauthorized."));
        }

        String currentUserEmail = authentication.getName();
        User currentUser = userRepository.findByEmail(currentUserEmail).orElse(null);

        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Unauthorized."));
        }

        PermissionService permissionService =
                permissionServiceFactory.getPermissionService(currentUser);

        if (!permissionService.canViewReports(currentUser)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Forbidden."));
        }

        User existing = userRepository.findById(id).orElse(null);
        if (existing == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User not found."));
        }

        if (updatedUser.getFirstName() != null) {
            existing.setFirstName(updatedUser.getFirstName());
        }
        if (updatedUser.getLastName() != null) {
            existing.setLastName(updatedUser.getLastName());
        }
        if (updatedUser.getIsActive() != null) {
            existing.setIsActive(updatedUser.getIsActive());
        }

        userRepository.save(existing);
        return ResponseEntity.ok(
                Map.of("message", "Customer updated successfully.")
        );
    }

    // Searches job history across all users
    @GetMapping("/jobs/search")
    public ResponseEntity<?> searchJobs(
            @RequestParam(required = false) String field,
            @RequestParam(required = false) String value,
            Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Unauthorized."));
        }

        String currentUserEmail = authentication.getName();
        User currentUser = userRepository.findByEmail(currentUserEmail).orElse(null);

        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Unauthorized."));
        }

        PermissionService permissionService =
                permissionServiceFactory.getPermissionService(currentUser);

        if (!permissionService.canViewReports(currentUser)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Forbidden."));
        }

        List<JobSearchResult> results = new ArrayList<>();
        List<User> users = userRepository.findAll();

        for (User user : users) {
            if (user.getAddresses() == null) continue;

            for (Address address : user.getAddresses()) {
                if (address.getJobHistory() == null) continue;

                for (JobHistory job : address.getJobHistory()) {

                    JobSearchResult row = new JobSearchResult(
                            job.getId(),
                            user.getFirstName(),
                            user.getLastName(),
                            user.getEmail(),
                            address.getStreet(),
                            address.getCity(),
                            job.getServiceNameSnapshot(),
                            job.getSquareFootage(),
                            job.getCalculatedQuote(),
                            job.getStatus(),
                            job.getRequestedDate()
                    );

                    boolean matches = true;

                    if (field != null && value != null && !field.equalsIgnoreCase("all")) {
                        String lowerValue = value.toLowerCase();

                        switch (field.toLowerCase()) {
                            case "city" ->
                                    matches = address.getCity() != null &&
                                            address.getCity().toLowerCase().contains(lowerValue);
                            case "servicename" ->
                                    matches = job.getServiceNameSnapshot() != null &&
                                            job.getServiceNameSnapshot().toLowerCase().contains(lowerValue);
                            case "status" ->
                                    matches = job.getStatus() != null &&
                                            job.getStatus().name().toLowerCase().contains(lowerValue);
                            case "email" ->
                                    matches = user.getEmail() != null &&
                                            user.getEmail().toLowerCase().contains(lowerValue);
                            default -> matches = true;
                        }
                    }

                    if (matches) {
                        results.add(row);
                    }
                }
            }
        }

        return ResponseEntity.ok(results);
    }
}