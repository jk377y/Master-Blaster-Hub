package com.mbh.backend.controllers;

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
    @GetMapping("/jobs/search")
    public ResponseEntity<List<JobSearchResult>> searchJobs(
        @RequestParam(required = false) String field,
        @RequestParam(required = false) String value,
        Authentication authentication) {
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
        if (!permissionService.canViewReports(currentUser)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<JobSearchResult> results = new ArrayList<>();
        List<User> users = userRepository.findAll();
        for (User user : users) {
            if (user.getAddresses() == null) continue;
            for (Address address : user.getAddresses()) {
                if (address.getJobHistory() == null) continue;
                for (JobHistory job : address.getJobHistory()) {
                    JobSearchResult row = new JobSearchResult(
                            user.getEmail(),
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
                            case "city":
                                matches = address.getCity() != null &&
                                        address.getCity().toLowerCase().contains(lowerValue);
                                break;
                            case "servicename":
                                matches = job.getServiceNameSnapshot() != null &&
                                        job.getServiceNameSnapshot().toLowerCase().contains(lowerValue);
                                break;
                            case "status":
                                matches = job.getStatus() != null &&
                                        job.getStatus().name().toLowerCase().contains(lowerValue);
                                break;
                            case "email":
                                matches = user.getEmail() != null &&
                                        user.getEmail().toLowerCase().contains(lowerValue);
                                break;
                            default:
                                matches = true;
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
