package com.mbh.backend.services;

import com.mbh.backend.repositories.UserRepository;
import com.mbh.backend.repositories.ServiceRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

        // BIG RED BUTTON WARNING: THIS WILL DELETE ALL DATA IN THE DATABASE
        // need a database wipe/delete everything
        userRepository.deleteAll();
        serviceRepository.deleteAll();

        // seed the database with the default "refreshed" data
        seedMasterAdmin();
        seedServices();
        seedMockUsers();

    }

    private void seedMasterAdmin() {
        com.mbh.backend.models.User masterAdmin = new com.mbh.backend.models.User();
        masterAdmin.setEmail("masteradmin@masterblasterhub.com");
        masterAdmin.setPasswordHash(passwordEncoder.encode("pw")); //! temporary: remove this later
        masterAdmin.setFirstName("Master");
        masterAdmin.setLastName("Admin");
        masterAdmin.setRole(com.mbh.backend.models.Role.ADMIN);
        masterAdmin.setIsActive(true);
        masterAdmin.setIsSystemAccount(true);  //! this account should not be deleted or modified by any other users
        masterAdmin.setCreatedAt(java.time.Instant.now());
        masterAdmin.setAddresses(java.util.Collections.emptyList());
    userRepository.save(masterAdmin);
    }

    private void seedServices() {
        serviceRepository.saveAll(
            SeedDataFactory.buildDefaultServices() //! this is where my mock data for services is coming from
    );
    }

    private void seedMockUsers() {
        // fetch services AFTER they’ve been saved to database so they have IDs for the job history
        java.util.List<com.mbh.backend.models.Service> services =
                serviceRepository.findAll();
        // build mock users using factory
        java.util.List<com.mbh.backend.models.User> mockUsers =
            SeedDataFactory.buildMockUsers(services, passwordEncoder);
        userRepository.saveAll(mockUsers);
    }
}
