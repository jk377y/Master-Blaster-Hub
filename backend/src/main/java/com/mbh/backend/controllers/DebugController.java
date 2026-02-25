package com.mbh.backend.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
// Simple endpoint for verifying active MongoDB config
public class DebugController {

    @Value("${spring.mongodb.database}")
    private String dbName;

    // Returns basic database info for debugging
    @GetMapping("/debug")
    public Map<String, String> debug() {
        Map<String, String> res = new LinkedHashMap<>();
        res.put("spring.mongodb.database", dbName);
        return res;
    }
}