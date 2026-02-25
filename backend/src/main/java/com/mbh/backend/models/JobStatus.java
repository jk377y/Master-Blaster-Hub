package com.mbh.backend.models;

// Defines lifecycle states for a job
public enum JobStatus {
    REQUESTED,
    QUOTED,
    APPROVED,
    DECLINED,
    COMPLETED,
    CANCELLED
}