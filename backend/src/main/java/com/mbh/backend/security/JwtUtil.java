package com.mbh.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
// Utility for generating and validating JWT tokens
public class JwtUtil {

    private final Key key;

    // Token expiration set to 1 hour
    private static final long EXPIRATION_MS = 1000 * 60 * 60;

    // Initializes signing key from application secret
    public JwtUtil(@Value("${JWT_SECRET}") String secret) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    // Generates signed JWT containing email, role, and first name
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

    // Extracts email (subject) from token
    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    // Extracts role claim from token
    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    // Extracts first name claim from token
    public String extractFirstName(String token) {
        return extractAllClaims(token).get("firstName", String.class);
    }

    // Validates token signature and expiration
    public boolean isTokenValid(String token) {
        try {
            extractAllClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // Parses and returns all claims from token
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}