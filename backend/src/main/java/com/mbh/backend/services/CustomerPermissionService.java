package com.mbh.backend.services;

import com.mbh.backend.models.User;
import org.springframework.stereotype.Service;

@Service
// Permission rules for regular customer users
public class CustomerPermissionService implements PermissionService {

    // Customers cannot delete users
    @Override
    public boolean canDeleteUser(User currentUser, User targetUser) {
        return false;
    }

    // Customers cannot view admin reports
    @Override
    public boolean canViewReports(User currentUser) {
        return false;
    }

    // Customers cannot reset the database
    @Override
    public boolean canResetDatabase(User currentUser) {
        return false;
    }
}