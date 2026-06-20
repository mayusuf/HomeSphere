package com.homesphere.homespherebackend.mapper;

import com.homesphere.homespherebackend.domain.property.Address;
import com.homesphere.homespherebackend.dto.common.AddressDto;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.springframework.stereotype.Component;

@Mapper(
        componentModel =
                MappingConstants.ComponentModel.SPRING
)
public interface AddressMapper {

    AddressDto toDto(Address address);

    Address toEntity(AddressDto dto);
}
