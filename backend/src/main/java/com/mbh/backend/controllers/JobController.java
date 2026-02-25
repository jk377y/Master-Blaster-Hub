package com.mbh.backend.controllers;

import com.mbh.backend.models.*;
import com.mbh.backend.repositories.ServiceRepository;
import com.mbh.backend.repositories.UserRepository;
import com.mbh.backend.services.PermissionServiceFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jobs")
// Handles job status updates and pricing calculations
public class JobController {

    private final UserRepository userRepository;
    private final PermissionServiceFactory permissionServiceFactory;
    private final ServiceRepository serviceRepository;

    // Injects required repositories and services
    public JobController(UserRepository userRepository,
                         PermissionServiceFactory permissionServiceFactory,
                         ServiceRepository serviceRepository) {
        this.userRepository = userRepository;
        this.permissionServiceFactory = permissionServiceFactory;
        this.serviceRepository = serviceRepository;
    }

    // Updates job status and calculates quote when needed
    @PatchMapping("/{jobId}/status")
    public ResponseEntity<?> updateJobStatus(@PathVariable String jobId,
                                             @RequestParam JobStatus newStatus,
                                             Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }

        User currentUser = userRepository
                .findByEmail(authentication.getName())
                .orElse(null);

        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        for (User user : userRepository.findAll()) {
            if (user.getAddresses() == null) continue;

            for (Address address : user.getAddresses()) {
                if (address.getJobHistory() == null) continue;

                for (JobHistory job : address.getJobHistory()) {
                    if (job.getId().equals(jobId)) {

                        if (currentUser.getRole() == Role.CUSTOMER &&
                                !user.getId().equals(currentUser.getId())) {
                            return ResponseEntity.status(403)
                                    .body("Cannot modify another user's job.");
                        }

                        if (!isTransitionAllowed(
                                job.getStatus(),
                                newStatus,
                                currentUser.getRole())) {
                            return ResponseEntity.status(403)
                                    .body("Invalid status transition.");
                        }

                        if (newStatus == JobStatus.QUOTED) {
                            Service service = serviceRepository
                                    .findById(job.getServiceId())
                                    .orElseThrow();

                            double calculatedQuote;

                            if (service.getPricingType() == PricingType.FLAT) {
                                calculatedQuote = Math.max(
                                        service.getBasePrice(),
                                        service.getMinimumCharge()
                                );
                            } else {
                                double sqft = job.getSquareFootage() != null
                                        ? job.getSquareFootage()
                                        : 0;

                                calculatedQuote = Math.max(
                                        sqft * service.getBasePrice(),
                                        service.getMinimumCharge()
                                );
                            }

                            job.setPriceUsed(service.getBasePrice());
                            job.setMinimumCharge(service.getMinimumCharge());
                            job.setCalculatedQuote(calculatedQuote);
                        }

                        job.setStatus(newStatus);

                        if (newStatus == JobStatus.COMPLETED) {
                            job.setCompletedDate(java.time.Instant.now());
                        }

                        userRepository.save(user);
                        return ResponseEntity.ok("Job status updated.");
                    }
                }
            }
        }

        return ResponseEntity.badRequest().body("Job not found.");
    }

    // Validates allowed job status transitions by role
    private boolean isTransitionAllowed(JobStatus current,
                                        JobStatus next,
                                        Role role) {

        return switch (current) {
            case REQUESTED ->
                    role == Role.ADMIN && next == JobStatus.QUOTED;
            case QUOTED ->
                    role == Role.CUSTOMER &&
                            (next == JobStatus.APPROVED || next == JobStatus.DECLINED);
            case APPROVED ->
                    role == Role.ADMIN && next == JobStatus.COMPLETED;
            case DECLINED ->
                    role == Role.ADMIN && next == JobStatus.CANCELLED;
            default -> false;
        };
    }
}