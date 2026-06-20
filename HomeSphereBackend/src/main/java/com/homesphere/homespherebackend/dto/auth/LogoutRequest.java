package com.homesphere.homespherebackend.dto.auth;

public record LogoutRequest(
        String refreshToken
) {
}
