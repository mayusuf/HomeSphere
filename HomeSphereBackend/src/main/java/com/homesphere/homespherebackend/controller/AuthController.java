package com.homesphere.homespherebackend.controller;

import com.homesphere.homespherebackend.dto.auth.ForgotPasswordRequest;
import com.homesphere.homespherebackend.dto.auth.LoginRequest;
import com.homesphere.homespherebackend.dto.auth.LoginResponse;
import com.homesphere.homespherebackend.dto.auth.LogoutRequest;
import com.homesphere.homespherebackend.dto.auth.RefreshRequest;
import com.homesphere.homespherebackend.dto.auth.ResetPasswordRequest;
import com.homesphere.homespherebackend.mapper.UserMapper;
import com.homesphere.homespherebackend.service.AuthService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(
            @RequestBody LoginRequest request) {

        return authService.login(request);
    }
    
    @PostMapping("/refresh")
    public LoginResponse refresh(
            @RequestBody RefreshRequest request) {

        return authService.refresh(request.refreshToken());
    }

    @PostMapping("/logout")
    public void logout(@RequestBody LogoutRequest request) {
        authService.logout(request.refreshToken());
    }

    @PostMapping("/forgot-password")
    public void forgotPassword(@RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request.email());
    }

    @PostMapping("/reset-password")
    public void resetPassword(@RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.token(), request.password());
    }
}
