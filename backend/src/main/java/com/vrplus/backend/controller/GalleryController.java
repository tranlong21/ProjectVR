package com.vrplus.backend.controller;

import com.vrplus.backend.model.GalleryImage;
import com.vrplus.backend.repository.GalleryImageRepository;
import com.vrplus.backend.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/gallery")
public class GalleryController {

    @Autowired
    private GalleryImageRepository galleryRepo;

    @Autowired
    private ProjectRepository projectRepo;


    @GetMapping("/project/{projectId}")
    public List<GalleryImage> getGalleryByProject(@PathVariable Long projectId) {
        return galleryRepo.findByProjectId(projectId);
    }


    @PostMapping("/project/{projectId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createGalleryImage(
            @PathVariable Long projectId,
            @RequestBody GalleryImage img) {

        return projectRepo.findById(projectId).map(project -> {
            img.setProject(project);
            GalleryImage saved = galleryRepo.save(img);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        }).orElseThrow(() -> new RuntimeException("Project not found with ID: " + projectId));
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteGalleryImage(@PathVariable Long id) {
        if (!galleryRepo.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Gallery image not found");
        }
        galleryRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
