package com.vrplus.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "blog_posts")
@Data
@NoArgsConstructor
@Getter
@Setter
public class BlogPost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String titleVi;

    @NotBlank
    private String titleEn;

    @NotBlank
    @Column(unique = true)
    private String slug;

    private String thumbnailUrl;

    @Column(columnDefinition = "TEXT")
    private String contentVi;

    @Column(columnDefinition = "TEXT")
    private String contentEn;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

//    public BlogPost(String titleVi, String titleEn, String slug, String thumbnailUrl, String contentVi,
//            String contentEn) {
//        this.titleVi = titleVi;
//        this.titleEn = titleEn;
//        this.slug = slug;
//        this.thumbnailUrl = thumbnailUrl;
//        this.contentVi = contentVi;
//        this.contentEn = contentEn;
//    }
}
