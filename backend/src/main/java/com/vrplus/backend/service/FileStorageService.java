package com.vrplus.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${storage.upload-root}")
    private String uploadRoot;

    private Path rootPath;

    @PostConstruct
    public void init() {
        try {
            rootPath = Paths.get(uploadRoot).normalize().toAbsolutePath();
            Files.createDirectories(rootPath);
        } catch (IOException e) {
            throw new RuntimeException("Could not init upload folder", e);
        }
    }

    // ================= VALIDATION =================

    public boolean isValidImageFile(MultipartFile file) {
        if (file == null || file.isEmpty()) return false;

        String contentType = file.getContentType();
        return contentType != null && (
                contentType.equals("image/jpeg") ||
                        contentType.equals("image/png") ||
                        contentType.equals("image/jpg")
        );
    }

    public boolean isValid3DModelFile(MultipartFile file) {
        if (file == null || file.isEmpty()) return false;

        String name = file.getOriginalFilename();
        return name != null && (
                name.endsWith(".glb") ||
                        name.endsWith(".gltf")
        );
    }

    // ================= STORE FILE =================

    /**
     * Store file into sub-folder (e.g. models/raw, models/web, projects/thumbnails...)
     * Return DB relative path: /uploads/xxx/yyy.ext
     */
    public String storeFile(MultipartFile file, String category) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IOException("Empty file");
        }

        String original = StringUtils.cleanPath(file.getOriginalFilename());
        String ext = "";

        int dot = original.lastIndexOf('.');
        if (dot > 0) {
            ext = original.substring(dot);
        }

        String filename = UUID.randomUUID() + ext;

        Path categoryPath = rootPath.resolve(category);
        Files.createDirectories(categoryPath);

        Path target = categoryPath.resolve(filename);
        file.transferTo(target.toFile());

        return "/uploads/" + category.replace("\\", "/") + "/" + filename;
    }

    // ================= MODEL WEB PATH =================

    public Path createWebModelPath(String filename) throws IOException {
        Path webDir = rootPath.resolve("models/web");
        Files.createDirectories(webDir);
        return webDir.resolve(filename).normalize().toAbsolutePath();
    }

    // ================= LOAD FILE =================

    public Resource loadAsResource(String fileUrl) {
        try {
            Path path = resolvePathFromUrl(fileUrl);
            Resource resource = new UrlResource(path.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                throw new RuntimeException("File not readable: " + fileUrl);
            }
            return resource;

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    // ================= DELETE =================

    public void deleteFile(String fileUrl) {
        try {
            Files.deleteIfExists(resolvePathFromUrl(fileUrl));
        } catch (Exception ignored) {}
    }

    // ================= PATH RESOLVE =================

    public Path resolvePathFromUrl(String fileUrl) {
        if (fileUrl == null || !fileUrl.startsWith("/uploads/")) {
            throw new IllegalArgumentException("Invalid url: " + fileUrl);
        }

        return rootPath
                .resolve(fileUrl.replaceFirst("^/uploads/", ""))
                .normalize()
                .toAbsolutePath();
    }
}
