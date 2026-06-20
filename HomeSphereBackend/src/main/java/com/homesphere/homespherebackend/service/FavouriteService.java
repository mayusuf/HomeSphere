package com.homesphere.homespherebackend.service;

import com.homesphere.homespherebackend.domain.favourite.Favourite;

import java.util.List;
import java.util.UUID;

public interface FavouriteService {

    Favourite addFavourite(
            UUID userId,
            UUID propertyId
    );

    void removeFavourite(
            UUID userId,
            UUID propertyId
    );

    List<Favourite> getFavouritesByUser(
            UUID userId
    );

    boolean isFavourite(
            UUID userId,
            UUID propertyId
    );
}