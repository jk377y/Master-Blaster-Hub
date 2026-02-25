package com.mbh.backend.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
// Basic health check endpoint for uptime monitoring on on the ALB on AWS
public class HealthController {

    // Returns simple service status
    @GetMapping("/api/health")
    public Map<String, String> health() {
        return Map.of("status", "UP");
    }
}
