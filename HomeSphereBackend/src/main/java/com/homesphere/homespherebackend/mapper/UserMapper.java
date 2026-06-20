package com.homesphere.homespherebackend.mapper;

import com.homesphere.homespherebackend.domain.user.User;
import com.homesphere.homespherebackend.dto.user.UserRequestDto;
import com.homesphere.homespherebackend.dto.user.UserResponseDto;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING

)
public interface UserMapper {

    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "properties", ignore = true)
    @Mapping(target = "sentInquiries", ignore = true)
    @Mapping(target = "appointments", ignore = true)
    @Mapping(target = "favourites", ignore = true)
    User toEntity(UserRequestDto dto);

    @Mapping(target = "id", source = "userId")
    UserResponseDto toDto(User user);

    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "properties", ignore = true)
    @Mapping(target = "sentInquiries", ignore = true)
    @Mapping(target = "appointments", ignore = true)
    @Mapping(target = "favourites", ignore = true)
    void updateEntity(
            UserRequestDto dto,
            @MappingTarget User user
    );
}