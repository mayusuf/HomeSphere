package com.homesphere.homespherebackend.mapper;

import com.homesphere.homespherebackend.domain.inquiry.Inquiry;
import com.homesphere.homespherebackend.dto.inquiry.InquiryRequestDto;
import com.homesphere.homespherebackend.dto.inquiry.InquiryResponseDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(
        componentModel =
                MappingConstants.ComponentModel.SPRING
)
public interface InquiryMapper {

    @Mapping(target = "inquiryId", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "inquiryDate", ignore = true)
    @Mapping(target = "ownerResponse", ignore = true)
    @Mapping(target = "sender", ignore = true)
    @Mapping(target = "owner", ignore = true)
    @Mapping(target = "property", ignore = true)
    Inquiry toEntity(InquiryRequestDto dto);

    @Mapping(target = "senderId",
            source = "sender.userId")
    @Mapping(target = "ownerId",
            source = "owner.userId")
    @Mapping(target = "propertyId",
            source = "property.propertyId")
    InquiryResponseDto toDto(Inquiry inquiry);
}