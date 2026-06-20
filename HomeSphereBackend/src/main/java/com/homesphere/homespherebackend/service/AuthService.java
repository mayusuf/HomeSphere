package com.homesphere.homespherebackend.service;

import com.homesphere.homespherebackend.dto.auth.LoginRequest;
import com.homesphere.homespherebackend.dto.auth.LoginResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request);
    LoginResponse refresh(String refreshToken);
    void logout(String refreshToken);
    void forgotPassword(String email);
    void resetPassword(String token, String newPassword);
}
