package com.homesphere.homespherebackend.dto.owner;

import java.util.UUID;

public record OwnerResponseDto(

        UUID id,

        String firstName,

        String lastName,

        String email,

        String phoneNumber,

        Boolean isActive
) {
}