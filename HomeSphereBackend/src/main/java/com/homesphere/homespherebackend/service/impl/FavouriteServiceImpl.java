package com.homesphere.homespherebackend.service.impl;

import com.homesphere.homespherebackend.domain.favourite.Favourite;
import com.homesphere.homespherebackend.domain.property.Property;
import com.homesphere.homespherebackend.domain.user.User;
import com.homesphere.homespherebackend.exception.ResourceNotFoundException;
import com.homesphere.homespherebackend.repository.FavouriteRepository;
import com.homesphere.homespherebackend.repository.PropertyRepository;
import com.homesphere.homespherebackend.repository.UserRepository;
import com.homesphere.homespherebackend.service.FavouriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class FavouriteServiceImpl
        implements FavouriteService {

    private final FavouriteRepository favouriteRepository;

    private final UserRepository userRepository;

    private final PropertyRepository propertyRepository;

    @Override
    public Favourite addFavourite(
            UUID userId,
            UUID propertyId
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found: "
                                        + userId));

        Property property =
                propertyRepository.findById(propertyId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Property not found: "
                                                + propertyId));

        return favouriteRepository
                .findByUserAndProperty(
                        user,
                        property
                )
                .orElseGet(() -> {

                    Favourite favourite =
                            new Favourite();

                    favourite.setUser(user);
                    favourite.setProperty(property);
                    favourite.setDateSaved(
                            LocalDateTime.now()
                    );

                    return favouriteRepository
                            .save(favourite);
                });
    }

    @Override
    public void removeFavourite(
            UUID userId,
            UUID propertyId
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found: "
                                        + userId));

        Property property =
                propertyRepository.findById(propertyId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Property not found: "
                                                + propertyId));

        favouriteRepository.findByUserAndProperty(
                        user,
                        property
                )
                .ifPresent(
                        favouriteRepository::delete
                );
    }

    @Override
    @Transactional(readOnly = true)
    public List<Favourite> getFavouritesByUser(
            UUID userId
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found: "
                                        + userId));

        return favouriteRepository.findByUser(
                user
        );
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isFavourite(
            UUID userId,
            UUID propertyId
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found: "
                                        + userId));

        Property property =
                propertyRepository.findById(propertyId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Property not found: "
                                                + propertyId));

        return favouriteRepository
                .existsByUserAndProperty(
                        user,
                        property
                );
    }
}