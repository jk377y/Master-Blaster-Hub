package com.mbh.backend.controllers;

import com.mbh.backend.services.DatabaseResetService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin // allows frontend to call it
public class AdminController {
    private final DatabaseResetService databaseResetService;
    public AdminController(DatabaseResetService databaseResetService) {
        this.databaseResetService = databaseResetService;
    }
    @PostMapping("/reset")
    public ResponseEntity<String> resetDatabase(HttpServletRequest request) {
        String role = (String) request.getAttribute("role");
        if (role == null || !role.equals("ADMIN")) {
            return ResponseEntity.status(403).body("Access denied");
        }
        databaseResetService.resetDatabase();
        return ResponseEntity.ok("Database reset successfully.");
    }
}
