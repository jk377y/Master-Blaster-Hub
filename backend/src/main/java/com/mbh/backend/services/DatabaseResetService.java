package com.mbh.backend.services;

import com.mbh.backend.models.User;
import com.mbh.backend.repositories.UserRepository;
import com.mbh.backend.repositories.ServiceRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.List;

@Service
public class DatabaseResetService {
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final PasswordEncoder passwordEncoder;
    public DatabaseResetService(UserRepository userRepository,
                                ServiceRepository serviceRepository,
                                PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.passwordEncoder = passwordEncoder;
    }
    public void resetDatabase() {
        userRepository.deleteAll();
        serviceRepository.deleteAll();
        seedServices();
        seedMasterAdmin();
        seedDemoAccounts();
        seedMockUsers();
    }
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
        // Customer demo account (with fixed addresses + jobs)
        List<com.mbh.backend.models.Service> services = serviceRepository.findAll();
        User demoCustomer =
                SeedDataFactory.buildDemoCustomerWithData(services, passwordEncoder);
        userRepository.save(demoCustomer);
    }
    private void seedServices() {
        serviceRepository.saveAll(
                SeedDataFactory.buildDefaultServices()
        );
    }
    private void seedMockUsers() {
        List<com.mbh.backend.models.Service> services = serviceRepository.findAll();
        List<User> mockUsers =
                SeedDataFactory.buildMockUsers(services, passwordEncoder);
        userRepository.saveAll(mockUsers);
    }
}