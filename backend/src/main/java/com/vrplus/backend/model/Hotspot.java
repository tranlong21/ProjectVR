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
    @JoinColumn(name = "scene_id", nullable = true)
    @JsonIgnore
    private Scene scene;

    private String type;

    private Double yaw;
    private Double pitch;

    @Column(name = "target_scene_id", nullable = true)
    private Long targetSceneId;

    private String titleVi;
    private String titleEn;

    private Integer orderId;

    @Column(columnDefinition = "TEXT")
    private String descriptionVi;

    @Column(columnDefinition = "TEXT")
    private String descriptionEn;

    private String icon;

    @Column(name = "model_id", nullable = true)
    private Long modelId;

    private Float x;
    private Float y;
    private Float z;

    @Column(name = "camera_pos_x")
    private Float cameraPosX;

    @Column(name = "camera_pos_y")
    private Float cameraPosY;

    @Column(name = "camera_pos_z")
    private Float cameraPosZ;

    @Column(name = "camera_target_x")
    private Float cameraTargetX;

    @Column(name = "camera_target_y")
    private Float cameraTargetY;

    @Column(name = "camera_target_z")
    private Float cameraTargetZ;

    @Column(columnDefinition = "JSON")
    private String extra;

    @PrePersist
    @PreUpdate
    public void applyDefaults() {

        if (this.yaw == null) this.yaw = 0D;
        if (this.pitch == null) this.pitch = 0D;
        if (this.orderId == null) this.orderId = 0;

        if (this.x == null) this.x = 0F;
        if (this.y == null) this.y = 0F;
        if (this.z == null) this.z = 0F;

        if (this.cameraPosX == null) this.cameraPosX = 0F;
        if (this.cameraPosY == null) this.cameraPosY = 0F;
        if (this.cameraPosZ == null) this.cameraPosZ = 0F;

        if (this.cameraTargetX == null) this.cameraTargetX = 0F;
        if (this.cameraTargetY == null) this.cameraTargetY = 0F;
        if (this.cameraTargetZ == null) this.cameraTargetZ = 0F;
    }
}
