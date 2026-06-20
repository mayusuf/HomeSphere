package com.homesphere.homespherebackend.service.impl;

import com.homesphere.homespherebackend.domain.property.Property;
import com.homesphere.homespherebackend.domain.property.PropertyImage;
import com.homesphere.homespherebackend.dto.property.PropertyImageResponseDto;
import com.homesphere.homespherebackend.exception.ResourceNotFoundException;
import com.homesphere.homespherebackend.mapper.PropertyImageMapper;
import com.homesphere.homespherebackend.repository.PropertyImageRepository;
import com.homesphere.homespherebackend.repository.PropertyRepository;
import com.homesphere.homespherebackend.service.FileStorageService;
import com.homesphere.homespherebackend.service.PropertyImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PropertyImageServiceImpl
        implements PropertyImageService {

    private final PropertyRepository propertyRepository;
    private final PropertyImageRepository imageRepository;
    private final FileStorageService fileStorageService;
    private final PropertyImageMapper propertyImageMapper;

    @Override
    public List<PropertyImageResponseDto> uploadImages(
            UUID propertyId,
            List<MultipartFile> files) {

        Property property =
                propertyRepository.findById(propertyId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Property not found"));

        List<PropertyImage> images =
                new ArrayList<>();

        int order = property.getImages().size();

        for (MultipartFile file : files) {

            String url =
                    fileStorageService.upload(file);

            PropertyImage image =
                    new PropertyImage();

            image.setProperty(property);
            image.setFileName(
                    file.getOriginalFilename());

            image.setImageUrl(url);

            image.setDisplayOrder(order++);

            images.add(
                    imageRepository.save(image));
        }

        return images.stream()
                .map(propertyImageMapper::toDto)
                .toList();
    }
}