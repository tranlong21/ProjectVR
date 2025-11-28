package com.vrplus.backend.controller.admin;

import com.vrplus.backend.model.Hotspot;
import com.vrplus.backend.repository.HotspotRepository;
import com.vrplus.backend.repository.SceneRepository;
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

    @Autowired
    private HotspotRepository hotspotRepository;

    @Autowired
    private SceneRepository sceneRepository;

    @GetMapping("/scenes/{sceneId}/hotspots")
    public ResponseEntity<List<Hotspot>> getHotspotsByScene(@PathVariable Long sceneId) {
        return ResponseEntity.ok(hotspotRepository.findBySceneId(sceneId));
    }

    @PostMapping("/scenes/{sceneId}/hotspots")
    public ResponseEntity<?> createHotspot(@PathVariable Long sceneId, @RequestBody Hotspot hotspot) {
        // Verify scene exists
        sceneRepository.findById(sceneId)
                .orElseThrow(() -> new RuntimeException("Scene not found"));

        // Set scene relationship
        hotspot.setScene(sceneRepository.findById(sceneId).get());

        Hotspot savedHotspot = hotspotRepository.save(hotspot);
        return ResponseEntity.ok(savedHotspot);
    }

    @PutMapping("/hotspots/{id}")
    public ResponseEntity<?> updateHotspot(@PathVariable Long id, @RequestBody Hotspot hotspotDetails) {
        Hotspot hotspot = hotspotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hotspot not found"));

        hotspot.setType(hotspotDetails.getType());
        hotspot.setYaw(hotspotDetails.getYaw());
        hotspot.setPitch(hotspotDetails.getPitch());
        hotspot.setTargetSceneId(hotspotDetails.getTargetSceneId());
        hotspot.setTitleVi(hotspotDetails.getTitleVi());
        hotspot.setTitleEn(hotspotDetails.getTitleEn());
        hotspot.setDescriptionVi(hotspotDetails.getDescriptionVi());
        hotspot.setDescriptionEn(hotspotDetails.getDescriptionEn());
        hotspot.setIcon(hotspotDetails.getIcon());

        Hotspot updatedHotspot = hotspotRepository.save(hotspot);
        return ResponseEntity.ok(updatedHotspot);
    }

    @DeleteMapping("/hotspots/{id}")
    public ResponseEntity<?> deleteHotspot(@PathVariable Long id) {
        hotspotRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
