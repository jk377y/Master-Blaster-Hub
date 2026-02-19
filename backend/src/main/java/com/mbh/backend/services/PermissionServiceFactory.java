package com.mbh.backend.services;

import com.mbh.backend.models.Role;
import com.mbh.backend.models.User;
import org.springframework.stereotype.Component;

@Component
public class PermissionServiceFactory {
    private final AdminPermissionService adminPermissionService;
    private final CustomerPermissionService customerPermissionService;
    public PermissionServiceFactory(AdminPermissionService adminPermissionService,
                                    CustomerPermissionService customerPermissionService) {
        this.adminPermissionService = adminPermissionService;
        this.customerPermissionService = customerPermissionService;
    }
    public PermissionService getPermissionService(User user) {
        if (user.getRole() == Role.ADMIN) {
            return adminPermissionService;
        }
        return customerPermissionService;
    }
}
