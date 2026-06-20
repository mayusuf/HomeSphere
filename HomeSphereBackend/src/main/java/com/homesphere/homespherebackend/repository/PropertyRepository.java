package com.homesphere.homespherebackend.repository;


import com.homesphere.homespherebackend.domain.property.Property;
import com.homesphere.homespherebackend.domain.property.PropertyStatus;
import com.homesphere.homespherebackend.domain.property.PropertyType;
import com.homesphere.homespherebackend.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PropertyRepository
        extends JpaRepository<Property, UUID>, JpaSpecificationExecutor<Property> {

    List<Property> findByUser(User user);

    List<Property> findByHouseType(PropertyType houseType);

    List<Property> findByPriceLessThanEqual(Double maxPrice);

    List<Property> findByBedrooms(Integer bedrooms);

    List<Property> findByAddressCityIgnoreCase(String city);

    List<Property> findByHouseTypeAndPriceLessThanEqual(
            PropertyType houseType,
            Double maxPrice
    );

    List<Property> findByStatus(PropertyStatus status);


    @Query("""
        SELECT DISTINCT p
        FROM Property p
        LEFT JOIN FETCH p.user
        LEFT JOIN FETCH p.images
    """)
    List<Property> findAllDetailed();

    @Query("""
        SELECT DISTINCT p
        FROM Property p
        LEFT JOIN FETCH p.user
        LEFT JOIN FETCH p.images
        WHERE p.user = :user
    """)
    List<Property> findPropertiesByUser(@Param("user") User user);

    @Query("""
        SELECT DISTINCT p
        FROM Property p
        LEFT JOIN FETCH p.user
        LEFT JOIN FETCH p.images
        WHERE p.propertyId = :id
    """)
    Optional<Property> findDetailedById(@Param("id") UUID id);
}