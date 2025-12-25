package com.vrplus.backend.controller;

import com.vrplus.backend.model.Model3D;
import com.vrplus.backend.model.ModelProcessStatus;
import com.vrplus.backend.service.Model3DService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/models3d")
public class Model3DController {

    @Autowired
    private Model3DService model3DService;

    /**
     * USER API
     * - Chỉ trả model READY_FOR_WEB
     * - Chỉ trả modelUrl (web)
     * - Có hotspots
     */
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Model3D>> getModelsByProject(
            @PathVariable Long projectId
    ) {

        List<Model3D> models = model3DService.getModelsWithHotspots(projectId)
                .stream()
                .filter(m -> m.getStatus() == ModelProcessStatus.READY_FOR_WEB)
                .map(this::sanitizeForUser)
                .collect(Collectors.toList());

        return ResponseEntity.ok(models);
    }

    /**
     * ⚠️ TUYỆT ĐỐI KHÔNG modify entity gốc
     */
    private Model3D sanitizeForUser(Model3D model) {
        return Model3D.builder()
                .id(model.getId())
                .name(model.getName())
                .category(model.getCategory())
                .descriptionVi(model.getDescriptionVi())
                .descriptionEn(model.getDescriptionEn())
                .format(model.getFormat())

                .status(model.getStatus())

                .modelUrl(model.getModelUrl())
                .previewImageUrl(model.getPreviewImageUrl())
                .hotspots(model.getHotspots())
                .build();
    }

}
