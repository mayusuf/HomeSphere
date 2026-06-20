package com.homesphere.homespherebackend.controller;

import com.homesphere.homespherebackend.domain.property.Property;
import com.homesphere.homespherebackend.domain.property.PropertyStatus;
import com.homesphere.homespherebackend.dto.common.PageResponse;
import com.homesphere.homespherebackend.dto.property.PropertyResponseDto;
import com.homesphere.homespherebackend.dto.property.PropertySearchParams;
import com.homesphere.homespherebackend.dto.property.PropertyStatusRequestDto;
import com.homesphere.homespherebackend.dto.user.UserRequestDto;
import com.homesphere.homespherebackend.dto.user.UserResponseDto;
import com.homesphere.homespherebackend.mapper.PageMapper;
import com.homesphere.homespherebackend.mapper.PropertyMapper;
import com.homesphere.homespherebackend.mapper.UserMapper;
import com.homesphere.homespherebackend.service.PropertyService;
import com.homesphere.homespherebackend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/api/v1/admins")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final UserMapper userMapper;
    private final PropertyService propertyService;
    private final PropertyMapper propertyMapper;

    @GetMapping("/users/{userId}")
    public UserResponseDto getUser(
            @PathVariable UUID userId) {

        return userMapper.toDto(
                userService.getUserById(userId)
        );
    }

    @GetMapping("/users")
    public List<UserResponseDto> getAllUsers() {

        return userService.getAllUsers()
                .stream()
                .map(userMapper::toDto)
                .toList();
    }

    @PutMapping("/users/{userId}")
    public UserResponseDto updateUser(
            @PathVariable UUID userId,
            @Valid @RequestBody UserRequestDto request) {

        var user =
                userService.getUserById(userId);

        userMapper.updateEntity(request, user);

        return userMapper.toDto(
                userService.updateUser(user)
        );
    }

    @DeleteMapping("/users/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(
            @PathVariable UUID userId) {

        userService.deleteUser(userId);
    }

    @PostMapping("/users/admin")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponseDto registerAdmin(
            @Valid @RequestBody UserRequestDto request) {
        return userMapper.toDto(
                userService.registerAdmin(
                        userMapper.toEntity(request)
                )
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

    @GetMapping("/properties/{propertyId}")
    public PropertyResponseDto getProperty(
            @PathVariable UUID propertyId) {

        return propertyMapper.toDto(
                propertyService.getPropertyById(propertyId)
        );
    }

    @PatchMapping("/properties/{propertyId}/status")
    public PropertyResponseDto updatePropertyStatus(
            @PathVariable UUID propertyId,
            @Valid @RequestBody PropertyStatusRequestDto request
    ) {

        return propertyMapper.toDto(
                propertyService.updatePropertyStatus(
                        propertyId,
                        request.status()
                )
        );
    }
}