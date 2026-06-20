package com.homesphere.homespherebackend.dto.auth;

public record ResetPasswordRequest(
    String token,
    String password
) {
    
}
