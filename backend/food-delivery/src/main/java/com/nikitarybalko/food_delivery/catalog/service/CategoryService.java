package com.nikitarybalko.food_delivery.catalog.service;

import com.nikitarybalko.food_delivery.catalog.model.Dish;
import com.nikitarybalko.food_delivery.catalog.repository.DishRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.nikitarybalko.food_delivery.catalog.model.Category;
import com.nikitarybalko.food_delivery.catalog.repository.CategoryRepository;
import com.nikitarybalko.food_delivery.catalog.dto.CategoryAddRequest;
import com.nikitarybalko.food_delivery.catalog.dto.CategoryEditRequest;
import com.nikitarybalko.food_delivery.catalog.dto.CategoryResponse;
import com.nikitarybalko.food_delivery.catalog.mapper.CategoryMapper;
import com.nikitarybalko.food_delivery.shared.exception.ResourceNotFoundException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final DishRepository dishRepository;

    public List<CategoryResponse> getRootCategories(Integer limit) {

        Pageable pageable = (limit != null && limit > 0)
                ? PageRequest.of(0, limit)
                : Pageable.unpaged();

        List<Category> categories = categoryRepository
                .findByParentIsNullOrderBySortOrderAsc(pageable);

        return categoryMapper.toResponseList(categories);
    }

    public List<CategoryResponse> getCategoriesByRestaurant(Long restaurantId) {
        return categoryRepository.findCategoriesByRestaurantId(restaurantId)
                .stream()
                .map(categoryMapper::toResponse)
                .toList();
    }

    @Transactional
    public CategoryResponse addCategory(CategoryAddRequest request) {
        Category category = categoryMapper.toEntity(request);
        Category savedCategory = categoryRepository.save(category);
        return categoryMapper.toResponse(savedCategory);
    }

    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryEditRequest request) {
        log.info("Updating category with id: {}", id);
        Category existingCategory = getCategoryById(id);

        Category parentCategory = null;
        if (request.parentId() != null) {
            parentCategory = getCategoryById(request.parentId());
        }

        existingCategory.setName(request.name());
        existingCategory.setImagePath(request.imagePath());
        existingCategory.setSortOrder(request.sortOrder());
        existingCategory.setParent(parentCategory);

        Category savedCategory = categoryRepository.save(existingCategory);
        return categoryMapper.toResponse(savedCategory);
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = getCategoryById(id);

        List<Dish> dishes = dishRepository.findAllByCategoriesId(id);

        if (!dishes.isEmpty()) {
            dishRepository.deleteAll(dishes);
        }

        categoryRepository.delete(category);
    }

    private Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + id));
    }
}
