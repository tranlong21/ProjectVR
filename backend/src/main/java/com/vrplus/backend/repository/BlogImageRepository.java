package com.vrplus.backend.repository;

import com.vrplus.backend.model.BlogImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogImageRepository extends JpaRepository<BlogImage, Long> {
    List<BlogImage> findAllByOrderByCreatedAtDesc();
}
