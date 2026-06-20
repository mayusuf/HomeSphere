package com.homesphere.homespherebackend.security;

import com.homesphere.homespherebackend.domain.user.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey secretKey =
            Keys.hmacShaKeyFor(
                    "your-super-secret-key-must-be-32-characters"
                            .getBytes()
            );

    public String generateToken(User user) {

        return Jwts.builder()
                .subject(user.getEmail())
                .claim("userId",
                        user.getUserId().toString())
                .claim("role",
                        user.getRole().name())
                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + 86400000
                        )
                )
                .signWith(secretKey)
                .compact();
    }
    
    public String generateRefreshToken(User user) {
        return Jwts.builder()
                .subject(user.getEmail())
                .claim("userId",
                        user.getUserId().toString())
                .claim("role",
                        user.getRole().name())
                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + 86400000 * 7
                        )
                )
                .signWith(secretKey)
                .compact();
    }

    public String extractUsername(String token) {

        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }
}