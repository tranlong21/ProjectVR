package com.vrplus.backend.service;

import com.vrplus.backend.model.BlogPost;
import com.vrplus.backend.model.BlogStatus;
import com.vrplus.backend.payload.request.CreateBlogRequest;
import com.vrplus.backend.payload.request.UpdateBlogRequest;

import java.util.List;
import java.util.Optional;

public interface IBlogService {

    List<BlogPost> getAllPosts();

    List<BlogPost> getPostsByStatus(BlogStatus status);

    Optional<BlogPost> getPostBySlug(String slug);

    Optional<BlogPost> getPostById(Long id);

    BlogPost createPost(CreateBlogRequest req);

    BlogPost updatePost(Long id, UpdateBlogRequest req);

    BlogPost updateFromHtml(Long id, String html);

    BlogPost updateStatus(Long id, BlogStatus status);

    void deletePost(Long id);

    BlogPost updateThumbnail(Long id, String fileUrl);
}
