package com.plateful.backend.auth;

import com.plateful.backend.model.AppUser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

@Service
public class JwtService {
    private final byte[] secret;
    private final long accessTtlSec;
    private final long refreshTtlSec;

    public JwtService(
            @Value("${jwt.secret}") String secret,
            @Value("${auth.accessTtlSec}") long accessTtlSec,
            @Value("${auth.refreshTtlSec}") long refreshTtlSec
    ) {
        this.secret = secret.getBytes(StandardCharsets.UTF_8);
        this.accessTtlSec = accessTtlSec;
        this.refreshTtlSec = refreshTtlSec;
    }

    public String generateAccessToken(AppUser user) {
        Instant now = Instant.now();
        return Jwts.builder()
                .setSubject(user.getId() != null ? user.getId() : user.getEmail())
                .claim("email", user.getEmail())
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plusSeconds(accessTtlSec)))
                .signWith(Keys.hmacShaKeyFor(secret))
                .compact();
    }

    public String generateRefreshToken(AppUser user) {
        Instant now = Instant.now();
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("type", "refresh")
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plusSeconds(refreshTtlSec)))
                .signWith(Keys.hmacShaKeyFor(secret))
                .compact();
    }

    public long getAccessTtlSec() { return accessTtlSec; }
}
