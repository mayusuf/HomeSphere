package com.homesphere.homespherebackend.mapper;

import com.homesphere.homespherebackend.domain.property.Property;
import com.homesphere.homespherebackend.dto.property.PropertyRequestDto;
import com.homesphere.homespherebackend.dto.property.PropertyResponseDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;

@Mapper(
        componentModel =
                MappingConstants.ComponentModel.SPRING,
        uses = AddressMapper.class
)
public interface PropertyMapper {

    @Mapping(target = "propertyId", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "viewCount", ignore = true)
    @Mapping(target = "listedDate", ignore = true)
    @Mapping(target = "approvalDate", ignore = true)
    Property toEntity(PropertyRequestDto dto);

    @Mapping(
            target = "ownerId",
            source = "user.userId"
    )
    @Mapping(target = "id", source = "propertyId")
    PropertyResponseDto toDto(Property property);

    @Mapping(target = "propertyId", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "viewCount", ignore = true)
    @Mapping(target = "listedDate", ignore = true)
    @Mapping(target = "approvalDate", ignore = true)
    @Mapping(target = "images", ignore = true)
    void updateEntity(
            PropertyRequestDto dto,
            @MappingTarget Property property
    );
}