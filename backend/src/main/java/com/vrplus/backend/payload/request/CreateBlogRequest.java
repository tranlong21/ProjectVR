package com.vrplus.backend.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class CreateBlogRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Slug is required")
    @Pattern(regexp = "^[a-z0-9-]+$", message = "Slug must contain only lowercase letters, numbers, and hyphens")
    private String slug;

    private String thumbnailUrl;

    private String contentSource; // JSON string of ContentSource

    // Optional: Nếu muốn AI tạo draft ngay khi tạo
    private String rawInput; // Dữ liệu thô từ người dùng (ý tưởng, text, links)
    private Boolean useAI = false; // Có dùng AI để sinh contentSource không
}