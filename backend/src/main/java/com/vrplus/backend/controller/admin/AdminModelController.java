package com.vrplus.backend.controller.admin;

import com.vrplus.backend.model.Model3D;
import com.vrplus.backend.model.Project;
import com.vrplus.backend.repository.Model3DRepository;
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
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminModelController {

    @Autowired
    private Model3DRepository model3DRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping("/projects/{projectId}/models")
    public ResponseEntity<List<Model3D>> getModelsByProject(@PathVariable Long projectId) {
        List<Model3D> models = model3DRepository.findByProjectId(projectId);
        return ResponseEntity.ok(models);
    }

    @PostMapping("/projects/{projectId}/models")
    public ResponseEntity<?> uploadModel(
            @PathVariable Long projectId,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "modelUrl", required = false) String modelUrl,
            @RequestParam("name") String name,
            @RequestParam(value = "descriptionVi", required = false) String descriptionVi,
            @RequestParam(value = "descriptionEn", required = false) String descriptionEn
    ) {
        try {
            // Validate project exists
            Project project = projectRepository.findById(projectId)
                    .orElseThrow(() -> new RuntimeException("Project not found"));

            // Remove old model if exists (only 1 model per project)
            List<Model3D> existingModels = model3DRepository.findByProjectId(projectId);
            if (!existingModels.isEmpty()) {
                for (Model3D oldModel : existingModels) {
                    if (oldModel.getFileUrl() != null && oldModel.getFileUrl().startsWith("/uploads")) {
                        fileStorageService.deleteFile(oldModel.getFileUrl());
                    }
                    model3DRepository.delete(oldModel);
                }
            }

            String finalFileUrl;
            String format = "UNKNOWN";

            // Upload file
            if (file != null && !file.isEmpty()) {
                if (!fileStorageService.isValid3DModelFile(file)) {
                    return ResponseEntity.badRequest()
                            .body("Invalid 3D model file. Only .glb and .gltf are supported.");
                }

                finalFileUrl = fileStorageService.storeFile(file, "models3d");
                format = file.getOriginalFilename().endsWith(".glb") ? "GLB" : "GLTF";

            } else if (modelUrl != null && !modelUrl.isEmpty()) {
                // External URL
                finalFileUrl = modelUrl;
                format = "URL";

            } else {
                return ResponseEntity.badRequest().body("Either file or modelUrl must be provided");
            }

            // Create new model record
            Model3D model = Model3D.builder()
                    .project(project)
                    .name(name)
                    .descriptionVi(descriptionVi)
                    .descriptionEn(descriptionEn)
                    .format(format)
                    .fileUrl(finalFileUrl)
                    .modelUrl(finalFileUrl)
                    .build();

            Model3D savedModel = model3DRepository.save(model);

            // Update project.has3d
            project.setHas3d(true);
            projectRepository.save(project);

            return ResponseEntity.ok(savedModel);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to upload model: " + e.getMessage());
        }
    }


    @DeleteMapping("/models/{id}")
    public ResponseEntity<?> deleteModel(@PathVariable Long id) {
        Model3D model = model3DRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Model not found"));

        Long projectId = model.getProject().getId();

        // Delete file
        if (model.getFileUrl() != null && model.getFileUrl().startsWith("/uploads")) {
            fileStorageService.deleteFile(model.getFileUrl());
        }

        model3DRepository.deleteById(id);

        // Update project flag
        Project project = projectRepository.findById(projectId).orElse(null);
        if (project != null) {
            List<Model3D> remainingModels = model3DRepository.findByProjectId(projectId);
            project.setHas3d(!remainingModels.isEmpty());
            projectRepository.save(project);
        }

        return ResponseEntity.ok().build();
    }
}
