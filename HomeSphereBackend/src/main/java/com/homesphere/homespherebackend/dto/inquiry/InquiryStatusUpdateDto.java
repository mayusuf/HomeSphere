package com.homesphere.homespherebackend.dto.inquiry;

import com.homesphere.homespherebackend.domain.inquiry.InquiryStatus;
import jakarta.validation.constraints.NotNull;

public record InquiryStatusUpdateDto(

        @NotNull
        InquiryStatus status
) {
}