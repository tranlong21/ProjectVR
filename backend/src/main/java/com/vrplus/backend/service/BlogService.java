package com.vrplus.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vrplus.backend.model.*;
import com.vrplus.backend.payload.request.CreateBlogRequest;
import com.vrplus.backend.payload.request.UpdateBlogRequest;
import com.vrplus.backend.repository.BlogRepository;
import com.vrplus.backend.security.services.UserDetailsImpl;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BlogService implements IBlogService {

    @Autowired
    private BlogRepository blogRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ContentValidator contentValidator;

    @Autowired
    private BlogHtmlRenderer htmlRenderer;

    @Autowired
    private HtmlParser htmlParser;

    @Autowired
    private ObjectMapper objectMapper;

    // AI là OPTIONAL – không có vẫn chạy được
    @Autowired(required = false)
    private AIContentGenerator aiContentGenerator;

    // ================= READ =================

    @Override
    public List<BlogPost> getAllPosts() {
        return blogRepository.findAll();
    }

    @Override
    public List<BlogPost> getPostsByStatus(BlogStatus status) {
        return blogRepository.findByStatus(status);
    }

    @Override
    public Optional<BlogPost> getPostBySlug(String slug) {
        return blogRepository.findBySlug(slug);
    }

    @Override
    public Optional<BlogPost> getPostById(Long id) {
        return blogRepository.findById(id);
    }

    // ================= CREATE =================

    @Override
    public BlogPost createPost(CreateBlogRequest req) {

        if (blogRepository.existsBySlug(req.getSlug())) {
            throw new RuntimeException("Slug already exists");
        }

        String contentSourceJson;

        // ===== AI MODE =====
        if (Boolean.TRUE.equals(req.getUseAI())) {

            if (req.getRawInput() == null || req.getRawInput().isBlank()) {
                throw new RuntimeException("rawInput is required when useAI is true");
            }

            if (aiContentGenerator != null) {
                try {
                    System.out.println("Calling AI to generate content...");
                    ContentSource aiSource =
                            aiContentGenerator.generateDraft(req.getRawInput(), null);
                    contentSourceJson = toJson(aiSource);
                    System.out.println("AI content generated successfully");
                } catch (Exception e) {
                    System.err.println("AI generation failed: " + e.getMessage());
                    System.err.println("Falling back to mock content");
                    contentSourceJson =
                            createMockContentSource(req.getTitle(), req.getRawInput());
                }
            } else {
                System.err.println("AIContentGenerator not available, using mock content");
                contentSourceJson =
                        createMockContentSource(req.getTitle(), req.getRawInput());
            }

        } else {
            // ===== MANUAL MODE =====
            if (req.getContentSource() == null || req.getContentSource().isBlank()) {
                throw new RuntimeException("contentSource is required when useAI is false");
            }
            contentSourceJson = req.getContentSource();
        }

        ContentSource source = parseSource(contentSourceJson);
        contentValidator.validate(source);

        String html = htmlRenderer.render(source);

        BlogPost post = new BlogPost();
        post.setTitle(req.getTitle());
        post.setSlug(req.getSlug());
        post.setContentSource(contentSourceJson);
        post.setContentHtml(html);
        post.setThumbnailUrl(req.getThumbnailUrl());
        post.setStatus(BlogStatus.DRAFT);

        return blogRepository.save(post);
    }

    // ================= UPDATE =================

    @Override
    public BlogPost updatePost(Long id, UpdateBlogRequest req) {

        return blogRepository.findById(id)
                .map(post -> {

                    ContentSource source = parseSource(req.getContentSource());
                    contentValidator.validate(source);

                    String html = htmlRenderer.render(source);

                    post.setTitle(req.getTitle());
                    post.setSlug(req.getSlug());
                    post.setContentSource(req.getContentSource());
                    post.setContentHtml(html);
                    post.setThumbnailUrl(req.getThumbnailUrl());

                    return blogRepository.save(post);
                })
                .orElseThrow(() -> new RuntimeException("Post not found"));
    }

    // ================= UPDATE FROM HTML =================

    @Override
    public BlogPost updateFromHtml(Long id, String html) {

        User admin = getCurrentAdmin();

        ContentSource source = htmlParser.parse(html);
        contentValidator.validate(source);

        BlogPost post = blogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        post.setContentSource(toJson(source));
        post.setContentHtml(htmlRenderer.render(source));

        return blogRepository.save(post);
    }

    // ================= STATUS =================

    @Override
    public BlogPost updateStatus(Long id, BlogStatus status) {
        return blogRepository.findById(id)
                .map(post -> {
                    post.setStatus(status);
                    return blogRepository.save(post);
                })
                .orElseThrow(() -> new RuntimeException("Post not found"));
    }

    // ================= DELETE =================

    @Override
    public void deletePost(Long id) {
        blogRepository.deleteById(id);
    }

    // ================= THUMBNAIL =================

    @Override
    public BlogPost updateThumbnail(Long id, String thumbnailUrl) {
        return blogRepository.findById(id)
                .map(post -> {
                    post.setThumbnailUrl(thumbnailUrl);
                    return blogRepository.save(post);
                })
                .orElseThrow(() -> new RuntimeException("Post not found"));
    }

    // ================= HELPERS =================

    private User getCurrentAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();

        User user = userService.getUserById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != Role.ROLE_ADMIN) {
            throw new RuntimeException("Admin only");
        }
        return user;
    }

    private ContentSource parseSource(String json) {
        try {
            return objectMapper.readValue(json, ContentSource.class);
        } catch (Exception e) {
            throw new RuntimeException("Invalid contentSource JSON: " + e.getMessage());
        }
    }

    private String toJson(ContentSource source) {
        try {
            return objectMapper.writeValueAsString(source);
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize contentSource: " + e.getMessage());
        }
    }

    // ================= MOCK =================
    private String createMockContentSource(String title, String rawInput) {

        ContentSource source = new ContentSource();
        List<ContentSource.ContentBlock> blocks = new ArrayList<>();

        ContentSource.ContentBlock h1 = new ContentSource.ContentBlock();
        h1.setType("heading");
        h1.setLevel("h1");
        h1.setContent(title);
        blocks.add(h1);

        ContentSource.ContentBlock intro = new ContentSource.ContentBlock();
        intro.setType("paragraph");
        intro.setContent("Bài viết được tạo tự động dựa trên yêu cầu: " + rawInput);
        blocks.add(intro);

        ContentSource.ContentBlock h2 = new ContentSource.ContentBlock();
        h2.setType("heading");
        h2.setLevel("h2");
        h2.setContent("Nội dung chính");
        blocks.add(h2);

        ContentSource.ContentBlock content = new ContentSource.ContentBlock();
        content.setType("paragraph");
        content.setContent("Đây là nội dung mock. AI hiện không khả dụng.");
        blocks.add(content);

        ContentSource.ContentBlock note = new ContentSource.ContentBlock();
        note.setType("quote");
        note.setContent("Lưu ý: AI đang tắt hoặc lỗi quota.");
        blocks.add(note);

        source.setBlocks(blocks);
        return toJson(source);
    }

}
