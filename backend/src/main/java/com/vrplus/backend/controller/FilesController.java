package com.vrplus.backend.controller;

import com.vrplus.backend.service.FilesStorageService;
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
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/files")
public class FilesController {

    @Autowired
    FilesStorageService storageService;

    /**
     * Serve files with proper MIME type for inline display
     * Supports images (JPG, PNG, WEBP) and 3D models (GLB, GLTF)
     */
    @GetMapping("/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> getFile(@PathVariable String filename) {
        try {
            Resource file = storageService.load(filename);

            // Detect MIME type from file
            String contentType = detectContentType(filename, file);

            // Return file with inline disposition for browser display
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getFilename() + "\"")
                    .header(HttpHeaders.CACHE_CONTROL, "public, max-age=31536000") // Cache for 1 year
                    .body(file);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Upload panorama/scene image
     */
    @PostMapping("/upload/scenes")
    public ResponseEntity<?> uploadSceneImage(@RequestParam("file") MultipartFile file) {
        try {
            String filename = storageService.save(file);
            Map<String, String> response = new HashMap<>();
            response.put("fileUrl", "/api/files/" + filename);
            response.put("filename", filename);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to upload file: " + e.getMessage());
        }
    }

    /**
     * Upload project thumbnail
     */
    @PostMapping("/upload/projects/thumbnails")
    public ResponseEntity<?> uploadProjectThumbnail(@RequestParam("file") MultipartFile file) {
        try {
            String filename = storageService.save(file);
            Map<String, String> response = new HashMap<>();
            response.put("fileUrl", "/api/files/" + filename);
            response.put("filename", filename);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to upload file: " + e.getMessage());
        }
    }

    /**
     * Upload 3D model (GLB/GLTF)
     */
    @PostMapping("/upload/models")
    public ResponseEntity<?> uploadModel(@RequestParam("file") MultipartFile file) {
        try {
            String filename = storageService.save(file);
            Map<String, String> response = new HashMap<>();
            response.put("fileUrl", "/api/files/" + filename);
            response.put("filename", filename);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to upload file: " + e.getMessage());
        }
    }

    /**
     * Detect content type from filename and file content
     */
    private String detectContentType(String filename, Resource resource) {
        String extension = getFileExtension(filename).toLowerCase();

        // Image types
        switch (extension) {
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

            // 3D model types
            case "glb":
                return "model/gltf-binary";
            case "gltf":
                return "model/gltf+json";

            // Fallback: try to detect from file
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

    /**
     * Get file extension from filename
     */
    private String getFileExtension(String filename) {
        int lastDot = filename.lastIndexOf('.');
        return lastDot > 0 ? filename.substring(lastDot + 1) : "";
    }
    @PostMapping("/upload/gallery")
    public ResponseEntity<?> uploadGalleryImage(@RequestParam("file") MultipartFile file) {
        try {
            String filename = storageService.save(file);
            Map<String, String> response = new HashMap<>();
            response.put("fileUrl", "/api/files/" + filename);
            response.put("filename", filename);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Failed to upload file: " + e.getMessage());
        }
    }
}

