package com.vrplus.backend.service;

import com.vrplus.backend.model.ContentSource;
import com.vrplus.backend.model.ContentSource.ContentBlock;
import org.springframework.stereotype.Component;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.regex.Pattern;

/**
 * Validate nội dung trước khi lưu
 * Đảm bảo không có XSS, script injection, nội dung độc hại
 */
@Component
public class ContentValidator {

    private static final Pattern SCRIPT_PATTERN = Pattern.compile("<script[^>]*>.*?</script>",
            Pattern.CASE_INSENSITIVE | Pattern.DOTALL);
    private static final Pattern DANGEROUS_PATTERN = Pattern.compile("javascript:|on\\w+\\s*=",
            Pattern.CASE_INSENSITIVE);

    private static final int MAX_CONTENT_LENGTH = 50000; // 50KB cho mỗi block
    private static final int MAX_BLOCKS = 1000;

    public void validate(ContentSource source) {
        if (source == null) {
            throw new IllegalArgumentException("Content source cannot be null");
        }

        if (source.getBlocks() == null || source.getBlocks().isEmpty()) {
            throw new IllegalArgumentException("Content must have at least one block");
        }

        if (source.getBlocks().size() > MAX_BLOCKS) {
            throw new IllegalArgumentException("Too many content blocks (max: " + MAX_BLOCKS + ")");
        }

        for (ContentBlock block : source.getBlocks()) {
            validateBlock(block);
        }
    }

    private void validateBlock(ContentBlock block) {
        if (block == null || block.getType() == null) {
            throw new IllegalArgumentException("Block type is required");
        }

        // Validate content length
        if (block.getContent() != null && block.getContent().length() > MAX_CONTENT_LENGTH) {
            throw new IllegalArgumentException("Block content too long");
        }

        // Check for dangerous content
        if (block.getContent() != null) {
            checkDangerousContent(block.getContent());
        }

        // Validate URLs
        if (block.getUrl() != null) {
            validateUrl(block.getUrl());
        }

        // Type-specific validation
        switch (block.getType().toLowerCase()) {
            case "heading" -> validateHeading(block);
            case "image" -> validateImage(block);
            case "link" -> validateLink(block);
            case "list" -> validateList(block);
        }
    }

    private void validateHeading(ContentBlock block) {
        if (block.getContent() == null || block.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("Heading content cannot be empty");
        }

        String level = block.getLevel();
        if (level == null || !level.matches("h[1-6]")) {
            throw new IllegalArgumentException("Invalid heading level: " + level);
        }
    }

    private void validateImage(ContentBlock block) {
        if (block.getUrl() == null || block.getUrl().trim().isEmpty()) {
            throw new IllegalArgumentException("Image URL is required");
        }

        validateUrl(block.getUrl());

        // Check if URL points to an image
        String url = block.getUrl().toLowerCase();
        if (!url.matches(".*\\.(jpg|jpeg|png|gif|webp|svg)(\\?.*)?$")) {
            throw new IllegalArgumentException("Invalid image URL format");
        }
    }

    private void validateLink(ContentBlock block) {
        if (block.getUrl() == null || block.getUrl().trim().isEmpty()) {
            throw new IllegalArgumentException("Link URL is required");
        }

        if (block.getContent() == null || block.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("Link text is required");
        }

        validateUrl(block.getUrl());
    }

    private void validateList(ContentBlock block) {
        if (block.getItems() == null || block.getItems().isEmpty()) {
            throw new IllegalArgumentException("List must have at least one item");
        }

        for (String item : block.getItems()) {
            if (item == null || item.trim().isEmpty()) {
                throw new IllegalArgumentException("List item cannot be empty");
            }
            checkDangerousContent(item);
        }
    }

    private void validateUrl(String url) {
        try {
            URL parsedUrl = new URL(url);
            String protocol = parsedUrl.getProtocol().toLowerCase();

            if (!protocol.equals("http") && !protocol.equals("https")) {
                throw new IllegalArgumentException("Only HTTP/HTTPS URLs are allowed");
            }
        } catch (MalformedURLException e) {
            throw new IllegalArgumentException("Invalid URL format: " + url);
        }

        checkDangerousContent(url);
    }

    private void checkDangerousContent(String content) {
        if (SCRIPT_PATTERN.matcher(content).find()) {
            throw new IllegalArgumentException("Script tags are not allowed");
        }

        if (DANGEROUS_PATTERN.matcher(content).find()) {
            throw new IllegalArgumentException("Dangerous patterns detected (javascript:, event handlers)");
        }
    }
}