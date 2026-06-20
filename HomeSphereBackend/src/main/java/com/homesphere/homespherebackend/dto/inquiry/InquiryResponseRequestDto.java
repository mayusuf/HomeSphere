package com.homesphere.homespherebackend.dto.inquiry;

import jakarta.validation.constraints.NotBlank;

public record InquiryResponseRequestDto(

        @NotBlank
        String response
) {
}