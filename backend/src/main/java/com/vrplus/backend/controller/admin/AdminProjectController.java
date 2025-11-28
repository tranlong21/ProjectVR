package com.vrplus.backend.controller.admin;

import com.vrplus.backend.model.Category;
import com.vrplus.backend.model.Project;
import com.vrplus.backend.repository.CategoryRepository;
import com.vrplus.backend.repository.ProjectRepository;
import com.vrplus.backend.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/admin/projects")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminProjectController {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        return ResponseEntity.ok(project);
    }

    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Project projectRequest) {
        // Auto-calculate flags based on empty lists initially
        projectRequest.setHas360(false);
        projectRequest.setHas3d(false);
        projectRequest.setHasGallery(false);

        if (projectRequest.getCategory() != null && projectRequest.getCategory().getId() != null) {
            Category category = categoryRepository.findById(projectRequest.getCategory().getId())
                    .orElse(null);
            projectRequest.setCategory(category);
        }

        Project savedProject = projectRepository.save(projectRequest);
        return ResponseEntity.ok(savedProject);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody Project projectRequest) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        project.setTitle(projectRequest.getTitle());
        project.setTitleVi(projectRequest.getTitleVi());
        project.setTitleEn(projectRequest.getTitleEn());
        project.setLocation(projectRequest.getLocation());
        project.setShortDescription(projectRequest.getShortDescription());
        project.setDetailedDescription(projectRequest.getDetailedDescription());
        project.setDescriptionVi(projectRequest.getDescriptionVi());
        project.setDescriptionEn(projectRequest.getDescriptionEn());
        project.setAiDescription(projectRequest.getAiDescription());
        project.setThumbnailUrl(projectRequest.getThumbnailUrl());
        project.setFeatured(projectRequest.isFeatured());

        if (projectRequest.getCategory() != null && projectRequest.getCategory().getId() != null) {
            Category category = categoryRepository.findById(projectRequest.getCategory().getId())
                    .orElse(null);
            project.setCategory(category);
        } else {
            project.setCategory(null);
        }

        // Recalculate flags
        updateProjectFlags(project);

        Project updatedProject = projectRepository.save(project);
        return ResponseEntity.ok(updatedProject);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Delete thumbnail if it's a file
        if (project.getThumbnailUrl() != null && project.getThumbnailUrl().startsWith("/uploads")) {
            fileStorageService.deleteFile(project.getThumbnailUrl());
        }

        projectRepository.delete(project);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/thumbnail")
    public ResponseEntity<?> uploadThumbnail(
            @PathVariable Long id,
            @RequestParam(required = false) MultipartFile file,
            @RequestParam(required = false) String url) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        try {
            if (file != null && !file.isEmpty()) {
                // Validate image file
                if (!fileStorageService.isValidImageFile(file)) {
                    return ResponseEntity.badRequest().body("Invalid image file type");
                }

                // Delete old thumbnail if exists
                if (project.getThumbnailUrl() != null && project.getThumbnailUrl().startsWith("/uploads")) {
                    fileStorageService.deleteFile(project.getThumbnailUrl());
                }

                // Save new file
                String fileUrl = fileStorageService.storeFile(file, "projects/thumbnails");
                project.setThumbnailUrl(fileUrl);
            } else if (url != null && !url.isEmpty()) {
                // Use provided URL
                project.setThumbnailUrl(url);
            } else {
                return ResponseEntity.badRequest().body("Either file or url must be provided");
            }

            projectRepository.save(project);
            return ResponseEntity.ok(project);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Failed to upload thumbnail: " + e.getMessage());
        }
    }

    private void updateProjectFlags(Project project) {
        project.setHas360(project.getScenes() != null && !project.getScenes().isEmpty());
        project.setHas3d(project.getModels() != null && !project.getModels().isEmpty());
        project.setHasGallery(project.getGalleryImages() != null && !project.getGalleryImages().isEmpty());
    }
}
