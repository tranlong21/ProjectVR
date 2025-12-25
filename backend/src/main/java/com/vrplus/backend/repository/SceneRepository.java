package com.vrplus.backend.repository;

import com.vrplus.backend.model.Scene;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SceneRepository extends JpaRepository<Scene, Long> {
    List<Scene> findByProjectId(Long projectId);

    List<Scene> findByProjectIdOrderByOrderIndexAsc(Long projectId);

    boolean existsByProjectId(Long projectId);
}
