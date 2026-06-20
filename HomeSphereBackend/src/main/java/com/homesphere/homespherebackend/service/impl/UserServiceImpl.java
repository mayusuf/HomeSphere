package com.homesphere.homespherebackend.service.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.homesphere.homespherebackend.domain.user.Role;
import com.homesphere.homespherebackend.domain.user.User;
import com.homesphere.homespherebackend.exception.ResourceAlreadyExistsException;
import com.homesphere.homespherebackend.exception.ResourceNotFoundException;
import com.homesphere.homespherebackend.repository.UserRepository;
import com.homesphere.homespherebackend.service.UserService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public User getUserById(UUID userId) {
       return userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found: " + userId));
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found: " + email));
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User updateUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public void deactivateUser(UUID userId) {
        User existing = getUserById(userId);
        existing.setIsActive(false);
        userRepository.save(existing);
    }

    @Override
    public User register(User user) {
         if (userRepository.existsByEmail(user.getEmail())) {

            throw new ResourceAlreadyExistsException(
                    "Email already registered"
            );
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(Role.USER);

        return userRepository.save(user);
    }

    @Override
    public User registerAdmin(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new ResourceAlreadyExistsException(
                    "Email already registered"
            );
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(Role.ADMIN);
        return userRepository.save(user);
    }


    @Override
    public void deleteUser(UUID userId) {
        User user = getUserById(userId);
        userRepository.delete(user);
    }
}
