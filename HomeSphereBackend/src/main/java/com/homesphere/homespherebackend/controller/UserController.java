package com.homesphere.homespherebackend.controller;

import com.homesphere.homespherebackend.dto.user.UserRequestDto;
import com.homesphere.homespherebackend.dto.user.UserResponseDto;
import com.homesphere.homespherebackend.mapper.UserMapper;
import com.homesphere.homespherebackend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponseDto registerUser(
            @Valid @RequestBody UserRequestDto request) {

        return userMapper.toDto(
                userService.register(
                        userMapper.toEntity(request)
                )
        );
    }

    @GetMapping("/{userId}")
    public UserResponseDto getUser(
            @PathVariable UUID userId) {

        return userMapper.toDto(
                userService.getUserById(userId)
        );
    }

    @GetMapping
    public List<UserResponseDto> getAllUsers() {

        return userService.getAllUsers()
                .stream()
                .map(userMapper::toDto)
                .toList();
    }

    @PutMapping("/{userId}")
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
}