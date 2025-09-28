package com.plateful.backend.auth.dto;

public record LoginResponse(
        String accessToken,
        String refreshToken,
        long   expiresIn // seconds for the access token
) {}
