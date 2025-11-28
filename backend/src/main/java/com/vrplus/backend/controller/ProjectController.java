package com.vrplus.backend.controller;

import com.vrplus.backend.model.Project;
import com.vrplus.backend.repository.ProjectRepository;
import com.vrplus.backend.service.FilesStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    ProjectRepository projectRepository;

    @Autowired
    FilesStorageService storageService;

    @GetMapping
    public List<Project> getAllProjects() {
        List<Project> projects = projectRepository.findAll();
        // Clear heavy lists for summary view
        projects.forEach(p -> {
            p.setScenes(null);
            p.setModels(null);
            p.setGalleryImages(null);
        });
        return projects;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable("id") Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
        return new ResponseEntity<>(project, HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        Project _project = projectRepository.save(project);
        return new ResponseEntity<>(_project, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Project> updateProject(@PathVariable("id") Long id, @RequestBody Project project) {
        Project _project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));

        _project.setTitle(project.getTitle());
        _project.setTitleVi(project.getTitleVi());
        _project.setTitleEn(project.getTitleEn());
        _project.setCategory(project.getCategory());
        _project.setLocation(project.getLocation());
        _project.setShortDescription(project.getShortDescription());
        _project.setDetailedDescription(project.getDetailedDescription());
        _project.setDescriptionVi(project.getDescriptionVi());
        _project.setDescriptionEn(project.getDescriptionEn());
        _project.setAiDescription(project.getAiDescription());
        _project.setThumbnailUrl(project.getThumbnailUrl());
        _project.setFeatured(project.isFeatured());
        _project.setHas360(project.isHas360());
        _project.setHas3d(project.isHas3d());
        _project.setHasGallery(project.isHasGallery());

        return new ResponseEntity<>(projectRepository.save(_project), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HttpStatus> deleteProject(@PathVariable("id") Long id) {
        projectRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/upload")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        String message = "";
        try {
            String filename = storageService.save(file);
            message = filename;
            return ResponseEntity.status(HttpStatus.OK).body(message);
        } catch (Exception e) {
            message = "Could not upload the file: " + file.getOriginalFilename() + "!";
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(message);
        }
    }
}
