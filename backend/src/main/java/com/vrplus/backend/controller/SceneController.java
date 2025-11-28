package com.vrplus.backend.controller;

import com.vrplus.backend.model.Scene;
import com.vrplus.backend.repository.ProjectRepository;
import com.vrplus.backend.repository.SceneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/scenes")
public class SceneController {

    @Autowired
    SceneRepository sceneRepository;

    @Autowired
    ProjectRepository projectRepository;

    @GetMapping("/project/{projectId}")
    public List<Scene> getScenesByProject(@PathVariable("projectId") Long projectId) {
        return sceneRepository.findByProjectId(projectId);
    }

    @PostMapping("/project/{projectId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Scene> createScene(@PathVariable("projectId") Long projectId, @RequestBody Scene scene) {
        return projectRepository.findById(projectId).map(project -> {
            scene.setProject(project);
            return new ResponseEntity<>(sceneRepository.save(scene), HttpStatus.CREATED);
        }).orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HttpStatus> deleteScene(@PathVariable("id") Long id) {
        sceneRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
