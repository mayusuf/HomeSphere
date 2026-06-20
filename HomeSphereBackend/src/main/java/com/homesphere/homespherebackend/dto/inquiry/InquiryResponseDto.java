package com.homesphere.homespherebackend.dto.inquiry;

import com.homesphere.homespherebackend.domain.inquiry.InquiryStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record InquiryResponseDto(

        UUID inquiryId,

        String message,

        String ownerResponse,

        LocalDateTime inquiryDate,

        InquiryStatus status,

        UUID senderId,

        UUID ownerId,

        UUID propertyId
) {
}