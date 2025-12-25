package com.vrplus.backend.controller.admin;

import com.vrplus.backend.model.Category;
import com.vrplus.backend.model.Project;
import com.vrplus.backend.repository.CategoryRepository;
import com.vrplus.backend.repository.ProjectRepository;
import com.vrplus.backend.service.FileStorageService;
import com.vrplus.backend.service.IProjectService;
import com.vrplus.backend.service.ProjectService;
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
    private IProjectService projectService;

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProjectById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(projectService.getProjectById(id));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> createProject(@RequestBody Project projectRequest) {
        return ResponseEntity.ok(projectService.createProject(projectRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProject(
            @PathVariable Long id,
            @RequestBody Project projectRequest) {

        return ResponseEntity.ok(projectService.updateProject(id, projectRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/thumbnail")
    public ResponseEntity<?> uploadThumbnail(
            @PathVariable Long id,
            @RequestParam(required = false) MultipartFile file,
            @RequestParam(required = false) String url) {

        try {
            String updatedUrl = projectService.updateThumbnailById(id, file, url);
            return ResponseEntity.ok(updatedUrl);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
