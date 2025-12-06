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

    // SCENES

    @GetMapping("/scenes/{sceneId}/hotspots")
    public ResponseEntity<List<Hotspot>> getHotspotsByScene(@PathVariable Long sceneId) {
        return ResponseEntity.ok(hotspotRepository.findBySceneId(sceneId));
    }

    @PostMapping("/scenes/{sceneId}/hotspots")
    public ResponseEntity<?> createHotspot(@PathVariable Long sceneId, @RequestBody Hotspot hotspot) {
        sceneRepository.findById(sceneId)
                .orElseThrow(() -> new RuntimeException("Scene not found"));

        hotspot.setScene(sceneRepository.findById(sceneId).get());
        hotspot.setModelId(null); // không liên quan 3D
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

    // 3D MODELS

    @GetMapping("/models/{modelId}/hotspots")
    public ResponseEntity<List<Hotspot>> getHotspotsByModel(@PathVariable Long modelId) {
        return ResponseEntity.ok(hotspotRepository.findByModelId(modelId));
    }

    @PostMapping("/models/{modelId}/hotspots")
    public ResponseEntity<?> createModelHotspot(
            @PathVariable Long modelId,
            @RequestBody Hotspot hotspot
    ) {
        // Tự set type = model
        hotspot.setType("model");
        hotspot.setModelId(modelId);

        // Các trường khác nếu null → cho = 0
        if (hotspot.getX() == null) hotspot.setX(0f);
        if (hotspot.getY() == null) hotspot.setY(0f);
        if (hotspot.getZ() == null) hotspot.setZ(0f);

        if (hotspot.getCameraPosX() == null) hotspot.setCameraPosX(0f);
        if (hotspot.getCameraPosY() == null) hotspot.setCameraPosY(0f);
        if (hotspot.getCameraPosZ() == null) hotspot.setCameraPosZ(0f);

        if (hotspot.getCameraTargetX() == null) hotspot.setCameraTargetX(0f);
        if (hotspot.getCameraTargetY() == null) hotspot.setCameraTargetY(0f);
        if (hotspot.getCameraTargetZ() == null) hotspot.setCameraTargetZ(0f);

        hotspotRepository.save(hotspot);

        return ResponseEntity.ok(hotspot);
    }


    @PutMapping("/models/{modelId}/hotspots/{id}")
    public ResponseEntity<?> updateModelHotspot(
            @PathVariable Long modelId,
            @PathVariable Long id,
            @RequestBody Hotspot details) {

        Hotspot hotspot = hotspotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hotspot not found"));

        // Không cho đổi modelId
        hotspot.setModelId(modelId);

        // ====== 3D POSITION ======
        hotspot.setX(details.getX());
        hotspot.setY(details.getY());
        hotspot.setZ(details.getZ());

        // ====== CAMERA ======
        hotspot.setCameraPosX(details.getCameraPosX());
        hotspot.setCameraPosY(details.getCameraPosY());
        hotspot.setCameraPosZ(details.getCameraPosZ());

        hotspot.setCameraTargetX(details.getCameraTargetX());
        hotspot.setCameraTargetY(details.getCameraTargetY());
        hotspot.setCameraTargetZ(details.getCameraTargetZ());

        // ====== META (title, mô tả, icon, order) ======
        hotspot.setTitleVi(details.getTitleVi());
        hotspot.setTitleEn(details.getTitleEn());

        hotspot.setDescriptionVi(details.getDescriptionVi());
        hotspot.setDescriptionEn(details.getDescriptionEn());

        hotspot.setIcon(details.getIcon());

        hotspot.setOrderId(details.getOrderId());  // **QUAN TRỌNG**

        hotspot.setExtra(details.getExtra()); // JSON

        Hotspot updated = hotspotRepository.save(hotspot);

        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/models/{modelId}/hotspots/{id}")
    public ResponseEntity<?> deleteModelHotspot(
            @PathVariable Long modelId,
            @PathVariable Long id) {

        hotspotRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
