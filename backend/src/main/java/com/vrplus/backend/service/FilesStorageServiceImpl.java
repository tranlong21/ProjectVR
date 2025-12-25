package com.vrplus.backend.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import java.util.stream.Stream;

@Service
public class FilesStorageServiceImpl implements FilesStorageService {

    @Value("${storage.upload-root:uploads}")
    private String uploadRoot;

    private Path root;

    @PostConstruct
    @Override
    public void init() {
        try {
            root = Paths.get(uploadRoot).normalize().toAbsolutePath();
            Files.createDirectories(root);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public String storeFile(MultipartFile file, String subFolder) {
        try {
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path folder = root.resolve(subFolder);
            Files.createDirectories(folder);
            Path target = folder.resolve(filename);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/" + subFolder + "/" + filename;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void deleteFile(String fileUrl) {
        try {
            Path path = resolvePathFromUrl(fileUrl);
            Files.deleteIfExists(path);
        } catch (Exception ignored) {
        }
    }

    @Override
    public Path resolvePathFromUrl(String fileUrl) {
        String relative = fileUrl.replaceFirst("^/uploads/", "");
        return root.resolve(relative);
    }

    @Override
    public Resource load(String fileUrl) {
        try {
            Path file = resolvePathFromUrl(fileUrl);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            }
            throw new RuntimeException();
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void deleteAll() {
        FileSystemUtils.deleteRecursively(root.toFile());
    }

    @Override
    public Stream<Path> loadAll() {
        try {
            return Files.walk(root, 1).filter(p -> !p.equals(root));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
