package com.vrplus.backend.service;

import com.vrplus.backend.model.Model3D;

import java.util.List;

public interface IModel3DService {
    List<Model3D> getAllModels();
    List<Model3D> getModelsByProject(Long projectId);
    Model3D getModelById(Long id);
    Model3D createModel(Model3D model3D);
    List<Model3D> getModelsWithHotspots(Long projectId);
}
