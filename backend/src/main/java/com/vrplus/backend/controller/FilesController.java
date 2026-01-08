package com.vrplus.backend.controller;

import com.vrplus.backend.service.FilesStorageService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FilesController {

    @Autowired
    private FilesStorageService storageService;

//    @GetMapping("/**")
//    public ResponseEntity<Resource> getFile(HttpServletRequest request) {
//        try {
//            String requestUri = request.getRequestURI();
//            String filePath = requestUri.replaceFirst("/api/files", "");
//
//            Resource file = storageService.load(filePath);
//            String contentType = detectContentType(filePath, file);
//
//            return ResponseEntity.ok()
//                    .contentType(MediaType.parseMediaType(contentType))
//                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getFilename() + "\"")
//                    .header(HttpHeaders.CACHE_CONTROL, "public, max-age=31536000")
//                    .body(file);
//
//        } catch (Exception e) {
//            return ResponseEntity.notFound().build();
//        }
//    }

    @PostMapping("/upload/gallery")
    public ResponseEntity<?> uploadGallery(@RequestParam("file") MultipartFile file) {
        try {
            String url = storageService.storeFile(file, "gallery");
            return ResponseEntity.ok(Map.of("fileUrl", url));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("/upload/scenes")
    public ResponseEntity<?> uploadScene(@RequestParam("file") MultipartFile file) {
        try {
            String url = storageService.storeFile(file, "scenes");
            return ResponseEntity.ok(Map.of("fileUrl", url));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("/upload/projects/thumbnails")
    public ResponseEntity<?> uploadProjectThumbnail(@RequestParam("file") MultipartFile file) {
        try {
            String url = storageService.storeFile(file, "projects/thumbnails");
            return ResponseEntity.ok(Map.of("fileUrl", url));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    private String detectContentType(String filename, Resource resource) {
        String ext = getFileExtension(filename).toLowerCase();

        switch (ext) {
            case "jpg":
            case "jpeg":
                return "image/jpeg";
            case "png":
                return "image/png";
            case "gif":
                return "image/gif";
            case "webp":
                return "image/webp";
            case "svg":
                return "image/svg+xml";
            case "glb":
                return "model/gltf-binary";
            case "gltf":
                return "model/gltf+json";
            default:
                try {
                    Path path = resource.getFile().toPath();
                    String detected = Files.probeContentType(path);
                    return detected != null ? detected : "application/octet-stream";
                } catch (IOException e) {
                    return "application/octet-stream";
                }
        }
    }

    private String getFileExtension(String filename) {
        int lastDot = filename.lastIndexOf('.');
        return lastDot > 0 ? filename.substring(lastDot + 1) : "";
    }
}
