package com.vrplus.backend.service;

import com.vrplus.backend.model.Hotspot;
import com.vrplus.backend.model.Scene;
import com.vrplus.backend.repository.HotspotRepository;
import com.vrplus.backend.repository.SceneRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class HotspotService implements IHotspotService{

    private final HotspotRepository hotspotRepository;
    private final SceneRepository sceneRepository;

    @Override
    public List<Hotspot> getHotspotsByScene(Long sceneId) {
        return hotspotRepository.findBySceneId(sceneId);
    }

    @Override
    public Hotspot createSceneHotspot(Long sceneId, Hotspot hotspot) {
        Scene scene = sceneRepository.findById(sceneId)
                .orElseThrow(() -> new EntityNotFoundException("Scene not found"));

        hotspot.setScene(scene);
        hotspot.setModelId(null);
        return hotspotRepository.save(hotspot);
    }

    @Override
    public Hotspot updateSceneHotspot(Long sceneId, Long id, Hotspot details) {
        Hotspot hotspot = hotspotRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Hotspot not found"));

        hotspot.setScene(sceneRepository.findById(sceneId)
                .orElseThrow(() -> new EntityNotFoundException("Scene not found")));

        hotspot.setType(details.getType());
        hotspot.setYaw(details.getYaw());
        hotspot.setPitch(details.getPitch());
        hotspot.setTargetSceneId(details.getTargetSceneId());

        hotspot.setTitleVi(details.getTitleVi());
        hotspot.setTitleEn(details.getTitleEn());
        hotspot.setDescriptionVi(details.getDescriptionVi());
        hotspot.setDescriptionEn(details.getDescriptionEn());
        hotspot.setIcon(details.getIcon());
        hotspot.setOrderId(details.getOrderId());

        return hotspotRepository.save(hotspot);
    }

    @Override
    public void deleteSceneHotspot(Long id) {
        hotspotRepository.deleteById(id);
    }

    @Override
    public List<Hotspot> getHotspotsByModel(Long modelId) {
        return hotspotRepository.findByModelId(modelId);
    }

    @Override
    public Hotspot createModelHotspot(Long modelId, Hotspot hotspot) {
        hotspot.setModelId(modelId);
        hotspot.setType("model");
        return hotspotRepository.save(hotspot);
    }

    @Override
    public Hotspot updateModelHotspot(Long modelId, Long id, Hotspot details) {
        Hotspot hotspot = hotspotRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Hotspot not found"));

        hotspot.setModelId(modelId);

        hotspot.setX(details.getX());
        hotspot.setY(details.getY());
        hotspot.setZ(details.getZ());

        hotspot.setCameraPosX(details.getCameraPosX());
        hotspot.setCameraPosY(details.getCameraPosY());
        hotspot.setCameraPosZ(details.getCameraPosZ());

        hotspot.setCameraTargetX(details.getCameraTargetX());
        hotspot.setCameraTargetY(details.getCameraTargetY());
        hotspot.setCameraTargetZ(details.getCameraTargetZ());

        hotspot.setTitleVi(details.getTitleVi());
        hotspot.setTitleEn(details.getTitleEn());
        hotspot.setDescriptionVi(details.getDescriptionVi());
        hotspot.setDescriptionEn(details.getDescriptionEn());
        hotspot.setOrderId(details.getOrderId());
        hotspot.setIcon(details.getIcon());
        hotspot.setExtra(details.getExtra());

        return hotspotRepository.save(hotspot);
    }

    @Override
    public void deleteModelHotspot(Long id) {
        hotspotRepository.deleteById(id);
    }
}
