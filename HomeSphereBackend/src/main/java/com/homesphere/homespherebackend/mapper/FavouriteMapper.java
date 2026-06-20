package com.homesphere.homespherebackend.mapper;


import com.homesphere.homespherebackend.domain.favourite.Favourite;
import com.homesphere.homespherebackend.dto.favourite.FavouriteResponseDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(
        componentModel =
                MappingConstants.ComponentModel.SPRING
)
public interface FavouriteMapper {

    @Mapping(target = "id",
            source = "favouriteId")
    @Mapping(target = "userId",
            source = "user.userId")
    @Mapping(target = "propertyId",
            source = "property.propertyId")
    FavouriteResponseDto toDto(
            Favourite favourite
    );
}