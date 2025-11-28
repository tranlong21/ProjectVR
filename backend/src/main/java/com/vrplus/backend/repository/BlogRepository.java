package com.vrplus.backend.repository;

import com.vrplus.backend.model.BlogPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BlogRepository extends JpaRepository<BlogPost, Long> {
    Optional<BlogPost> findBySlug(String slug);

    Boolean existsBySlug(String slug);
}
