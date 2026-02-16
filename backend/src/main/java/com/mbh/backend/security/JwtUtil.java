package com.mbh.backend.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    private final Key key;
    private final long EXPIRATION_MS = 1000 * 60 * 60; // 1 hour
    public JwtUtil(@Value("${JWT_SECRET}") String secret) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }
    public String generateToken(String email, String role, String firstName) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .claim("firstName", firstName)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(key)
                .compact();
    }
}
