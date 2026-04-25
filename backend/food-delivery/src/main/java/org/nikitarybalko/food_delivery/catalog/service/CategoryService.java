package org.nikitarybalko.food_delivery.catalog;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.nikitarybalko.food_delivery.dto.CategoryAddRequest;
import org.nikitarybalko.food_delivery.dto.CategoryEditRequest;
import org.nikitarybalko.food_delivery.dto.CategoryResponse;
import org.nikitarybalko.food_delivery.mapper.CategoryMapper;
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

    public List<CategoryResponse> getRootCategories(Boolean onlyActive, Integer limit) {

        Pageable pageable = (limit != null && limit > 0)
                ? PageRequest.of(0, limit)
                : Pageable.unpaged();

        List<Category> categories;

        if (Boolean.TRUE.equals(onlyActive)) {
            categories = categoryRepository.findByIsActiveTrueAndParentIsNullOrderBySortOrderAsc(pageable);
        } else {
            categories = categoryRepository.findByParentIsNullOrderBySortOrderAsc(pageable);
        }

        return categoryMapper.toResponseList(categories);
    }

    @Transactional
    public CategoryResponse addCategory(CategoryAddRequest request) {
        Category category = categoryMapper.toEntity(request);
        if(category.getIsActive() == null) {
            category.setIsActive(true);
            log.info("Category's {} isActive state is not set. Setting it to 'true'", category.getName());
        }
        Category savedCategory = categoryRepository.save(category);
        return categoryMapper.toResponse(savedCategory);
    }

    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryEditRequest request) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));

        existingCategory.setName(request.name());
        existingCategory.setSortOrder(request.sortOrder());
        existingCategory.setIsActive(request.isActive());

        Category savedCategory = categoryRepository.save(existingCategory);
        return categoryMapper.toResponse(savedCategory);
    }

    @Transactional
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
}
