package com.homesphere.homespherebackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.homesphere.homespherebackend.domain.property.PropertyImage;

import java.util.List;
import java.util.UUID;

public interface PropertyImageRepository
        extends JpaRepository<PropertyImage, UUID> {

    List<PropertyImage> findByPropertyPropertyId(UUID propertyId);
}