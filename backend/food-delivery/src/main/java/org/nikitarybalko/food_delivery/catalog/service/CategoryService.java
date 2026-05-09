package org.nikitarybalko.food_delivery.catalog.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.nikitarybalko.food_delivery.catalog.model.Category;
import org.nikitarybalko.food_delivery.catalog.repository.CategoryRepository;
import org.nikitarybalko.food_delivery.catalog.dto.CategoryAddRequest;
import org.nikitarybalko.food_delivery.catalog.dto.CategoryEditRequest;
import org.nikitarybalko.food_delivery.catalog.dto.CategoryResponse;
import org.nikitarybalko.food_delivery.catalog.mapper.CategoryMapper;
import org.nikitarybalko.food_delivery.shared.exception.ResourceNotFoundException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public List<CategoryResponse> getRootCategories(Integer limit) {

        Pageable pageable = (limit != null && limit > 0)
                ? PageRequest.of(0, limit)
                : Pageable.unpaged();

        List<Category> categories = categoryRepository
                .findByParentIsNullOrderBySortOrderAsc(pageable);

        return categoryMapper.toResponseList(categories);
    }

    @Transactional
    public CategoryResponse addCategory(CategoryAddRequest request) {
        Category category = categoryMapper.toEntity(request);
        Category savedCategory = categoryRepository.save(category);
        return categoryMapper.toResponse(savedCategory);
    }

    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryEditRequest request) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + id));

        Category parentCategory = categoryRepository.findById(request.parentId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + request.parentId()));

        existingCategory.setName(request.name());
        existingCategory.setImagePath(request.imagePath());
        existingCategory.setSortOrder(request.sortOrder());
        existingCategory.setParent(parentCategory);

        Category savedCategory = categoryRepository.save(existingCategory);
        return categoryMapper.toResponse(savedCategory);
    }

    @Transactional
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
}
