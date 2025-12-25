package com.vrplus.backend.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

/**
 * Model đại diện cho nội dung có cấu trúc ngữ nghĩa
 * Được lưu dưới dạng JSON trong content_source
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ContentSource {

    private List<ContentBlock> blocks;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ContentBlock {
        private String type; // heading, paragraph, image, link, list, quote, code
        private String level; // h1, h2, h3, h4, h5, h6 (cho heading)
        private String content; // Nội dung text
        private String url; // URL cho image/link
        private String alt; // Alt text cho image
        private String align; // left, center, right, justify
        private String style; // CSS styles nếu cần
        private List<String> items; // Cho list
    }
}