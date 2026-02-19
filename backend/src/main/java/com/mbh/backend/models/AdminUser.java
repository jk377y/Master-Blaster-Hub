package com.mbh.backend.models;

public class AdminUser extends User {

    @Override
    public String getPermissions() {
        return "FULL_ADMIN_ACCESS";
    }
}