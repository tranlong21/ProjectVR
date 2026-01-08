package com.vrplus.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class TranslationService {

    @Value("${translation.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String translateHtml(String htmlContent, String sourceLang, String targetLang) {
        if (htmlContent == null || htmlContent.trim().isEmpty()) {
            return "";
        }

        try {
            // Prepare Request
            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("q", htmlContent);
            requestBody.put("source", sourceLang);
            requestBody.put("target", targetLang);
            requestBody.put("format", "html");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, headers);

            // Send Request
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, request, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                String translatedText = root.path("translatedText").asText();
                return sanitizeHtml(translatedText);
            }
        } catch (Exception e) {
            System.err.println("Translation failed: " + e.getMessage());
            // Fallback: return original content but maybe with a warning or just the
            // content?
            // User requirement: "Error handling & fallback".
            // Fallback strategy: Return source content or empty.
            // Since automatic translation is key, returning empty might hide issues.
            // Returning source allows seeing the error clearly (it's not translated).
            return htmlContent;
        }
        return htmlContent;
    }

    public String translateText(String text, String sourceLang, String targetLang) {
        if (text == null || text.trim().isEmpty())
            return "";

        try {
            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("q", text);
            requestBody.put("source", sourceLang);
            requestBody.put("target", targetLang);
            requestBody.put("format", "text");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, request, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                return root.path("translatedText").asText();
            }
        } catch (Exception e) {
            System.err.println("Text translation failed: " + e.getMessage());
        }
        return text;
    }

    private String sanitizeHtml(String html) {
        // Allow common block and inline tags, plus images
        Safelist safelist = Safelist.relaxed()
                .addTags("h1", "h2", "h3", "h4", "h5", "h6", "strong", "em", "u", "blockquote", "ul", "ol", "li", "img")
                .addAttributes("img", "src", "alt", "title")
                .preserveRelativeLinks(true);

        return Jsoup.clean(html, safelist);
    }
}
