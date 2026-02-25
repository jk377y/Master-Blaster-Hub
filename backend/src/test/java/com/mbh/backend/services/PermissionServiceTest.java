package com.mbh.backend.services;

import com.mbh.backend.models.Role;
import com.mbh.backend.models.User;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class PermissionServiceTest {

    // Verifies that a customer user cannot delete any user account
    @Test
    void customerCannotDeleteUser() {
        CustomerPermissionService service = new CustomerPermissionService();
        User current = new User();
        current.setRole(Role.CUSTOMER);
        User target = new User();
        assertFalse(service.canDeleteUser(current, target));
    }

    // Verifies that an admin can delete a regular (non-system) user
    @Test
    void adminCanDeleteNonSystemUser() {
        AdminPermissionService service = new AdminPermissionService();
        User current = new User();
        current.setRole(Role.ADMIN);
        User target = new User();
        target.setIsSystemAccount(false);
        assertTrue(service.canDeleteUser(current, target));
    }

    // Verifies that even an admin cannot delete the protected system account
    @Test
    void adminCannotDeleteSystemAccount() {
        AdminPermissionService service = new AdminPermissionService();
        User current = new User();
        current.setRole(Role.ADMIN);
        User target = new User();
        target.setIsSystemAccount(true);
        assertFalse(service.canDeleteUser(current, target));
    }

    // Verifies that a customer does not have access to admin reports
    @Test
    void customerCannotViewReports() {
        CustomerPermissionService service = new CustomerPermissionService();
        User current = new User();
        current.setRole(Role.CUSTOMER);
        assertFalse(service.canViewReports(current));
    }

    // Verifies that an admin has permission to view reports
    @Test
    void adminCanViewReports() {
        AdminPermissionService service = new AdminPermissionService();
        User current = new User();
        current.setRole(Role.ADMIN);
        assertTrue(service.canViewReports(current));
    }
}