package com.vrplus.backend.controller.admin;

import com.vrplus.backend.model.GalleryImage;
import com.vrplus.backend.model.Project;
import com.vrplus.backend.repository.GalleryImageRepository;
import com.vrplus.backend.repository.ProjectRepository;

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
    private GalleryImageRepository galleryRepository;

    @Autowired
    private ProjectRepository projectRepository;

    // GET ALL (optional, giống scene)
    @GetMapping
    public ResponseEntity<List<GalleryImage>> getAll() {
        return ResponseEntity.ok(galleryRepository.findAll());
    }

    // GET BY PROJECT
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<GalleryImage>> getByProject(@PathVariable Long projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new RuntimeException("Project not found");
        }
        return ResponseEntity.ok(galleryRepository.findByProjectId(projectId));
    }

    // CREATE GALLERY ITEM
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, Object> payload) {
        try {
            // Extract projectId
            Object projectIdObj = payload.get("projectId");
            if (projectIdObj == null) {
                return ResponseEntity.badRequest().body(Map.of(
                        "message", "Project ID is required",
                        "field", "projectId"));
            }

            Long projectId;
            if (projectIdObj instanceof Integer) {
                projectId = ((Integer) projectIdObj).longValue();
            } else if (projectIdObj instanceof Long) {
                projectId = (Long) projectIdObj;
            } else {
                return ResponseEntity.badRequest().body(Map.of(
                        "message", "Invalid project ID format",
                        "field", "projectId"));
            }

            // Validate project exists
            Project project = projectRepository.findById(projectId)
                    .orElseThrow(() -> new RuntimeException("Project not found with ID: " + projectId));

            // Create gallery image
            GalleryImage img = new GalleryImage();
            img.setProject(project);
            img.setUrl((String) payload.get("url"));
            img.setCaption((String) payload.get("caption"));

            GalleryImage saved = galleryRepository.save(img);
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "Failed to create gallery item: " + e.getMessage(),
                    "error", e.getClass().getSimpleName()));
        }
    }

    // UPDATE GALLERY ITEM
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        try {
            GalleryImage img = galleryRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Gallery item not found"));

            if (payload.containsKey("url")) {
                img.setUrl((String) payload.get("url"));
            }
            if (payload.containsKey("caption")) {
                img.setCaption((String) payload.get("caption"));
            }

            GalleryImage updated = galleryRepository.save(img);
            return ResponseEntity.ok(updated);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "Failed to update gallery item: " + e.getMessage(),
                    "error", e.getClass().getSimpleName()));
        }
    }

    // DELETE GALLERY ITEM
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            GalleryImage img = galleryRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Gallery item not found"));

            galleryRepository.delete(img);

            return ResponseEntity.ok(Map.of("message", "Gallery item deleted successfully"));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "Failed to delete gallery item: " + e.getMessage(),
                    "error", e.getClass().getSimpleName()));
        }
    }
}
