package com.mbh.backend.services;

import com.mbh.backend.models.User;
import org.springframework.stereotype.Service;

@Service
// Permission rules for admin users
public class AdminPermissionService implements PermissionService {

    // Allows deleting any non-system account
    @Override
    public boolean canDeleteUser(User currentUser, User targetUser) {
        return targetUser.getIsSystemAccount() == null
                || !targetUser.getIsSystemAccount();
    }

    // Admin can view all reports
    @Override
    public boolean canViewReports(User currentUser) {
        return true;
    }

    // Admin can reset the database
    @Override
    public boolean canResetDatabase(User currentUser) {
        return true;
    }
}