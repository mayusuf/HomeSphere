package com.homesphere.homespherebackend.dto.auth;

public record LoginRequest(
    String email,
    String password
) {
}
