package com.vrplus.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Service
public class OllamaClient {

    private final RestClient restClient;

    public OllamaClient() {
        this.restClient = RestClient.create("http://localhost:11434");
    }

    public String generate(String prompt) {

        Map<String, Object> body = Map.of(
                "model", "qwen2.5:7b",
                "prompt", prompt,
                "stream", false
        );

        Map<?, ?> response = restClient.post()
                .uri("/api/generate")
                .body(body)
                .retrieve()
                .body(Map.class);

        if (response == null || !response.containsKey("response")) {
            throw new RuntimeException("Invalid response from Ollama");
        }

        return response.get("response").toString();
    }
}
