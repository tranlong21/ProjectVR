package com.vrplus.backend.controller;

import com.vrplus.backend.model.Project;
import com.vrplus.backend.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Autowired
    ProjectRepository projectRepository;

    @Value("${app.ai.api-key}")
    private String aiApiKey;

    @PostMapping("/generate-description/{projectId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> generateDescription(@PathVariable Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Mock AI generation logic
        // In a real app, you would call OpenAI or Gemini API here using RestTemplate
        String generatedDescription = "This is an AI-generated description for " + project.getTitle() +
                ". It highlights the beautiful scenery of " + project.getLocation() +
                " and offers an immersive experience.";

        project.setAiDescription(generatedDescription);
        projectRepository.save(project);

        Map<String, String> response = new HashMap<>();
        response.put("description", generatedDescription);

        return ResponseEntity.ok(response);
    }
}
