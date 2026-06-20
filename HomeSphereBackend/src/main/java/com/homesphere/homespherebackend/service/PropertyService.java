package com.homesphere.homespherebackend.service;

import com.homesphere.homespherebackend.domain.property.Property;
import com.homesphere.homespherebackend.domain.property.PropertyStatus;
import com.homesphere.homespherebackend.domain.property.PropertyType;
import com.homesphere.homespherebackend.dto.property.PropertyFilter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.UUID;

public interface PropertyService {

    Property createProperty(Property property);

    Property updateProperty(Property property);

    void deleteProperty(UUID propertyId);

    Property getPropertyById(UUID propertyId);

    List<Property> getAllProperties();

    List<Property> getPropertiesByUser(UUID userId);

    List<Property> findByPropertyType(PropertyType type);

    List<Property> findByCity(String city);

    List<Property> findByMaxPrice(Double maxPrice);

    List<Property> findByBedrooms(Integer bedrooms);

    void incrementViewCount(UUID propertyId);

    Page<Property> searchProperties(
            PropertyFilter filter,
            Pageable pageable
    );

    Property updatePropertyStatus(
            UUID propertyId,
            PropertyStatus status
    );

    void deleteImage(
            UUID propertyId,
            UUID imageId
    );
}