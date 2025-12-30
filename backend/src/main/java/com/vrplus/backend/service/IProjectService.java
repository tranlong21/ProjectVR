package com.vrplus.backend.service;

import com.vrplus.backend.model.Project;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface IProjectService {
    List<Project> getAllProjects();

    Project getProjectById(Long id);

    Project createProject(Project project);

    Project updateProject(Long id, Project project);

    void deleteProject(Long id);

    String uploadFile(MultipartFile file);

    String updateThumbnailById(Long id, MultipartFile file, String url) throws IOException;
}
