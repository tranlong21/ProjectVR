package com.vrplus.backend.service;

import com.vrplus.backend.model.Model3D;
import com.vrplus.backend.model.ModelProcessStatus;
import com.vrplus.backend.model.Project;
import com.vrplus.backend.repository.Model3DRepository;
import com.vrplus.backend.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class Model3DService {

    private final Model3DRepository modelRepo;
    private final ProjectRepository projectRepo;
    private final FilesStorageService filesStorageService;
    private final ModelProcessingService processingService;



    public Model3DService(
            Model3DRepository modelRepo,
            ProjectRepository projectRepo,
            FilesStorageService filesStorageService,
            ModelProcessingService processingService
    ) {
        this.modelRepo = modelRepo;
        this.projectRepo = projectRepo;
        this.filesStorageService = filesStorageService;
        this.processingService = processingService;
    }

    public Model3D uploadOrReplaceModel(
            Long projectId,
            MultipartFile file,
            String name,
            String descriptionVi,
            String descriptionEn
    ) {

        Project project = projectRepo.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        List<Model3D> existing = modelRepo.findByProjectId(projectId);
        Model3D model = existing.isEmpty() ? new Model3D() : existing.get(0);

        filesStorageService.deleteFile(model.getRawFilePath());
        filesStorageService.deleteFile(model.getWebFilePath());

        String rawFileUrl = filesStorageService.storeFile(file, "models/raw");
        String webFileUrl = rawFileUrl.replace("/models/raw/", "/models/web/");

        model.setProject(project);
        model.setName(name);
        model.setDescriptionVi(descriptionVi);
        model.setDescriptionEn(descriptionEn);
        model.setRawFilePath(rawFileUrl);
        model.setWebFilePath(webFileUrl);
        model.setStatus(ModelProcessStatus.PROCESSING);

        modelRepo.save(model);

        boolean ok = processingService.optimize(rawFileUrl, webFileUrl);

        if (ok) {
            model.setStatus(ModelProcessStatus.READY_FOR_WEB);
            model.setModelUrl(webFileUrl);
        } else {
            model.setStatus(ModelProcessStatus.FAILED);
        }

        return modelRepo.save(model);
    }

    public List<Model3D> getModelsByProjectId(Long projectId) {
        return modelRepo.findByProjectId(projectId);
    }

    public List<Model3D> getModelsWithHotspots(Long projectId) {
        return modelRepo.findByProjectIdWithHotspots(projectId);
    }
    @Transactional
    public void deleteModel(Long id) {
        if (!modelRepo.existsById(id)) {
            throw new RuntimeException("Model not found with id: " + id);
        }
        modelRepo.deleteById(id);
    }
}
