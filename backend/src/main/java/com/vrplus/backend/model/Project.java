package com.vrplus.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "projects")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title; // Fallback or internal name

    private String titleVi;
    private String titleEn;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    private String location;

    @Column(columnDefinition = "TEXT")
    private String shortDescription; // Fallback

    @Column(columnDefinition = "TEXT")
    private String detailedDescription; // Fallback

    @Column(columnDefinition = "TEXT")
    private String descriptionVi;

    @Column(columnDefinition = "TEXT")
    private String descriptionEn;

    @Column(columnDefinition = "TEXT")
    private String aiDescription;

    private String thumbnailUrl;

    private boolean featured;

    @Transient
    private boolean has360;

    @Transient
    private boolean has3d;

    @Transient
    private boolean hasGallery;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // One project has many scenes
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Scene> scenes;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GalleryImage> galleryImages;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Model3D> models;
}
