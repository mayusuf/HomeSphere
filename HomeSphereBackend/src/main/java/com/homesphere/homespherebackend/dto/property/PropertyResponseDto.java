package com.homesphere.homespherebackend.dto.property;


import com.homesphere.homespherebackend.domain.property.PropertyStatus;
import com.homesphere.homespherebackend.domain.property.PropertyType;
import com.homesphere.homespherebackend.dto.common.AddressDto;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record PropertyResponseDto(

        UUID id,

        LocalDate listedDate,

        String descriptionHtml,

        Double price,

        Integer bedrooms,

        Integer bathrooms,

        PropertyStatus status,

        PropertyType houseType,

        Integer viewCount,

        AddressDto address,

        UUID ownerId,

        String listingFor,

        Double squareFootage,

        String listingAgentName,

        String listingAgentPhone,


        List<PropertyImageResponseDto> images
) {
}
