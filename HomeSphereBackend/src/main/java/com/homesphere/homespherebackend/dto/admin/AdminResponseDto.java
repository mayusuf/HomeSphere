package com.homesphere.homespherebackend.dto.admin;

import java.util.UUID;

public record AdminResponseDto(

        UUID id,

        String firstName,

        String lastName,

        String email,

        String phoneNumber,

        Boolean isActive
) {
}
