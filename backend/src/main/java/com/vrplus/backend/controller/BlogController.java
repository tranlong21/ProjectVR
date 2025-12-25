package com.vrplus.backend.controller;

import com.vrplus.backend.model.BlogPost;
import com.vrplus.backend.model.BlogStatus;
import com.vrplus.backend.repository.BlogRepository;
import com.vrplus.backend.service.BlogService;
import com.vrplus.backend.service.IBlogService;
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
    private IBlogService blogService;

    /**
     * Lấy tất cả bài viết đã publish
     * GET /api/blog
     */
    @GetMapping
    public ResponseEntity<List<BlogPost>> getPublishedPosts() {
        List<BlogPost> posts = blogService.getPostsByStatus(BlogStatus.PUBLISHED);
        return ResponseEntity.ok(posts);
    }

    /**
     * Lấy chi tiết bài viết theo slug (chỉ bài đã publish)
     * GET /api/blog/{slug}
     */
    @GetMapping("/{slug}")
    public ResponseEntity<BlogPost> getPublishedPostBySlug(@PathVariable String slug) {
        return blogService.getPostBySlug(slug)
                .filter(post -> post.getStatus() == BlogStatus.PUBLISHED)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

}
