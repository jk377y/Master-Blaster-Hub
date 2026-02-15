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
        // will implement
    }

    private void seedServices() {
        // will implement
    }

    private void seedMockUsers() {
        // will implement
    }
}
