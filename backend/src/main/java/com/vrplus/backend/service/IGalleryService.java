package com.vrplus.backend.service;

import com.vrplus.backend.model.GalleryImage;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface IGalleryService {
    List<GalleryImage> getAll();

    List<GalleryImage> getByProjectId(Long projectId);


    GalleryImage create(Map<String, Object> payload);

    GalleryImage update(Long id, GalleryImage img);

    void delete(Long id);


}
