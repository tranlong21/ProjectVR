package com.vrplus.backend.controller;

import com.vrplus.backend.model.BlogPost;
import com.vrplus.backend.repository.BlogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/blog")
public class BlogController {

    @Autowired
    BlogRepository blogRepository;

    @GetMapping
    public List<BlogPost> getAllPosts() {
        return blogRepository.findAll();
    }

    @GetMapping("/{slug}")
    public ResponseEntity<?> getPostBySlug(@PathVariable String slug) {
        return blogRepository.findBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createPost(@RequestBody BlogPost blogPost) {
        if (blogRepository.existsBySlug(blogPost.getSlug())) {
            return ResponseEntity.badRequest().body("Error: Slug is already taken!");
        }
        BlogPost savedPost = blogRepository.save(blogPost);
        return ResponseEntity.ok(savedPost);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updatePost(@PathVariable Long id, @RequestBody BlogPost blogPostDetails) {
        return blogRepository.findById(id)
                .map(post -> {
                    post.setTitleVi(blogPostDetails.getTitleVi());
                    post.setTitleEn(blogPostDetails.getTitleEn());
                    post.setSlug(blogPostDetails.getSlug());
                    post.setThumbnailUrl(blogPostDetails.getThumbnailUrl());
                    post.setContentVi(blogPostDetails.getContentVi());
                    post.setContentEn(blogPostDetails.getContentEn());
                    return ResponseEntity.ok(blogRepository.save(post));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        return blogRepository.findById(id)
                .map(post -> {
                    blogRepository.delete(post);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
