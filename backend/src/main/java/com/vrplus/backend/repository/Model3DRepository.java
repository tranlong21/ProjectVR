package com.vrplus.backend.repository;

import com.vrplus.backend.model.Model3D;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface Model3DRepository extends JpaRepository<Model3D, Long> {
    List<Model3D> findByProjectId(Long projectId);
}
