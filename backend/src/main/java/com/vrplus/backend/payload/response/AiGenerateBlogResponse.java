package com.vrplus.backend.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AiGenerateBlogResponse {

    private String titleVi;
    private String contentVi;
}
