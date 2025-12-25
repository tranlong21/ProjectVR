package com.vrplus.backend.controller.admin;

import com.vrplus.backend.model.Model3D;
import com.vrplus.backend.service.Model3DService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminModelController {

    private final Model3DService modelService;

    public AdminModelController(Model3DService modelService) {
        this.modelService = modelService;
    }

    @PostMapping("/projects/{projectId}/models")
    public ResponseEntity<?> uploadModel(
            @PathVariable Long projectId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("name") String name,
            @RequestParam(required = false) String descriptionVi,
            @RequestParam(required = false) String descriptionEn
    ) {
        try {
            Model3D model = modelService.uploadOrReplaceModel(
                    projectId, file, name, descriptionVi, descriptionEn
            );
            return ResponseEntity.ok(model);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/projects/{projectId}/models")
    public ResponseEntity<?> getModelsByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(
                modelService.getModelsByProjectId(projectId)
        );
    }

    @DeleteMapping("/models/{id}")
    public ResponseEntity<?> deleteModel(@PathVariable Long id) {
        try {
            modelService.deleteModel(id);
            return ResponseEntity.noContent().build(); // 204
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

}
