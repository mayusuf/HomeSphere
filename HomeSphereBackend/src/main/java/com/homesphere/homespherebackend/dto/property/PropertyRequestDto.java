package com.homesphere.homespherebackend.dto.property;


import com.homesphere.homespherebackend.domain.property.PropertyType;
import com.homesphere.homespherebackend.dto.common.AddressDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record PropertyRequestDto(

        String descriptionHtml,

        @NotNull
        @Positive
        Double price,

        @NotNull
        @Min(0)
        Integer bedrooms,

        @NotNull
        @Min(0)
        Integer bathrooms,

        @NotNull
        PropertyType houseType,

        String listingFor,

        Double squareFootage,

        String listingAgentName,

        String listingAgentPhone,

        @Valid
        @NotNull
        AddressDto address
) {
}