package com.homesphere.homespherebackend.dto.property;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class PropertyImageResponseDto {

    private UUID imageId;

    private String imageUrl;

    private Boolean primaryImage;
}