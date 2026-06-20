package com.homesphere.homespherebackend.dto.property;

import com.homesphere.homespherebackend.domain.property.PropertyStatus;

public record PropertyStatusRequestDto(
        PropertyStatus status
) {
}
