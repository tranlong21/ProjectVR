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
        return blogRepository.save(blogPost);
    }

    @Override
    public BlogPost updatePost(Long id, BlogPost blogPostDetails) {
        return blogRepository.findById(id)
                .map(post -> {
                    post.setTitleVi(blogPostDetails.getTitleVi());
                    post.setTitleEn(blogPostDetails.getTitleEn());
                    post.setSlug(blogPostDetails.getSlug());
                    post.setContentVi(blogPostDetails.getContentVi());
                    post.setContentEn(blogPostDetails.getContentEn());
                    post.setThumbnailUrl(blogPostDetails.getThumbnailUrl());
                    return blogRepository.save(post);
                })
                .orElseThrow(() -> new RuntimeException("Post not found!"));
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

