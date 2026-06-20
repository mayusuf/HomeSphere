package com.homesphere.homespherebackend.controller;

import com.homesphere.homespherebackend.dto.favourite.FavouriteResponseDto;
import com.homesphere.homespherebackend.mapper.FavouriteMapper;
import com.homesphere.homespherebackend.service.FavouriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/favourites/{userId}")
@RequiredArgsConstructor
public class FavouriteController {

    private final FavouriteService favouriteService;

    private final FavouriteMapper favouriteMapper;

    @PostMapping("/{propertyId}")
    @ResponseStatus(HttpStatus.CREATED)
    public FavouriteResponseDto addFavourite(
            @PathVariable UUID userId,
            @PathVariable UUID propertyId
    ) {

        return favouriteMapper.toDto(
                favouriteService.addFavourite(
                        userId,
                        propertyId
                )
        );
    }

    @DeleteMapping("/{propertyId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeFavourite(
            @PathVariable UUID userId,
            @PathVariable UUID propertyId
    ) {

        favouriteService.removeFavourite(
                userId,
                propertyId
        );
    }

    @GetMapping
    public List<FavouriteResponseDto>
    getFavouritesByUser(
            @PathVariable UUID userId
    ) {

        return favouriteService
                .getFavouritesByUser(userId)
                .stream()
                .map(favouriteMapper::toDto)
                .toList();
    }

    @GetMapping("/{propertyId}/exists")
    public boolean isFavourite(
            @PathVariable UUID userId,
            @PathVariable UUID propertyId
    ) {

        return favouriteService.isFavourite(
                userId,
                propertyId
        );
    }
}