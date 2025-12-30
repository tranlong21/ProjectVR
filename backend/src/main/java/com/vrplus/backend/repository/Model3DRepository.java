package com.vrplus.backend.repository;

import com.vrplus.backend.model.Model3D;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface Model3DRepository extends JpaRepository<Model3D, Long> {

    List<Model3D> findByProjectId(Long projectId);

    @Query("SELECT m FROM Model3D m LEFT JOIN FETCH m.hotspots WHERE m.project.id = :projectId")
    List<Model3D> findByProjectIdWithHotspots(Long projectId);

    boolean existsByProjectId(Long projectId);

    void deleteByProjectId(Long projectId);

}
