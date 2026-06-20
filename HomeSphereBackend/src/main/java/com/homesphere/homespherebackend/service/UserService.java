package com.homesphere.homespherebackend.service;

import com.homesphere.homespherebackend.domain.user.User;

import java.util.List;
import java.util.UUID;

public interface UserService {

    User getUserById(UUID userId);

    User getUserByEmail(String email);

    List<User> getAllUsers();

    User updateUser(User user);

    void deactivateUser(UUID userId);

    User register(User user);

    User registerAdmin(User user);

    void deleteUser(UUID userId);
}