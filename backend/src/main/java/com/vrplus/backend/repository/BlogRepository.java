package com.vrplus.backend.repository;

import com.vrplus.backend.model.BlogPost;
import com.vrplus.backend.model.BlogStatus;
import com.vrplus.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlogRepository extends JpaRepository<BlogPost, Long> {

    Optional<BlogPost> findBySlug(String slug);

    Boolean existsBySlug(String slug);

    List<BlogPost> findByStatus(BlogStatus status);

    List<BlogPost> findByStatusOrderByCreatedAtDesc(BlogStatus status);

    List<BlogPost> findAllByOrderByCreatedAtDesc();

}
