package com.vrplus.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "models_3d")
public class Model3D {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String category;

    @Column(columnDefinition = "TEXT")
    private String descriptionVi;

    @Column(columnDefinition = "TEXT")
    private String descriptionEn;

    private String format;
    private String fileUrl;
    private String modelUrl;
    private String previewImageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Project project;
}
