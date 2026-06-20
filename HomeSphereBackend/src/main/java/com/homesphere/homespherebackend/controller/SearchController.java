package com.homesphere.homespherebackend.controller;


import com.homesphere.homespherebackend.domain.property.Property;
import com.homesphere.homespherebackend.domain.property.PropertyStatus;
import com.homesphere.homespherebackend.dto.common.PageResponse;
import com.homesphere.homespherebackend.dto.property.PropertyResponseDto;
import com.homesphere.homespherebackend.dto.property.PropertySearchParams;
import com.homesphere.homespherebackend.mapper.PageMapper;
import com.homesphere.homespherebackend.mapper.PropertyMapper;
import com.homesphere.homespherebackend.service.PropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/search")
public class SearchController {

    private final PropertyService propertyService;
    private final PropertyMapper propertyMapper;

    @GetMapping
    public PageResponse<PropertyResponseDto> getAllProperties(
            @ModelAttribute PropertySearchParams params
    ) {
        Pageable pageable = params.toPageable();

        Page<Property> pageResult = propertyService.searchProperties(params.toFilter(), pageable);

        List<Property> approvedProperties = pageResult.stream()
                .filter(property -> property.getStatus() == PropertyStatus.APPROVED)
                .toList();

        Page<Property> approvedPage = new PageImpl<>(
                approvedProperties,
                pageable,
                approvedProperties.size()
        );

        return PageMapper.toPageResponse(
                approvedPage,
                propertyMapper::toDto
        );
    }


    @GetMapping("/{propertyId}")
    public PropertyResponseDto getProperty(
            @PathVariable UUID propertyId) {

        return propertyMapper.toDto(
                propertyService.getPropertyById(propertyId)
        );
    }

}
