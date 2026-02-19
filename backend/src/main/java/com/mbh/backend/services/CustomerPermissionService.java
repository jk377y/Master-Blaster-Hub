package com.mbh.backend.services;

import com.mbh.backend.models.User;
import org.springframework.stereotype.Service;

@Service
public class CustomerPermissionService implements PermissionService {
    @Override
    public boolean canDeleteUser(User currentUser, User targetUser) {
        return false;
    }
    @Override
    public boolean canViewReports(User currentUser) {
        return false;
    }
    @Override
    public boolean canResetDatabase(User currentUser) {
        return false;
    }
}
