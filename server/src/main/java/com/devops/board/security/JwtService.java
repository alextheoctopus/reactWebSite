package com.devops.board.security;

import com.devops.board.config.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private final JwtProperties jwtProperties;
    private final SecretKey signingKey;

    public JwtService(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
        this.signingKey = Keys.hmacShaKeyFor(jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(Long userId, String login, String name) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + jwtProperties.getExpirationMs());

        return Jwts.builder()
            .subject(login)
            .claim("uid", userId)
            .claim("name", name)
            .issuedAt(now)
            .expiration(expiry)
            .signWith(signingKey)
            .compact();
    }

    public Claims parseClaims(String token) {
        return Jwts.parser()
            .verifyWith(signingKey)
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    public AuthenticatedUser parseUser(String token) {
        Claims claims = parseClaims(token);
        Long userId = claims.get("uid", Number.class).longValue();
        String login = claims.getSubject();
        String name = claims.get("name", String.class);
        return new AuthenticatedUser(userId, login, name);
    }
}
