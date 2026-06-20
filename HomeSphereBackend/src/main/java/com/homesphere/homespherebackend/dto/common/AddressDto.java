package com.homesphere.homespherebackend.dto.common;


import jakarta.validation.constraints.NotBlank;

public record AddressDto(

        @NotBlank
        String street,

        @NotBlank
        String city,

        @NotBlank
        String state,

        @NotBlank
        String zipCode
) {
}