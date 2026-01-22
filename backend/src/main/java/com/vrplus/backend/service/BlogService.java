package com.vrplus.backend.service;

import com.vrplus.backend.model.BlogPost;
import com.vrplus.backend.repository.BlogRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class BlogService implements IBlogService {

    private final BlogRepository blogRepository;
    private final TranslationService translationService;

    public BlogService(BlogRepository blogRepository,
                       TranslationService translationService) {
        this.blogRepository = blogRepository;
        this.translationService = translationService;
    }

    // ===============================
    // READ
    // ===============================

    @Override
    public List<BlogPost> getAllPosts() {
        return blogRepository.findAll();
    }

    @Override
    public Optional<BlogPost> getPostBySlug(String slug) {
        return blogRepository.findBySlug(slug);
    }

    @Override
    public Optional<BlogPost> getPostById(Long id) {
        return blogRepository.findById(id);
    }

    // ===============================
    // CREATE
    // ===============================

    @Override
    public BlogPost createPost(BlogPost blogPost) {

        if (blogRepository.existsBySlug(blogPost.getSlug())) {
            throw new RuntimeException("Slug already exists!");
        }

        performTranslation(blogPost);

        return blogRepository.save(blogPost);
    }

    // ===============================
    // UPDATE
    // ===============================

    @Override
    public BlogPost updatePost(Long id, BlogPost blogPostDetails) {

        return blogRepository.findById(id)
                .map(post -> {

                    boolean needTranslate = false;

                    if (!Objects.equals(post.getTitleVi(), blogPostDetails.getTitleVi())) {
                        post.setTitleVi(blogPostDetails.getTitleVi());
                        needTranslate = true;
                    }

                    if (!Objects.equals(post.getContentVi(), blogPostDetails.getContentVi())) {
                        post.setContentVi(blogPostDetails.getContentVi());
                        needTranslate = true;
                    }

                    if (!Objects.equals(post.getSlug(), blogPostDetails.getSlug())) {
                        if (blogRepository.existsBySlug(blogPostDetails.getSlug())) {
                            throw new RuntimeException("Slug already exists!");
                        }
                        post.setSlug(blogPostDetails.getSlug());
                    }

                    post.setThumbnailUrl(blogPostDetails.getThumbnailUrl());

                    if (needTranslate) {
                        performTranslation(post);
                    }

                    return blogRepository.save(post);
                })
                .orElseThrow(() -> new RuntimeException("Post not found!"));
    }

    // ===============================
    // DELETE
    // ===============================

    @Override
    public void deletePost(Long id) {

        if (!blogRepository.existsById(id)) {
            throw new RuntimeException("Post not found!");
        }

        blogRepository.deleteById(id);
    }

    // ===============================
    // UPDATE THUMBNAIL ONLY
    // ===============================

    @Override
    public BlogPost updateThumbnail(Long id, String thumbnailUrl) {

        return blogRepository.findById(id)
                .map(post -> {
                    post.setThumbnailUrl(thumbnailUrl);
                    return blogRepository.save(post);
                })
                .orElseThrow(() -> new RuntimeException("Post not found!"));
    }

    // ===============================
    // CORE TRANSLATION
    // ===============================

    private void performTranslation(BlogPost post) {

        if (post.getTitleVi() != null && !post.getTitleVi().isBlank()) {
            post.setTitleEn(
                    translationService.translateText(
                            post.getTitleVi(), "vi", "en"
                    )
            );
        }

        if (post.getContentVi() != null && !post.getContentVi().isBlank()) {
            post.setContentEn(
                    translationService.translateHtmlByBlock(
                            post.getContentVi(), "vi", "en"
                    )
            );
        }
    }
}
