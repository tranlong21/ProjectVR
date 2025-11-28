package com.vrplus.backend.controller.admin;

import com.vrplus.backend.repository.ProjectRepository;
import com.vrplus.backend.repository.UserRepository;
import com.vrplus.backend.repository.SceneRepository;
import com.vrplus.backend.repository.Model3DRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminDashboardController {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SceneRepository sceneRepository;

    @Autowired
    private Model3DRepository model3DRepository;

    /**
     * Get dashboard statistics
     * Returns counts for projects, users, scenes, and models
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("projects", projectRepository.count());
        stats.put("users", userRepository.count());
        stats.put("scenes", sceneRepository.count());
        stats.put("models", model3DRepository.count());

        return ResponseEntity.ok(stats);
    }
}
