package com.mbh.backend.services;

import com.mbh.backend.models.Role;
import com.mbh.backend.models.User;
import org.springframework.stereotype.Component;

@Component
// Returns correct permission service based on user role
public class PermissionServiceFactory {

    private final AdminPermissionService adminPermissionService;
    private final CustomerPermissionService customerPermissionService;

    // Injects concrete permission service implementations
    public PermissionServiceFactory(AdminPermissionService adminPermissionService,
                                    CustomerPermissionService customerPermissionService) {
        this.adminPermissionService = adminPermissionService;
        this.customerPermissionService = customerPermissionService;
    }

    // Selects appropriate permission logic for a user
    public PermissionService getPermissionService(User user) {
        if (user.getRole() == Role.ADMIN) {
            return adminPermissionService;
        }
        return customerPermissionService;
    }
}