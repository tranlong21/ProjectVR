package com.vrplus.backend.repository;

import com.vrplus.backend.model.Hotspot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotspotRepository extends JpaRepository<Hotspot, Long> {
    List<Hotspot> findBySceneId(Long sceneId);
    List<Hotspot> findByModelId(Long modelId);
}
