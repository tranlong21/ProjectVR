package com.vrplus.backend.service;

import com.vrplus.backend.model.Category;
import com.vrplus.backend.model.Project;
import com.vrplus.backend.repository.CategoryRepository;
import com.vrplus.backend.repository.GalleryImageRepository;
import com.vrplus.backend.repository.Model3DRepository;
import com.vrplus.backend.repository.ProjectRepository;
import com.vrplus.backend.repository.SceneRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@AllArgsConstructor
public class ProjectService implements IProjectService {

    private final ProjectRepository projectRepository;
    private final CategoryRepository categoryRepository;
    private final SceneRepository sceneRepository;
    private final Model3DRepository model3DRepository;
    private final GalleryImageRepository galleryImageRepository;
    private final FileStorageService fileStorageService;
    private final FilesStorageService filesStorageService;

    @Override
    public List<Project> getAllProjects() {
        List<Project> projects = projectRepository.findAll();
        projects.forEach(p -> {
            Long projectId = p.getId();
            p.setHas360(sceneRepository.existsByProjectId(projectId));
            p.setHas3d(model3DRepository.existsByProjectId(projectId));
            p.setHasGallery(galleryImageRepository.existsByProjectId(projectId));
            p.setScenes(null);
            p.setModels(null);
            p.setGalleryImages(null);
        });
        return projects;
    }

    @Override
    public Project getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        project.setHas360(sceneRepository.existsByProjectId(id));
        project.setHas3d(model3DRepository.existsByProjectId(id));
        project.setHasGallery(galleryImageRepository.existsByProjectId(id));

        return project;
    }

    @Override
    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    @Override
    public Project updateProject(Long id, Project projectDetails) {
        Project project = getProjectById(id);

        project.setTitle(projectDetails.getTitle());
        project.setTitleVi(projectDetails.getTitleVi());
        project.setTitleEn(projectDetails.getTitleEn());
        project.setLocation(projectDetails.getLocation());
        project.setShortDescription(projectDetails.getShortDescription());
        project.setDetailedDescription(projectDetails.getDetailedDescription());
        project.setDescriptionVi(projectDetails.getDescriptionVi());
        project.setDescriptionEn(projectDetails.getDescriptionEn());
        project.setAiDescription(projectDetails.getAiDescription());
        project.setThumbnailUrl(projectDetails.getThumbnailUrl());
        project.setFeatured(projectDetails.isFeatured());

        if (projectDetails.getCategory() != null && projectDetails.getCategory().getId() != null) {
            Category category = categoryRepository.findById(projectDetails.getCategory().getId())
                    .orElse(null);
            project.setCategory(category);
        } else {
            project.setCategory(null);
        }

        return projectRepository.save(project);
    }

    @Override
    public void deleteProject(Long id) {
        Project project = getProjectById(id);

        if (project.getThumbnailUrl() != null && project.getThumbnailUrl().startsWith("/uploads")) {
            fileStorageService.deleteFile(project.getThumbnailUrl());
        }

        projectRepository.delete(project);
    }

    @Override
    public String uploadFile(MultipartFile file) {
        return filesStorageService.storeFile(file, "projects/files");
    }

    @Override
    public String updateThumbnailById(Long id, MultipartFile file, String url) throws IOException {
        Project project = getProjectById(id);

        if (file != null && !file.isEmpty()) {
            if (!fileStorageService.isValidImageFile(file)) {
                throw new RuntimeException("Invalid image file");
            }

            if (project.getThumbnailUrl() != null && project.getThumbnailUrl().startsWith("/uploads")) {
                fileStorageService.deleteFile(project.getThumbnailUrl());
            }

            url = fileStorageService.storeFile(file, "projects/thumbnails");
        }

        if (url == null || url.isEmpty()) {
            throw new RuntimeException("File or URL must be provided");
        }

        project.setThumbnailUrl(url);
        projectRepository.save(project);

        return url;
    }
}
