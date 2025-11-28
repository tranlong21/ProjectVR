package com.vrplus.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name = "hotspots")
public class Hotspot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scene_id", nullable = false)
    @JsonIgnore
    private Scene scene;

    private String type; // "link_scene", "info", "url"
    private Double yaw;
    private Double pitch;

    @Column(name = "target_scene_id")
    private Long targetSceneId;

    private String titleVi;
    private String titleEn;

    @Column(columnDefinition = "TEXT")
    private String descriptionVi;

    @Column(columnDefinition = "TEXT")
    private String descriptionEn;

    private String icon;
}
