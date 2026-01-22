package com.vrplus.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TranslationService {

    @Value("${translation.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // ===============================
    // 1. DỊCH TEXT (TITLE + CONTENT NGẮN)
    // → LUÔN CHUNK
    // ===============================
    public String translateText(String text, String sourceLang, String targetLang) {
        if (text == null || text.isBlank()) return text;

        List<String> chunks = splitText(text, 300); // ⬅️ QUAN TRỌNG
        StringBuilder result = new StringBuilder();

        for (String chunk : chunks) {
            try {
                Map<String, String> body = new HashMap<>();
                body.put("q", chunk);
                body.put("source", sourceLang);
                body.put("target", targetLang);
                body.put("format", "text");

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);

                HttpEntity<Map<String, String>> request =
                        new HttpEntity<>(body, headers);

                ResponseEntity<String> response =
                        restTemplate.postForEntity(apiUrl, request, String.class);

                if (response.getStatusCode().is2xxSuccessful()
                    && response.getBody() != null) {

                    JsonNode root = objectMapper.readTree(response.getBody());
                    result.append(root.path("translatedText").asText(chunk));
                } else {
                    result.append(chunk);
                }

                Thread.sleep(120); // tránh overload API

            } catch (Exception e) {
                System.err.println("Text translation failed: " + e.getMessage());
                result.append(chunk); // fallback
            }
        }

        return result.toString();
    }

    // ===============================
    // 2. DỊCH HTML THEO BLOCK
    // ===============================
    public String translateHtmlByBlock(String html,
                                       String sourceLang,
                                       String targetLang) {

        if (html == null || html.isBlank()) return html;

        Document doc = Jsoup.parseBodyFragment(html);
        Element body = doc.body();

        Elements blocks = body.select("h1, h2, h3, h4, h5, h6, p, li");

        for (Element block : blocks) {

            if (!block.select("img").isEmpty()) continue;

            String text = block.text();
            if (text == null || text.isBlank()) continue;

            String translated = translateText(text, sourceLang, targetLang);
            block.text(translated);
        }

        return body.html();
    }

    // ===============================
    // 3. CHIA TEXT THÀNH CHUNKS
    // ===============================
    private List<String> splitText(String text, int maxLength) {

        List<String> parts = new ArrayList<>();
        int start = 0;

        while (start < text.length()) {
            int end = Math.min(start + maxLength, text.length());

            if (end < text.length()) {
                int lastDot = text.lastIndexOf('.', end);
                if (lastDot > start) {
                    end = lastDot + 1;
                }
            }

            parts.add(text.substring(start, end));
            start = end;
        }

        return parts;
    }
}
