package com.homesphere.homespherebackend.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record UserRequestDto(

        @NotBlank
        String firstName,

        String lastName,

        @Email
        @NotBlank
        String email,

        String password,

        @Pattern(regexp = "^\\+?[0-9\\- ]{7,20}$")
        String phoneNumber
) {
}
