package com.mbh.backend.dto;

// DTO for user login credentials
public class LoginRequest {

    private String email;
    private String password;

    // Default constructor for deserialization
    public LoginRequest() {}

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}