package com.homesphere.homespherebackend.dto.owner;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record OwnerRequestDto(

        @NotBlank
        String firstName,

        String lastName,

        @Email
        @NotBlank
        String email,

        @NotBlank
        String password,

        @Pattern(regexp = "^\\+?[0-9\\- ]{7,20}$")
        String phoneNumber
) {
}
