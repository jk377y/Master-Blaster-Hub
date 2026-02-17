package com.mbh.backend.controllers;

// import com.mbh.backend.models.User;
// import com.mbh.backend.repositories.UserRepository;

import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
// import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiController {

    // private final UserRepository userRepository;

    // public ApiController(UserRepository userRepository) {
    //     this.userRepository = userRepository;
    // }

    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> res = new LinkedHashMap<>();
        res.put("status", "ok");
        return res;
    }

    // @GetMapping("/users")
    // public List<User> getAllUsers() {
    //     return userRepository.findAll();
    // }
}