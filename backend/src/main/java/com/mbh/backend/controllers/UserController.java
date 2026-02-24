package com.mbh.backend.controllers;

import com.mbh.backend.dto.JobRequest;
import com.mbh.backend.models.Address;
import com.mbh.backend.models.JobHistory;
import com.mbh.backend.models.JobStatus;
import com.mbh.backend.models.PricingType;
import com.mbh.backend.models.Service;
import com.mbh.backend.models.User;
import com.mbh.backend.repositories.ServiceRepository;
import com.mbh.backend.repositories.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    public UserController(UserRepository userRepository,
                          ServiceRepository serviceRepository) {
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
    }

    // =======================
    // GET CURRENT USER
    // =======================
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }

    // =======================
    // ADD ADDRESS
    // =======================
    @PostMapping("/address")
    public User addAddress(@RequestBody Address newAddress,
                           Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        newAddress.setId(java.util.UUID.randomUUID().toString());
        if (user.getAddresses() == null) {
            user.setAddresses(new ArrayList<>());
        }
        user.getAddresses().add(newAddress);
        return userRepository.save(user);
    }

    // =======================
    // DEACTIVATE ADDRESS
    // =======================
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

    // =======================
    // CREATE JOB (Customer → REQUESTED)
    // =======================
    // @PostMapping("/address/{addressId}/jobs")
    // public ResponseEntity<?> createJob(@PathVariable String addressId,
    //                                    @RequestBody JobRequest request,
    //                                    Authentication authentication) {
    //     String email = authentication.getName();
    //     User user = userRepository.findByEmail(email)
    //             .orElseThrow(() -> new RuntimeException("User not found"));
    //     if (user.getAddresses() == null) {
    //         return ResponseEntity.badRequest().body("No addresses found.");
    //     }
    //     Address address = user.getAddresses().stream()
    //             .filter(a -> a.getId().equals(addressId))
    //             .findFirst()
    //             .orElse(null);
    //     if (address == null) {
    //         return ResponseEntity.badRequest().body("Address not found.");
    //     }
    //     Service service = serviceRepository.findById(request.getServiceId())
    //             .orElseThrow(() -> new RuntimeException("Service not found"));
    //     JobHistory job = new JobHistory();
    //     job.setServiceId(service.getId());
    //     job.setServiceNameSnapshot(service.getName());
    //     job.setPricingType(service.getPricingType());
    //     job.setPriceUsed(service.getBasePrice());
    //     job.setMinimumCharge(service.getMinimumCharge());
    //     job.setSquareFootage(request.getSquareFootage());
    //     double calculatedQuote;
    //     if (service.getPricingType() == PricingType.FLAT) {
    //         calculatedQuote = Math.max(
    //                 service.getBasePrice(),
    //                 service.getMinimumCharge()
    //         );
    //     } else {
    //         double sqft = request.getSquareFootage() != null
    //                 ? request.getSquareFootage()
    //                 : 0;
    //         calculatedQuote = Math.max(
    //                 sqft * service.getBasePrice(),
    //                 service.getMinimumCharge()
    //         );
    //     }
    //     job.setCalculatedQuote(calculatedQuote);
    //     job.setStatus(JobStatus.REQUESTED);
    //     job.setRequestedDate(Instant.now());
    //     if (address.getJobHistory() == null) {
    //         address.setJobHistory(new ArrayList<>());
    //     }
    //     address.getJobHistory().add(job);
    //     userRepository.save(user);
    //     return ResponseEntity.ok("Job request submitted successfully.");
    // }
    @PostMapping("/{addressId}/jobs")
    public ResponseEntity<?> createJob(
            @PathVariable String addressId,
            @RequestBody JobRequest request,
            Authentication authentication) {

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Address address = user.getAddresses().stream()
                .filter(addr -> addr.getId().equals(addressId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Address not found"));

        Service service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service not found"));

        JobHistory job = new JobHistory();
        job.setServiceId(service.getId());
        job.setServiceNameSnapshot(service.getName());
        job.setPricingType(service.getPricingType());
        job.setPriceUsed(service.getBasePrice());
        job.setMinimumCharge(service.getMinimumCharge());
        job.setSquareFootage(request.getSquareFootage());
        job.setStatus(JobStatus.REQUESTED);
        job.setRequestedDate(Instant.now());

        if (address.getJobHistory() == null) {
            address.setJobHistory(new ArrayList<>());
        }

        address.getJobHistory().add(job);
        userRepository.save(user);

        return ResponseEntity.ok("Service request submitted.");
    }

    // =======================
    // GET ACTIVE SERVICES
    // =======================
    @GetMapping("/services")
    public List<Service> getActiveServices() {
        return serviceRepository.findAll()
                .stream()
                .filter(service -> Boolean.TRUE.equals(service.getIsActive()))
                .toList();
    }
}