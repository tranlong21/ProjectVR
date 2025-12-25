package com.vrplus.backend.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.stream.Stream;

public interface FilesStorageService {
    void init();
    String storeFile(MultipartFile file, String subFolder);
    void deleteFile(String fileUrl);
    Path resolvePathFromUrl(String fileUrl);
    Resource load(String fileUrl);
    void deleteAll();
    Stream<Path> loadAll();
}
