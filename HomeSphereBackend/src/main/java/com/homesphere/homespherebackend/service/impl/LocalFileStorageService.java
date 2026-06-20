package com.homesphere.homespherebackend.service.impl;

import com.homesphere.homespherebackend.service.FileStorageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class LocalFileStorageService
        implements FileStorageService {

    private final Path uploadPath =
            Paths.get("uploads");

    @Override
    public String upload(MultipartFile file) {

        try {

            Files.createDirectories(uploadPath);

            String filename =
                    UUID.randomUUID() + "_" +
                    file.getOriginalFilename();

            Path destination =
                    uploadPath.resolve(filename);

            file.transferTo(destination);

            return "/uploads/" + filename;

        } catch (IOException ex) {

            throw new RuntimeException(
                    "Failed to upload image",
                    ex
            );
        }
    }

    

    @Override
    public void delete(String imageUrl) {

        try {

            String filename =
                    imageUrl.replace("/uploads/", "");

            Files.deleteIfExists(
                    uploadPath.resolve(filename)
            );

        } catch (IOException ex) {

            throw new RuntimeException(ex);
        }
    }
}
