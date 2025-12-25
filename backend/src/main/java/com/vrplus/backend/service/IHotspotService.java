package com.vrplus.backend.service;

import com.vrplus.backend.model.Hotspot;

import java.util.List;

public interface IHotspotService {
    List<Hotspot> getHotspotsByScene(Long sceneId);
    Hotspot createSceneHotspot(Long sceneId, Hotspot hotspot);
    Hotspot updateSceneHotspot(Long sceneId, Long id, Hotspot hotspotDetails);
    void deleteSceneHotspot(Long id);

    List<Hotspot> getHotspotsByModel(Long modelId);
    Hotspot createModelHotspot(Long modelId, Hotspot hotspot);
    Hotspot updateModelHotspot(Long modelId, Long id, Hotspot hotspot);
    void deleteModelHotspot(Long id);
}
