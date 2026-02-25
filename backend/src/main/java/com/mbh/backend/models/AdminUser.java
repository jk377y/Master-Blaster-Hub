package com.mbh.backend.models;

// Specialized User with full admin permissions
public class AdminUser extends User {

    @Override
    public String getPermissions() {
        return "FULL_ADMIN_ACCESS";
    }
}