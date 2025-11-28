package com.vrplus.backend.controller.admin;

import com.vrplus.backend.model.Project;
import com.vrplus.backend.model.Scene;
import com.vrplus.backend.repository.ProjectRepository;
import com.vrplus.backend.repository.SceneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/scenes")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminSceneController {

    @Autowired
    private SceneRepository sceneRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @GetMapping
    public ResponseEntity<List<Scene>> getAllScenes() {
        return ResponseEntity.ok(sceneRepository.findAll());
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Scene>> getScenesByProject(@PathVariable Long projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new RuntimeException("Project not found");
        }
        // Return scenes ordered by orderIndex
        List<Scene> scenes = sceneRepository.findByProjectIdOrderByOrderIndexAsc(projectId);
        return ResponseEntity.ok(scenes);
    }

    @PostMapping
    public ResponseEntity<?> createScene(@RequestBody Map<String, Object> payload) {
        try {
            // Extract projectId from payload
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

            // Create scene
            Scene scene = new Scene();
            scene.setProject(project);
            scene.setName((String) payload.get("name"));
            scene.setTitleVi((String) payload.get("titleVi"));
            scene.setTitleEn((String) payload.get("titleEn"));
            scene.setPanoramaUrl((String) payload.get("panoramaUrl"));

            // Handle orderIndex - if not provided, set to max + 1
            Integer orderIndex = (Integer) payload.get("orderIndex");
            if (orderIndex == null) {
                List<Scene> existingScenes = sceneRepository.findByProjectId(projectId);
                orderIndex = existingScenes.stream()
                        .mapToInt(s -> s.getOrderIndex() != null ? s.getOrderIndex() : 0)
                        .max()
                        .orElse(-1) + 1;
            }
            scene.setOrderIndex(orderIndex);

            // Handle numeric fields with proper type conversion
            Object yawObj = payload.get("initialYaw");
            if (yawObj != null) {
                scene.setInitialYaw(yawObj instanceof Double ? (Double) yawObj : ((Number) yawObj).doubleValue());
            }

            Object pitchObj = payload.get("initialPitch");
            if (pitchObj != null) {
                scene.setInitialPitch(
                        pitchObj instanceof Double ? (Double) pitchObj : ((Number) pitchObj).doubleValue());
            }

            Scene savedScene = sceneRepository.save(scene);

            // Update project flag
            project.setHas360(true);
            projectRepository.save(project);

            return ResponseEntity.ok(savedScene);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "Failed to create scene: " + e.getMessage(),
                    "error", e.getClass().getSimpleName()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateScene(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        try {
            Scene scene = sceneRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Scene not found"));

            // Update fields
            if (payload.containsKey("name")) {
                scene.setName((String) payload.get("name"));
            }
            if (payload.containsKey("titleVi")) {
                scene.setTitleVi((String) payload.get("titleVi"));
            }
            if (payload.containsKey("titleEn")) {
                scene.setTitleEn((String) payload.get("titleEn"));
            }
            if (payload.containsKey("panoramaUrl")) {
                scene.setPanoramaUrl((String) payload.get("panoramaUrl"));
            }
            if (payload.containsKey("orderIndex")) {
                scene.setOrderIndex((Integer) payload.get("orderIndex"));
            }
            if (payload.containsKey("initialYaw")) {
                Object yawObj = payload.get("initialYaw");
                scene.setInitialYaw(yawObj instanceof Double ? (Double) yawObj : ((Number) yawObj).doubleValue());
            }
            if (payload.containsKey("initialPitch")) {
                Object pitchObj = payload.get("initialPitch");
                scene.setInitialPitch(
                        pitchObj instanceof Double ? (Double) pitchObj : ((Number) pitchObj).doubleValue());
            }

            Scene updatedScene = sceneRepository.save(scene);
            return ResponseEntity.ok(updatedScene);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "Failed to update scene: " + e.getMessage(),
                    "error", e.getClass().getSimpleName()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteScene(@PathVariable Long id) {
        try {
            Scene scene = sceneRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Scene not found"));

            Long projectId = scene.getProject().getId();
            sceneRepository.delete(scene);

            // Update project flag
            Project project = projectRepository.findById(projectId).orElse(null);
            if (project != null) {
                List<Scene> remainingScenes = sceneRepository.findByProjectId(projectId);
                project.setHas360(!remainingScenes.isEmpty());
                projectRepository.save(project);
            }

            return ResponseEntity.ok(Map.of("message", "Scene deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "Failed to delete scene: " + e.getMessage(),
                    "error", e.getClass().getSimpleName()));
        }
    }
}
