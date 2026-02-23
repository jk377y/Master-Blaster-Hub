package com.mbh.backend.dto;

import com.mbh.backend.models.Role;
import java.time.Instant;

public class CustomerSearchResult {

    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private Role role;
    private Boolean isActive;
    private Instant createdAt;

    public CustomerSearchResult(String id,
                                String email,
                                String firstName,
                                String lastName,
                                Role role,
                                Boolean isActive,
                                Instant createdAt) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.isActive = isActive;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }
    public String getEmail() { return email; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public Role getRole() { return role; }
    public Boolean getIsActive() { return isActive; }
    public Instant getCreatedAt() { return createdAt; }
}