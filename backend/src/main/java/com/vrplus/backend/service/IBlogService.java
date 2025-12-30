package com.vrplus.backend.service;

import com.vrplus.backend.model.BlogPost;

import java.util.List;
import java.util.Optional;

public interface IBlogService {
    List<BlogPost> getAllPosts();
    Optional<BlogPost> getPostBySlug(String slug);
    Optional<BlogPost> getPostById(Long id);
    BlogPost createPost(BlogPost blogPost);
    BlogPost updatePost(Long id, BlogPost blogPostDetails);
    void deletePost(Long id);

    BlogPost updateThumbnail(Long id, String fileUrl);
}
