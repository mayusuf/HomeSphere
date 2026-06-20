package com.homesphere.homespherebackend.mapper;


import com.homesphere.homespherebackend.domain.property.PropertyImage;
import com.homesphere.homespherebackend.dto.property.PropertyImageResponseDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PropertyImageMapper {

    PropertyImageResponseDto toDto(PropertyImage image);
}
