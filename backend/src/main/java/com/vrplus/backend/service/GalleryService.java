    package com.vrplus.backend.service;

    import com.vrplus.backend.model.GalleryImage;
    import com.vrplus.backend.model.Project;
    import com.vrplus.backend.repository.GalleryImageRepository;
    import com.vrplus.backend.repository.ProjectRepository;
    import lombok.AllArgsConstructor;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.stereotype.Service;

    import java.util.List;
    import java.util.Map;

    @Service
    @AllArgsConstructor
    public class GalleryService implements  IGalleryService{

        @Autowired
        private GalleryImageRepository galleryRepo;

        @Autowired
        private ProjectRepository projectRepo;

        @Override
        public List<GalleryImage> getAll() {
            return galleryRepo.findAll();
        }

        @Override
        public List<GalleryImage> getByProjectId(Long projectId) {
            if (!projectRepo.existsById(projectId)) {
                throw new RuntimeException("Project not found");
            }
            return galleryRepo.findByProjectId(projectId);
        }

        @Override
        public GalleryImage create(Map<String, Object> payload) {
            Long projectId = Long.valueOf(payload.get("projectId").toString());
            Project project = projectRepo.findById(projectId)
                    .orElseThrow(() -> new RuntimeException("Project not found with ID: " + projectId));

            GalleryImage img = new GalleryImage();
            img.setProject(project);
            img.setUrl((String) payload.get("url")); // lấy dữ liệu 
            img.setCaption((String) payload.get("caption"));

            return galleryRepo.save(img);
        }


        @Override
        public GalleryImage update(Long id, GalleryImage updated) {
            GalleryImage img = galleryRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Gallery item not found"));

            if (updated.getUrl() != null) img.setUrl(updated.getUrl());
            if (updated.getCaption() != null) img.setCaption(updated.getCaption());

            return galleryRepo.save(img);
        }

        @Override
        public void delete(Long id) {
            GalleryImage img = galleryRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Gallery item not found"));
            galleryRepo.delete(img);
        }
    }
