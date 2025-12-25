package com.vrplus.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vrplus.backend.model.ContentSource;
import com.vrplus.backend.service.AIContentGenerator;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class OllamaContentGenerator implements AIContentGenerator {

    private static final String OLLAMA_URL = "http://localhost:11434/api/generate";
    private static final String MODEL = "qwen2.5:3b";

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public ContentSource generateDraft(String rawInput, String tone) {
        try {
            String prompt = buildPrompt(rawInput);

            Map<String, Object> body = new HashMap<>();
            body.put("model", MODEL);
            body.put("prompt", prompt);
            body.put("stream", false);
            body.put("options", Map.of(
                    "temperature", 0.7,     // Giảm để ít sáng tạo quá đà
                    "top_p", 0.9,
                    "num_predict", 1200,    // Giới hạn ~800-1000 từ, tránh generate dài vô tận
                    "num_ctx", 8192         // Nếu model hỗ trợ context dài
            ));

            String response = restTemplate.postForObject(
                    OLLAMA_URL,
                    body,
                    String.class
            );

            JsonNode json = objectMapper.readTree(response);
            String aiText = json.get("response").asText();

            return convertToContentSource(aiText);

        } catch (Exception e) {
            throw new RuntimeException("Ollama generation failed", e);
        }
    }

    private String buildPrompt(String rawInput) {
        return """
    Bạn là một chuyên gia viết blog tiếng Việt. Hãy viết bài blog rõ ràng, có cấu trúc tốt, bằng tiếng Việt thuần túy.
    - Có tiêu đề chính (H1)
    - Có các đoạn nội dung logic
    - Không dùng markdown
    - Không emoji
    
    Chủ đề chính: """ + rawInput;
    }

    private ContentSource convertToContentSource(String text) {
        ContentSource source = new ContentSource();
        List<ContentSource.ContentBlock> blocks = new ArrayList<>();

        for (String line : text.split("\n")) {
            if (line.trim().isEmpty()) continue;

            ContentSource.ContentBlock p = new ContentSource.ContentBlock();
            p.setType("paragraph");
            p.setContent(line.trim());
            blocks.add(p);
        }

        source.setBlocks(blocks);
        return source;
    }
}
