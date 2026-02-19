package com.mbh.backend.models;

import org.springframework.data.annotation.Id;
import java.time.Instant;

public abstract class BaseEntity {
    @Id
    private String id;
    private Instant createdAt;

    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
