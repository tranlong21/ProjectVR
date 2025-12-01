package com.vrplus.backend.controller.admin;

import com.vrplus.backend.model.BlogPost;
import com.vrplus.backend.repository.BlogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.*;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin/blogs")
public class AdminBlogController {

    @Autowired
    BlogRepository blogRepository;

    // ================================
    //  GET ALL
    // ================================
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<BlogPost> getAll() {
        return blogRepository.findAll();
    }

    // ================================
    //  GET BY ID
    // ================================
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return blogRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ================================
    //  CREATE BLOG
    // ================================
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createBlog(@RequestBody BlogPost blogPost) {

        if (blogRepository.existsBySlug(blogPost.getSlug())) {
            return ResponseEntity.badRequest().body("Error: Slug already exists!");
        }

        BlogPost saved = blogRepository.save(blogPost);
        return ResponseEntity.ok(saved);
    }

    // ================================
    //  UPDATE BLOG
    // ================================
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateBlog(
            @PathVariable Long id,
            @RequestBody BlogPost blogPostDetails
    ) {
        return blogRepository.findById(id)
                .map(post -> {
                    post.setTitleVi(blogPostDetails.getTitleVi());
                    post.setTitleEn(blogPostDetails.getTitleEn());
                    post.setSlug(blogPostDetails.getSlug());
                    post.setContentVi(blogPostDetails.getContentVi());
                    post.setContentEn(blogPostDetails.getContentEn());
                    post.setThumbnailUrl(blogPostDetails.getThumbnailUrl());
                    return ResponseEntity.ok(blogRepository.save(post));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ================================
    //  DELETE BLOG
    // ================================
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteBlog(@PathVariable Long id) {
        return blogRepository.findById(id)
                .map(post -> {
                    blogRepository.delete(post);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }


    // ================================
    //  UPLOAD THUMBNAIL
    // ================================
    @PostMapping("/{id}/thumbnail")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadThumbnail(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file
    ) {

        return blogRepository.findById(id).map(post -> {

            try {
                String uploadDir = "uploads/blog/";
                Path uploadPath = Paths.get(uploadDir);

                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                Path filePath = uploadPath.resolve(fileName);

                // SAVE FILE
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                // SET URL TO BLOGPOST
                String url = "/uploads/blog/" + fileName;
                post.setThumbnailUrl(url);
                blogRepository.save(post);

                return ResponseEntity.ok(url);

            } catch (Exception e) {
                return ResponseEntity.badRequest().body("Error uploading file");
            }

        }).orElse(ResponseEntity.notFound().build());
    }
}