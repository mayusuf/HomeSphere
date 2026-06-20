package com.homesphere.homespherebackend.service.impl;


import com.homesphere.homespherebackend.domain.property.Property;
import com.homesphere.homespherebackend.domain.property.PropertyImage;
import com.homesphere.homespherebackend.domain.property.PropertyStatus;
import com.homesphere.homespherebackend.domain.property.PropertyType;
import com.homesphere.homespherebackend.domain.user.User;
import com.homesphere.homespherebackend.dto.property.PropertyFilter;
import com.homesphere.homespherebackend.exception.ResourceNotFoundException;
import com.homesphere.homespherebackend.repository.PropertyImageRepository;
import com.homesphere.homespherebackend.repository.PropertyRepository;
import com.homesphere.homespherebackend.repository.UserRepository;
import com.homesphere.homespherebackend.service.PropertyService;
import com.homesphere.homespherebackend.specification.PropertySpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class PropertyServiceImpl implements PropertyService {

    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final PropertyImageRepository propertyImageRepository;

    @Override
    public Property createProperty(Property property) {

        property.setStatus(PropertyStatus.PENDING);
        property.setViewCount(0);
        property.setListedDate(LocalDate.now());

        return propertyRepository.save(property);
    }

    @Override
    public Property updateProperty(Property property) {

        Property existing = getPropertyById(property.getPropertyId());

        existing.setDescriptionHtml(property.getDescriptionHtml());
        existing.setPrice(property.getPrice());
        existing.setBedrooms(property.getBedrooms());
        existing.setBathrooms(property.getBathrooms());
        existing.setHouseType(property.getHouseType());
        existing.setAddress(property.getAddress());
        existing.setListingAgentName(property.getListingAgentName());
        existing.setListingAgentPhone(property.getListingAgentPhone());
        existing.setSquareFootage(property.getSquareFootage());
        existing.setListingFor(property.getListingFor());

        return propertyRepository.save(existing);
    }

    @Override
    public void deleteProperty(UUID propertyId) {

        Property property = getPropertyById(propertyId);

        propertyRepository.delete(property);
    }

    @Override
    @Transactional(readOnly = true)
    public Property getPropertyById(UUID propertyId) {

        return propertyRepository.findDetailedById(propertyId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Property not found: " + propertyId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Property> getAllProperties() {

        return propertyRepository.findAllDetailed();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Property> getPropertiesByUser(UUID userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found: " + userId));

        return propertyRepository.findPropertiesByUser(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Property> findByPropertyType(PropertyType type) {

        return propertyRepository.findByHouseType(type);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Property> findByCity(String city) {

        return propertyRepository.findByAddressCityIgnoreCase(city);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Property> findByMaxPrice(Double maxPrice) {

        return propertyRepository.findByPriceLessThanEqual(maxPrice);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Property> findByBedrooms(Integer bedrooms) {

        return propertyRepository.findByBedrooms(bedrooms);
    }

    @Override
    public void incrementViewCount(UUID propertyId) {

        Property property = getPropertyById(propertyId);

        property.setViewCount(
                property.getViewCount() + 1
        );

        propertyRepository.save(property);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Property> searchProperties(
            PropertyFilter filter,
            Pageable pageable) {

        return propertyRepository.findAll(
                PropertySpecification.withFilters(filter),
                pageable
        );
    }

    @Override
    public Property updatePropertyStatus(
            UUID propertyId,
            PropertyStatus status
    ) {

        Property property = getPropertyById(propertyId);

        property.setStatus(status);

        if (status == PropertyStatus.APPROVED) {
            property.setApprovalDate(LocalDate.now());
        }

        return propertyRepository.save(property);
    }

    @Override
    @Transactional
    public void deleteImage(
            UUID propertyId,
            UUID imageId
    ) {

        Property property = getPropertyById(propertyId);

        PropertyImage image =
                property.getImages()
                        .stream()
                        .filter(i ->
                                i.getImageId()
                                        .equals(imageId))
                        .findFirst()
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Image not found"
                                ));

        property.getImages().remove(image);

        propertyRepository.save(property);

        propertyImageRepository.delete(
               image
        );
    }
}