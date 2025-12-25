package com.vrplus.backend.controller.admin;

import com.vrplus.backend.model.BlogPost;
import com.vrplus.backend.model.BlogStatus;
import com.vrplus.backend.payload.request.CreateBlogRequest;
import com.vrplus.backend.payload.request.UpdateBlogRequest;
import com.vrplus.backend.repository.BlogRepository;
import com.vrplus.backend.service.FileStorageService;
import com.vrplus.backend.service.IBlogService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin/blogs")
@PreAuthorize("hasRole('ADMIN')")
public class AdminBlogController {

    @Autowired
    private IBlogService blogService;

    @Autowired
    private FileStorageService fileStorageService;

    // ================= READ =================

    /**
     * Lấy tất cả bài viết (kể cả draft)
     * GET /api/admin/blogs
     */
    @GetMapping
    public ResponseEntity<List<BlogPost>> getAllPosts() {
        List<BlogPost> posts = blogService.getAllPosts();
        return ResponseEntity.ok(posts);
    }

    /**
     * Lấy bài viết theo status
     * GET /api/admin/blogs/status/{status}
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<BlogPost>> getPostsByStatus(@PathVariable BlogStatus status) {
        List<BlogPost> posts = blogService.getPostsByStatus(status);
        return ResponseEntity.ok(posts);
    }

    /**
     * Lấy bài viết theo ID
     * GET /api/admin/blogs/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<BlogPost> getById(@PathVariable Long id) {
        return blogService.getPostById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ================= CREATE =================

    /**
     * Tạo bài viết mới
     * POST /api/admin/blogs
     * Body: CreateBlogRequest (JSON)
     */
    @PostMapping
    public ResponseEntity<?> createBlog(@Valid @RequestBody CreateBlogRequest request) {
        try {
            BlogPost post = blogService.createPost(request);
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ================= UPDATE =================

    /**
     * Cập nhật bài viết (từ Visual Editor)
     * PUT /api/admin/blogs/{id}
     * Body: UpdateBlogRequest (JSON)
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBlog(
            @PathVariable Long id,
            @Valid @RequestBody UpdateBlogRequest request
    ) {
        try {
            BlogPost post = blogService.updatePost(id, request);
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Cập nhật từ HTML Editor
     * PUT /api/admin/blogs/{id}/html
     * Body: { "html": "<article>...</article>" }
     */
    @PutMapping("/{id}/html")
    public ResponseEntity<?> updateFromHtml(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload
    ) {
        try {
            String html = payload.get("html");
            if (html == null || html.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "HTML content is required"));
            }

            BlogPost post = blogService.updateFromHtml(id, html);
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ================= STATUS =================

    /**
     * Đổi trạng thái bài viết (draft/published/archived)
     * PATCH /api/admin/blogs/{id}/status
     * Body: { "status": "PUBLISHED" }
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload
    ) {
        try {
            String statusStr = payload.get("status");
            if (statusStr == null || statusStr.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Status is required"));
            }

            BlogStatus status = BlogStatus.valueOf(statusStr.toUpperCase());
            BlogPost post = blogService.updateStatus(id, status);
            return ResponseEntity.ok(post);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid status. Valid values: DRAFT, PUBLISHED, ARCHIVED"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ================= THUMBNAIL =================

    /**
     * Upload thumbnail cho bài viết
     * POST /api/admin/blogs/{id}/thumbnail
     * Form-data: file
     */
    @PostMapping("/{id}/thumbnail")
    public ResponseEntity<?> uploadThumbnail(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            String fileUrl = fileStorageService.storeFile(file, "blog");
            BlogPost post = blogService.updateThumbnail(id, fileUrl);
            return ResponseEntity.ok(post);
        } catch (IOException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Failed to upload file: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Cập nhật thumbnail URL trực tiếp (không upload)
     * PATCH /api/admin/blogs/{id}/thumbnail
     * Body: { "thumbnailUrl": "https://..." }
     */
    @PatchMapping("/{id}/thumbnail")
    public ResponseEntity<?> updateThumbnailUrl(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload
    ) {
        try {
            String thumbnailUrl = payload.get("thumbnailUrl");
            BlogPost post = blogService.updateThumbnail(id, thumbnailUrl);
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ================= DELETE =================

    /**
     * Xóa bài viết
     * DELETE /api/admin/blogs/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBlog(@PathVariable Long id) {
        try {
            blogService.deletePost(id);
            return ResponseEntity.ok()
                    .body(Map.of("message", "Post deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

}