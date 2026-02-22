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
public class JwtUtil {
    private final Key key;
    //! private final long EXPIRATION_MS = 1000 * 60 * 60; // 1 hour  ---  FOR PRODUCTION, CHANGE BACK TO 1 HOUR BEFORE DEPLOYMENT ---
    //! private final long EXPIRATION_MS = 1000 * 15 * 1; //! 15 seconds  ---  FOR TESTING PURPOSES ONLY, CHANGE BACK TO 1 HOUR BEFORE DEPLOYMENT ---
    private final long EXPIRATION_MS = 1000 * 60 * 720; //! 12 hours  ---  FOR TESTING PURPOSES ONLY, CHANGE BACK TO 1 HOUR BEFORE DEPLOYMENT ---
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
    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }
    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }
    public String extractFirstName(String token) {
        return extractAllClaims(token).get("firstName", String.class);
    }
    public boolean isTokenValid(String token) {
        try {
            extractAllClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
