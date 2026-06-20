package com.homesphere.homespherebackend.dto.favourite;

import java.time.LocalDateTime;
import java.util.UUID;

public record FavouriteResponseDto(

        UUID id,

        UUID userId,

        UUID propertyId,

        LocalDateTime dateSaved
) {
}