package com.mbh.backend.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
public class ConfigCheckController {

    @Value("${app.config.loaded:no}")
    private String loaded;

    @Value("${spring.mongodb.uri:NOT_SET}")
    private String mongoUri;

    @Value("${spring.mongodb.database:NOT_SET}")
    private String mongoDb;

    @GetMapping("/api/config-check")
    public Map<String, String> check() {
        Map<String, String> res = new LinkedHashMap<>();

        res.put("app.config.loaded", loaded);
        res.put("spring.mongodb.database", mongoDb);

        String uriHint =
                mongoUri.contains("mongodb+srv://") ? "mongodb+srv" :
                mongoUri.contains("localhost") ? "localhost" :
                mongoUri.equals("NOT_SET") ? "NOT_SET" :
                "other";

        res.put("spring.mongodb.uri", uriHint);
        return res;
    }
}