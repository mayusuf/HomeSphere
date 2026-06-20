package com.homesphere.homespherebackend.dto.auth;

import com.homesphere.homespherebackend.dto.user.UserResponseDto;

public record LoginResponse(
    String token,
    String refreshToken,
    UserResponseDto user
) {
}
