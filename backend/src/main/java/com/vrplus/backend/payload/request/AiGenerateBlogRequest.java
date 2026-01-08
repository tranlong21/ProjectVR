package com.vrplus.backend.payload.request;

import lombok.Data;

@Data
public class AiGenerateBlogRequest {
    private String title;
    private String topic;


    private Integer minWords;
    private Integer maxWords;
    private String audience;
    private Boolean returnHtml;
}
