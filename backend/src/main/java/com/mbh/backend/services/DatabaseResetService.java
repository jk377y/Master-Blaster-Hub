package com.mbh.backend.services;

import com.mbh.backend.repositories.UserRepository;
import com.mbh.backend.repositories.ServiceRepository;
import org.springframework.stereotype.Service;

@Service
public class DatabaseResetService {

    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;

    public DatabaseResetService(UserRepository userRepository,
                                ServiceRepository serviceRepository) {
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
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
        masterAdmin.setPasswordHash("TEMP_PASSWORD_HASH"); //! temporary: replace this later when i implement real password hashing
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
        // will implement
    }

    private void seedMockUsers() {
        // will implement
    }
}
