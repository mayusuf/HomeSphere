package com.homesphere.homespherebackend.domain.auth;

import com.homesphere.homespherebackend.domain.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "password_reset_tokens")
@Getter
@Setter
public class PasswordResetToken {

    @Id
    @GeneratedValue
    private UUID id;

    private String token;

    private Instant expiresAt;

    private boolean used;

    @ManyToOne
    private User user;
}