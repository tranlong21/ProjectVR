package com.vrplus.backend.service;

import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Service
public class OllamaClient {

    private static final String BASE_URL = "http://127.0.0.1:11434";
    private static final String MODEL = "qwen2.5:7b";

    // volatile để có thể recreate an toàn
    private volatile RestClient restClient;

    public OllamaClient() {
        this.restClient = createClient();
    }

    /**
     * Tạo RestClient mới, KHÔNG reuse socket cũ
     */
    private RestClient createClient() {
        SimpleClientHttpRequestFactory factory =
                new SimpleClientHttpRequestFactory();

        factory.setConnectTimeout(5_000);
        factory.setReadTimeout(300_000);      // giới hạn 5 phút

        return RestClient.builder()
                .baseUrl(BASE_URL)
                .requestFactory(factory)
                .build();
    }

    /**
     * Reset client khi socket chết
     */
    private void resetClient() {
        this.restClient = createClient();
    }

    public String generate(String prompt) {

        Map<String, Object> body = Map.of(
                "model", MODEL,
                "prompt", prompt,
                "stream", false
        );

        try {
            return callOllama(body);

        } catch (ResourceAccessException e) {
            // 💥 LỖI SOCKET / CLOSED CHANNEL / TIMEOUT
            // recreate client và thử lại 1 lần
            resetClient();
            return callOllama(body);
        }
    }

    @SuppressWarnings("unchecked")
    private String callOllama(Map<String, Object> body) {

        Map<String, Object> response = restClient.post()
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
