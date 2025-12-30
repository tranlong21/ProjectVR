package com.vrplus.backend.controller.admin;

import com.vrplus.backend.model.Hotspot;
import com.vrplus.backend.repository.HotspotRepository;
import com.vrplus.backend.repository.SceneRepository;
import com.vrplus.backend.service.HotspotService;
import com.vrplus.backend.service.IHotspotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminHotspotController {

    private final IHotspotService hotspotService;

    public AdminHotspotController(IHotspotService hotspotService) {
        this.hotspotService = hotspotService;
    }

    @GetMapping("/scenes/{sceneId}/hotspots")
    public ResponseEntity<?> getByScene(@PathVariable Long sceneId) {
        return ResponseEntity.ok(hotspotService.getHotspotsByScene(sceneId));
    }

    @PostMapping("/scenes/{sceneId}/hotspots")
    public ResponseEntity<?> createSceneHotspot(
            @PathVariable Long sceneId,
            @RequestBody Hotspot hotspot) {
        return ResponseEntity.ok(hotspotService.createSceneHotspot(sceneId, hotspot));
    }

    @PutMapping("/scenes/{sceneId}/hotspots/{id}")
    public ResponseEntity<?> updateSceneHotspot(
            @PathVariable Long sceneId,
            @PathVariable Long id,
            @RequestBody Hotspot hotspot) {
        return ResponseEntity.ok(hotspotService.updateSceneHotspot(sceneId, id, hotspot));
    }

    @DeleteMapping("/scenes/{sceneId}/hotspots/{id}")
    public ResponseEntity<?> deleteSceneHotspot(@PathVariable Long id) {
        hotspotService.deleteSceneHotspot(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/models/{modelId}/hotspots")
    public ResponseEntity<?> getByModel(@PathVariable Long modelId) {
        return ResponseEntity.ok(hotspotService.getHotspotsByModel(modelId));
    }

    @PostMapping("/models/{modelId}/hotspots")
    public ResponseEntity<?> createModelHotspot(
            @PathVariable Long modelId,
            @RequestBody Hotspot hotspot) {
        return ResponseEntity.ok(hotspotService.createModelHotspot(modelId, hotspot));
    }

    @PutMapping("/models/{modelId}/hotspots/{id}")
    public ResponseEntity<?> updateModelHotspot(
            @PathVariable Long modelId,
            @PathVariable Long id,
            @RequestBody Hotspot hotspot) {
        return ResponseEntity.ok(hotspotService.updateModelHotspot(modelId, id, hotspot));
    }

    @DeleteMapping("/models/{modelId}/hotspots/{id}")
    public ResponseEntity<?> deleteModelHotspot(@PathVariable Long id) {
        hotspotService.deleteModelHotspot(id);
        return ResponseEntity.ok().build();
    }
}
