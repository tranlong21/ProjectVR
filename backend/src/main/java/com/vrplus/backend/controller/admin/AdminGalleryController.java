package com.vrplus.backend.controller.admin;

import com.vrplus.backend.model.GalleryImage;
import com.vrplus.backend.model.Project;
import com.vrplus.backend.repository.GalleryImageRepository;
import com.vrplus.backend.repository.ProjectRepository;

import com.vrplus.backend.service.IGalleryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/gallery")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminGalleryController {
    @Autowired
    private IGalleryService galleryService;

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(galleryService.getAll());
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<?> getByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(galleryService.getByProjectId(projectId));
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, Object> payload) {
        try {
            return ResponseEntity.ok(galleryService.create(payload));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "Failed to create gallery item: " + e.getMessage(),
                    "error", e.getClass().getSimpleName()));
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody GalleryImage img) {
        return ResponseEntity.ok(galleryService.update(id, img));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        galleryService.delete(id);
        return ResponseEntity.ok("Gallery item deleted");
    }

}