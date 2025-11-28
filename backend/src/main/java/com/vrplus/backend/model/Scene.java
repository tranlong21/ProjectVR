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
@Table(name = "scenes")
public class Scene {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    @JsonIgnore
    private Project project;

    private String name;
    private String titleVi;
    private String titleEn;
    private String panoramaUrl;
    private Integer orderIndex;

    private Double initialPitch;
    private Double initialYaw;

    // Deprecated fields kept for backward compatibility if needed, or removed if
    // strictly following new schema
    // private Double pitch;
    // private Double yaw;
    // private Double hfov;

    @OneToMany(mappedBy = "scene", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<Hotspot> hotspots;
}
