package com.homesphere.homespherebackend.service.impl;

import java.time.Instant;
import java.util.UUID;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.homesphere.homespherebackend.domain.auth.PasswordResetToken;
import com.homesphere.homespherebackend.domain.auth.RefreshToken;
import com.homesphere.homespherebackend.domain.user.User;
import com.homesphere.homespherebackend.dto.auth.LoginRequest;
import com.homesphere.homespherebackend.dto.auth.LoginResponse;
import com.homesphere.homespherebackend.mapper.UserMapper;
import com.homesphere.homespherebackend.repository.PasswordResetTokenRepository;
import com.homesphere.homespherebackend.repository.RefreshTokenRepository;
import com.homesphere.homespherebackend.repository.UserRepository;
import com.homesphere.homespherebackend.security.JwtService;
import com.homesphere.homespherebackend.service.AuthService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

        private final AuthenticationManager authManager;
        private final UserRepository userRepository;
        private final JwtService jwtService;
        private final RefreshTokenRepository refreshTokenRepository;
        private final PasswordResetTokenRepository passwordResetTokenRepository;
        private final PasswordEncoder passwordEncoder;
        private final UserMapper userMapper;

        @Override
        public LoginResponse login(LoginRequest request) {
                authManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.email(),
                                                request.password()));

                User user = userRepository.findByEmail(
                                request.email())
                                .orElseThrow();

                String token = jwtService.generateToken(user);
                String refreshToken = jwtService.generateRefreshToken(user);

                RefreshToken refreshTokenEntity = new RefreshToken();

                refreshTokenEntity.setToken(refreshToken);
                refreshTokenEntity.setUser(user);
                refreshTokenEntity.setRevoked(false);
                refreshTokenEntity.setExpiresAt(
                                Instant.now().plusSeconds(60 * 60 * 24 * 7));

                refreshTokenRepository.save(refreshTokenEntity);

                return new LoginResponse(token, refreshToken, userMapper.toDto(user));
        }

        @Override
        public LoginResponse refresh(String refreshToken) {
                RefreshToken token = refreshTokenRepository
                                .findByToken(refreshToken)
                                .orElseThrow();

                if (token.isRevoked()) {
                        throw new RuntimeException();
                }

                if (token.getExpiresAt()
                                .isBefore(Instant.now())) {

                        throw new RuntimeException();
                }

                User user = token.getUser();

                String accessToken = jwtService.generateToken(user);

                return new LoginResponse(accessToken, refreshToken, userMapper.toDto(user));
        }

        @Override
        public void logout(String refreshToken) {
                RefreshToken token = refreshTokenRepository
                                .findByToken(refreshToken)
                                .orElseThrow();

                token.setRevoked(true);
                refreshTokenRepository.save(token);
        }

        @Override
        public void forgotPassword(String email) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow();
                // TODO: Generate reset token and log it
                String token = UUID.randomUUID().toString();
                System.out.println("Reset token: " + token);
                PasswordResetToken resetToken = new PasswordResetToken();

                resetToken.setToken(token);

                resetToken.setUser(user);

                resetToken.setUsed(false);

                resetToken.setExpiresAt(
                                Instant.now()
                                                .plusSeconds(1800));

                passwordResetTokenRepository
                                .save(resetToken);
        }

        @Override
        public void resetPassword(
                        String token,
                        String newPassword) {

                PasswordResetToken resetToken = passwordResetTokenRepository
                                .findByToken(token)
                                .orElseThrow();

                if (resetToken.isUsed()) {
                        throw new RuntimeException(
                                        "Token already used");
                }

                if (resetToken.getExpiresAt()
                                .isBefore(Instant.now())) {

                        throw new RuntimeException(
                                        "Token expired");
                }

                User user = resetToken.getUser();

                user.setPassword(
                                passwordEncoder.encode(
                                                newPassword));

                userRepository.save(user);

                resetToken.setUsed(true);

                passwordResetTokenRepository
                                .save(resetToken);

                refreshTokenRepository
                                .findByUser(user)
                                .forEach(tokenEntity -> {
                                        tokenEntity.setRevoked(true);
                                        refreshTokenRepository
                                                        .save(tokenEntity);
                                });
        }
}
