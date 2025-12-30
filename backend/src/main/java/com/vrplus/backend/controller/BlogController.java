package com.vrplus.backend.controller;

import com.vrplus.backend.model.BlogPost;
import com.vrplus.backend.repository.BlogRepository;
import com.vrplus.backend.service.BlogService;
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

    @Autowired
    BlogService blogService;

    @GetMapping
    public List<BlogPost> getAllPosts() {
        return blogService.getAllPosts();
    }

    @GetMapping("/{slug}")
    public ResponseEntity<?> getPostBySlug(@PathVariable String slug) {
        return blogService.getPostBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createPost(@RequestBody BlogPost blogPost) {
        return ResponseEntity.ok(blogService.createPost(blogPost));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updatePost(@PathVariable Long id, @RequestBody BlogPost blogPostDetails) {
        return ResponseEntity.ok(blogService.updatePost(id, blogPostDetails));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        blogService.deletePost(id);
        return ResponseEntity.ok().build();
    }
}
