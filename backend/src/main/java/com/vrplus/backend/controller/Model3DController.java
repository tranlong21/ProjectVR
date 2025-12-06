package com.vrplus.backend.controller;

import com.vrplus.backend.model.Model3D;
import com.vrplus.backend.repository.Model3DRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/models3d")
public class Model3DController {

    @Autowired
    Model3DRepository model3DRepository;

    @GetMapping
    public List<Model3D> getAllModels() {
        return model3DRepository.findAll();
    }

    /**
     * Get all 3D models for a specific project
     */
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Model3D>> getModelsByProject(@PathVariable Long projectId) {
        List<Model3D> models = model3DRepository.findByProjectIdWithHotspots(projectId);
        return ResponseEntity.ok(models);
    }

    @PostMapping
    public ResponseEntity<Model3D> createModel(@RequestBody Model3D model) {
        Model3D _model = model3DRepository.save(model);
        return ResponseEntity.ok(_model);
    }
}
