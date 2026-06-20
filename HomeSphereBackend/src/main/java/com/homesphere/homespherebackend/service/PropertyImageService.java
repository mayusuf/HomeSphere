package com.homesphere.homespherebackend.service;

import java.util.List;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import com.homesphere.homespherebackend.dto.property.PropertyImageResponseDto;

public interface PropertyImageService {
    public List<PropertyImageResponseDto> uploadImages(UUID propertyId, List<MultipartFile> files);
}
