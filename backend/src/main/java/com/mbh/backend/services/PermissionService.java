package com.mbh.backend.services;

import com.mbh.backend.models.User;

// Defines permission rules for different user roles
public interface PermissionService {

    boolean canDeleteUser(User currentUser, User targetUser);

    boolean canViewReports(User currentUser);

    boolean canResetDatabase(User currentUser);
}