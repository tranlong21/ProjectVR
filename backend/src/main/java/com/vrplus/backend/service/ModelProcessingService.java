package com.vrplus.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class ModelProcessingService {

    @Value("${gltf.transform.cmd:gltf-transform}")
    private String gltfCmd;

    @Value("${gltf.transform.cmd.windows:gltf-transform.cmd}")
    private String gltfCmdWindows;

    private final FilesStorageService filesStorageService;

    public ModelProcessingService(FilesStorageService filesStorageService) {
        this.filesStorageService = filesStorageService;
    }

    private String resolveCmd() {
        String os = System.getProperty("os.name").toLowerCase(Locale.ROOT);
        return os.contains("win") ? gltfCmdWindows : gltfCmd;
    }

    public boolean optimize(String rawFileUrl, String webFileUrl) {
        try {
            Path rawPath = filesStorageService.resolvePathFromUrl(rawFileUrl);
            Path webPath = filesStorageService.resolvePathFromUrl(webFileUrl);
            Files.createDirectories(webPath.getParent());

            List<String> cmd = new ArrayList<>();
            cmd.add(resolveCmd());
            cmd.add("optimize");
            cmd.add(rawPath.toAbsolutePath().toString());
            cmd.add(webPath.toAbsolutePath().toString());

            cmd.add("--compress");
            cmd.add("draco");
            cmd.add("--texture-compress");
            cmd.add("webp");
            cmd.add("--texture-size");
            cmd.add("1024");
            System.out.println("GLTF CMD = " + String.join(" ", cmd));

            ProcessBuilder pb = new ProcessBuilder(cmd);
            pb.redirectErrorStream(true);
            Process p = pb.start();

            try (BufferedReader br = new BufferedReader(
                    new InputStreamReader(p.getInputStream()))) {
                while (br.readLine() != null) {}
            }

            return p.waitFor() == 0 && Files.exists(webPath);
        } catch (Exception e) {
            return false;
        }
    }
}
