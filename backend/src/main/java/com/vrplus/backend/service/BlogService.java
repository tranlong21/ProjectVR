package com.vrplus.backend.service;

import com.vrplus.backend.model.BlogPost;
import com.vrplus.backend.repository.BlogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BlogService implements IBlogService {

    @Autowired
    private BlogRepository blogRepository;

    @Autowired
    private TranslationService translationService;

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

    @Override
    public BlogPost createPost(BlogPost blogPost) {
        if (blogRepository.existsBySlug(blogPost.getSlug())) {
            throw new RuntimeException("Slug already exists!");
        }

        // Auto-translate
        performTranslation(blogPost);

        return blogRepository.save(blogPost);
    }

    @Override
    public BlogPost updatePost(Long id, BlogPost blogPostDetails) {
        return blogRepository.findById(id)
                .map(post -> {
                    post.setTitleVi(blogPostDetails.getTitleVi());
                    post.setSlug(blogPostDetails.getSlug());
                    post.setContentVi(blogPostDetails.getContentVi());
                    post.setThumbnailUrl(blogPostDetails.getThumbnailUrl());

                    // Re-translate logic:
                    // Only re-translate if English is empty OR we just overwrite it every time
                    // content changes?
                    // User policy: "English content is NEVER manually edited... English content is
                    // auto-generated on the backend"
                    // Thus, we should ALWAYS regenerate English content when Vietnamese content
                    // changes.
                    // Or simply regenerate always on save to ensure sync.
                    performTranslation(post);

                    return blogRepository.save(post);
                })
                .orElseThrow(() -> new RuntimeException("Post not found!"));
    }

    private void performTranslation(BlogPost post) {
        if (post.getTitleVi() != null) {
            String titleEn = translationService.translateText(post.getTitleVi(), "vi", "en");
            post.setTitleEn(titleEn);
        }
        if (post.getContentVi() != null) {
            String contentEn = translationService.translateHtml(post.getContentVi(), "vi", "en");
            post.setContentEn(contentEn);
        }
    }

    @Override
    public void deletePost(Long id) {
        if (!blogRepository.existsById(id)) {
            throw new RuntimeException("Post not found!");
        }
        blogRepository.deleteById(id);
    }

    @Override
    public BlogPost updateThumbnail(Long id, String thumbnailUrl) {
        return blogRepository.findById(id)
                .map(post -> {
                    post.setThumbnailUrl(thumbnailUrl);
                    return blogRepository.save(post);
                })
                .orElseThrow(() -> new RuntimeException("Post not found!"));
    }
}
