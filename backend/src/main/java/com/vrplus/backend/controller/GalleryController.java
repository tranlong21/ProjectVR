package com.vrplus.backend.controller;

import com.vrplus.backend.model.GalleryImage;
import com.vrplus.backend.repository.GalleryImageRepository;
import com.vrplus.backend.repository.ProjectRepository;
import com.vrplus.backend.service.IGalleryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/gallery")
public class GalleryController {
    @Autowired
    private IGalleryService galleryService;

    @GetMapping("/project/{projectId}")
    public ResponseEntity<?> getByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(galleryService.getByProjectId(projectId));
    }


}