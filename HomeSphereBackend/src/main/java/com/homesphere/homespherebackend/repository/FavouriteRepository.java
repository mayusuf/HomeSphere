package com.homesphere.homespherebackend.repository;


import com.homesphere.homespherebackend.domain.favourite.Favourite;
import com.homesphere.homespherebackend.domain.property.Property;
import com.homesphere.homespherebackend.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FavouriteRepository
        extends JpaRepository<Favourite, UUID> {

    List<Favourite> findByUser(User user);

    List<Favourite> findByProperty(Property property);

    Optional<Favourite> findByUserAndProperty(
            User user,
            Property property
    );

    boolean existsByUserAndProperty(
            User user,
            Property property
    );
}