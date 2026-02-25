package com.mbh.backend.services;

import com.mbh.backend.models.User;
import com.mbh.backend.repositories.ServiceRepository;
import com.mbh.backend.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
// Clears database and reseeds baseline data
public class DatabaseResetService {

    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final PasswordEncoder passwordEncoder;

    // Injects repositories and encoder
    public DatabaseResetService(UserRepository userRepository,
                                ServiceRepository serviceRepository,
                                PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Wipes collections and rebuilds initial dataset
    public void resetDatabase() {
        userRepository.deleteAll();
        serviceRepository.deleteAll();

        seedServices();
        seedMasterAdmin();
        seedDemoAccounts();
        seedMockUsers();
    }

    // Creates protected master admin account
    private void seedMasterAdmin() {
        User masterAdmin = new User();
        masterAdmin.setEmail("masteradmin@masterblasterhub.com");
        masterAdmin.setPasswordHash(passwordEncoder.encode("masteradminpw"));
        masterAdmin.setFirstName("Master");
        masterAdmin.setLastName("Admin");
        masterAdmin.setRole(com.mbh.backend.models.Role.ADMIN);
        masterAdmin.setIsActive(true);
        masterAdmin.setIsSystemAccount(true);
        masterAdmin.setCreatedAt(Instant.now());
        masterAdmin.setAddresses(java.util.Collections.emptyList());

        userRepository.save(masterAdmin);
    }

    // Creates demo admin and demo customer accounts
    private void seedDemoAccounts() {

        // Admin demo account
        User admin = new User();
        admin.setEmail("admin@masterblasterhub.com");
        admin.setPasswordHash(passwordEncoder.encode("password"));
        admin.setFirstName("John");
        admin.setLastName("Demo");
        admin.setRole(com.mbh.backend.models.Role.ADMIN);
        admin.setIsActive(true);
        admin.setIsSystemAccount(false);
        admin.setCreatedAt(Instant.now());
        admin.setAddresses(java.util.Collections.emptyList());

        userRepository.save(admin);

        // Customer demo account with sample data
        List<com.mbh.backend.models.Service> services =
                serviceRepository.findAll();

        User demoCustomer =
                SeedDataFactory.buildDemoCustomerWithData(
                        services,
                        passwordEncoder
                );

        userRepository.save(demoCustomer);
    }

    // Seeds default service catalog
    private void seedServices() {
        serviceRepository.saveAll(
                SeedDataFactory.buildDefaultServices()
        );
    }

    // Generates additional mock users for testing
    private void seedMockUsers() {
        List<com.mbh.backend.models.Service> services =
                serviceRepository.findAll();

        List<User> mockUsers =
                SeedDataFactory.buildMockUsers(
                        services,
                        passwordEncoder
                );

        userRepository.saveAll(mockUsers);
    }
}