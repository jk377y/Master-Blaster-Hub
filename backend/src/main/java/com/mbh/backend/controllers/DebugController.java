package com.mbh.backend.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class DebugController {
    @Value("${spring.mongodb.uri}")
    private String dbUri;

    @Value("${spring.mongodb.database}")
    private String dbName;

    @GetMapping("/debug")
    public Map<String, String> debug() {
        Map<String, String> res = new LinkedHashMap<>();
        res.put("spring.mongodb.database", dbName);
        return res;
    }
}