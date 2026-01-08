package com.vrplus.backend.service;

import com.vrplus.backend.model.Category;
import com.vrplus.backend.repository.CategoryRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

@Service
@AllArgsConstructor
public class CategoryService implements ICategoryService {

    private final CategoryRepository categoryRepository;
    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
    }

    @Override
    public Category createCategory(Category category) {
        validateCategory(category);

        String slug = generateSlug(category.getNameEn());
        if (categoryRepository.existsBySlug(slug)) {
            throw new RuntimeException("Slug already exists: " + slug);
        }
        category.setSlug(slug);

        return categoryRepository.save(category);
    }

    @Override
    public Category updateCategory(Long id, Category categoryDetails) {
        Category category = getCategoryById(id);
        validateCategory(categoryDetails);

        category.setNameVi(categoryDetails.getNameVi());
        category.setNameEn(categoryDetails.getNameEn());

        String slug = generateSlug(categoryDetails.getNameEn());
        if (categoryRepository.existsBySlugAndIdNot(slug, id)) {
            throw new RuntimeException("Slug already exists: " + slug);
        }
        category.setSlug(slug);

        return categoryRepository.save(category);
    }

    @Override
    public void deleteCategory(Long id) {
        Category category = getCategoryById(id);
        // Check if projects exist? Not requested but good practice.
        // For now, simple delete as requested.
        categoryRepository.delete(category);
    }

    private void validateCategory(Category category) {
        if (category.getNameVi() == null || category.getNameVi().trim().isEmpty()) {
            throw new RuntimeException("Name VI is required");
        }
        if (category.getNameEn() == null || category.getNameEn().trim().isEmpty()) {
            throw new RuntimeException("Name EN is required");
        }
    }

    private String generateSlug(String input) {
        if (input == null)
            throw new IllegalArgumentException("Input cannot be null");

        String nowhitespace = WHITESPACE.matcher(input).replaceAll("-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = NONLATIN.matcher(normalized).replaceAll("");
        return slug.toLowerCase(Locale.ENGLISH);
    }
}
