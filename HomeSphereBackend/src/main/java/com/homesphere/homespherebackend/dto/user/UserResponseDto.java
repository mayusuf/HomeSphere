package com.homesphere.homespherebackend.dto.user;

import java.util.UUID;

public record UserResponseDto(

        UUID id,

        String firstName,

        String lastName,

        String email,

        String phoneNumber,

        Boolean isActive,
        String role
) {
}