package com.homesphere.homespherebackend.controller;


import com.homesphere.homespherebackend.domain.property.Property;
import com.homesphere.homespherebackend.dto.common.PageResponse;
import com.homesphere.homespherebackend.dto.property.PropertyRequestDto;
import com.homesphere.homespherebackend.dto.property.PropertyResponseDto;
import com.homesphere.homespherebackend.dto.property.PropertySearchParams;
import com.homesphere.homespherebackend.dto.property.PropertyStatusRequestDto;
import com.homesphere.homespherebackend.mapper.PageMapper;
import com.homesphere.homespherebackend.mapper.PropertyMapper;
import com.homesphere.homespherebackend.service.PropertyImageService;
import com.homesphere.homespherebackend.service.PropertyService;
import com.homesphere.homespherebackend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class PropertyController {

    private final PropertyService propertyService;
    private final UserService userService;
    private final PropertyMapper propertyMapper;
    private final PropertyImageService propertyImageStorageService;

    @PostMapping("/users/{userId}/properties")
    @ResponseStatus(HttpStatus.CREATED)
    public PropertyResponseDto createProperty(
            @PathVariable UUID userId,
            @Valid @RequestBody PropertyRequestDto request) {

        var property = propertyMapper.toEntity(request);

        property.setUser(
                userService.getUserById(userId)
        );

        return propertyMapper.toDto(
                propertyService.createProperty(property)
        );
    }

    @GetMapping("/properties/{propertyId}")
    public PropertyResponseDto getProperty(
            @PathVariable UUID propertyId) {

        return propertyMapper.toDto(
                propertyService.getPropertyById(propertyId)
        );
    }

    @GetMapping("/properties")
    public PageResponse<PropertyResponseDto> getAllProperties(
            @ModelAttribute PropertySearchParams params
    ) {
        Page<Property> pageResult =
                propertyService.searchProperties(
                        params.toFilter(),
                        params.toPageable()
                );

        return PageMapper.toPageResponse(
                pageResult,
                propertyMapper::toDto
        );
    }

    @GetMapping("/users/{userId}/properties")
    public List<PropertyResponseDto> getUserProperties(
            @PathVariable UUID userId) {

        return propertyService.getPropertiesByUser(userId)
                .stream()
                .map(propertyMapper::toDto)
                .toList();
    }

    @PutMapping("/properties/{propertyId}")
    public PropertyResponseDto updateProperty(
            @PathVariable UUID propertyId,
            @Valid @RequestBody PropertyRequestDto request) {

        var property =
                propertyService.getPropertyById(propertyId);

        propertyMapper.updateEntity(request, property);

        return propertyMapper.toDto(
                propertyService.updateProperty(property)
        );
    }

    @DeleteMapping("/properties/{propertyId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProperty(
            @PathVariable UUID propertyId) {

        propertyService.deleteProperty(propertyId);
    }

    @GetMapping("/properties/search")
    public List<PropertyResponseDto> searchProperties(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Integer bedrooms) {

        if (city != null) {
            return propertyService.findByCity(city)
                    .stream()
                    .map(propertyMapper::toDto)
                    .toList();
        }

        if (maxPrice != null) {
            return propertyService.findByMaxPrice(maxPrice)
                    .stream()
                    .map(propertyMapper::toDto)
                    .toList();
        }

        if (bedrooms != null) {
            return propertyService.findByBedrooms(bedrooms)
                    .stream()
                    .map(propertyMapper::toDto)
                    .toList();
        }

        return propertyService.getAllProperties()
                .stream()
                .map(propertyMapper::toDto)
                .toList();
    }

    @PostMapping("/properties/{propertyId}/images")
    public void addPropertyImage(@PathVariable UUID propertyId, @RequestParam("files") List<MultipartFile> files) {
        propertyImageStorageService.uploadImages(propertyId, files);
    }

    @DeleteMapping(
            "/properties/{propertyId}/images/{imageId}"
    )
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removePropertyImage(
            @PathVariable UUID propertyId,
            @PathVariable UUID imageId
    ) {

        propertyService.deleteImage(
                propertyId,
                imageId
        );
    }
}
