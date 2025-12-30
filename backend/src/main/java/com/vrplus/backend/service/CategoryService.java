package com.vrplus.backend.service;

import com.vrplus.backend.model.Category;
import com.vrplus.backend.repository.CategoryRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class CategoryService implements ICategoryService{

    private final CategoryRepository categoryRepository;
    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
}
