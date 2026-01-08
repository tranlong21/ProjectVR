package com.vrplus.backend.controller.admin;

import com.vrplus.backend.model.BlogPost;
import com.vrplus.backend.repository.BlogRepository;
import com.vrplus.backend.service.FileStorageService;
import com.vrplus.backend.service.IBlogService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.vrplus.backend.payload.request.AiGenerateBlogRequest;
import com.vrplus.backend.payload.response.AiGenerateBlogResponse;
import com.vrplus.backend.service.AiBlogService;
import lombok.RequiredArgsConstructor;


import java.io.IOException;
import java.nio.file.*;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin/blogs")
public class AdminBlogController {

    @Autowired
    private IBlogService blogService;
    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private AiBlogService aiBlogService;


    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<BlogPost> getAll() {
        return blogService.getAllPosts();
    }


    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return blogService.getPostById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createBlog(@RequestBody BlogPost blogPost) {
        try {
            BlogPost saved = blogService.createPost(blogPost);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating blog post: " + e.getMessage());
        }
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateBlog(
            @PathVariable Long id,
            @RequestBody BlogPost blogPostDetails
    ) {
        BlogPost updateBlogPost = null;
        try {
            updateBlogPost = blogService.updatePost(id, blogPostDetails);
            return ResponseEntity.ok(updateBlogPost);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating blog post: " + e.getMessage());
        }

    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteBlog(@PathVariable Long id) {
        try{
            blogService.deletePost(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting blog post: " + e.getMessage());
        }
    }


    @PostMapping("/{id}/thumbnail")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadThumbnail(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        try {
            String fileUrl = fileStorageService.storeFile(file, "blog");
            blogService.updateThumbnail(id, fileUrl);
            return ResponseEntity.ok(fileUrl);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Error uploading thumbnail: " + e.getMessage());
        }
    }

    @PostMapping("/generate")
    public AiGenerateBlogResponse generateBlog(
            @RequestBody AiGenerateBlogRequest request
    ) {
        String content = aiBlogService.generateBlog(request);

        String title = request.getTitle() != null
                ? request.getTitle()
                : "Bài viết AI về " + request.getTopic();

        return new AiGenerateBlogResponse(title, content);
    }


}