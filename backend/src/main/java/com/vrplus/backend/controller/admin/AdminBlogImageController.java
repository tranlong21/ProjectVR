package com.vrplus.backend.controller.admin;

import com.vrplus.backend.model.BlogImage;
import com.vrplus.backend.repository.BlogImageRepository;
import com.vrplus.backend.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/blog-images")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminBlogImageController {

    @Autowired
    private BlogImageRepository blogImageRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping
    public List<BlogImage> getAll_images() {
        return blogImageRepository.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "usageType", defaultValue = "CONTENT") String usageType) {
        try {
            if (!fileStorageService.isValidImageFile(file)) {
                return ResponseEntity.badRequest().body("Invalid image file");
            }

            String fileUrl = fileStorageService.storeFile(file, "blog/" + usageType.toLowerCase());

            BlogImage blogImage = new BlogImage();
            blogImage.setUrl(fileUrl);
            blogImage.setAltText(file.getOriginalFilename());
            blogImage.setUsageType(usageType);

            BlogImage saved = blogImageRepository.save(blogImage);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace(); // Log error
            return ResponseEntity.internalServerError().body("Error uploading file: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteImage(@PathVariable Long id) {
        BlogImage image = blogImageRepository.findById(id).orElse(null);
        if (image == null) {
            return ResponseEntity.notFound().build();
        }

        // Optional: Delete physical file
        fileStorageService.deleteFile(image.getUrl());

        blogImageRepository.delete(image);
        return ResponseEntity.ok().build();
    }
}
