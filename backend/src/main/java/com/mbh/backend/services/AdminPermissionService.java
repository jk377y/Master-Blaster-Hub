package com.mbh.backend.services;

import com.mbh.backend.models.User;
import org.springframework.stereotype.Service;

@Service
public class AdminPermissionService implements PermissionService {
    @Override
    public boolean canDeleteUser(User currentUser, User targetUser) {
        return targetUser.getIsSystemAccount() == null || !targetUser.getIsSystemAccount();
    }
    @Override
    public boolean canViewReports(User currentUser) {
        return true;
    }
    @Override
        public boolean canResetDatabase(User currentUser) {
    return true;
    }
}
