package com.mbh.backend.models;

import org.springframework.data.annotation.Id;

import java.time.Instant;

// Base model for shared id and creation timestamp
public abstract class BaseEntity {

    @Id
    private String id;

    private Instant createdAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}