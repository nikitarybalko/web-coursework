package org.nikitarybalko.food_delivery.catalog.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.nikitarybalko.food_delivery.catalog.dto.CategoryAddRequest;
import org.nikitarybalko.food_delivery.catalog.dto.CategoryResponse;
import org.nikitarybalko.food_delivery.catalog.model.Category;

import java.util.List;
import java.util.stream.Collectors;

@Mapper
public interface CategoryMapper {

    @Mapping(target = "children", qualifiedByName = "filterAndMapChildren")
    CategoryResponse toResponse(Category category);

    List<CategoryResponse> toResponseList(List<Category> categories);

    @Named("filterAndMapChildren")
    default List<CategoryResponse> filterAndMapChildren(List<Category> children) {
        if (children == null) {
            return List.of();
        }
        return children.stream()
                .map(this::toResponse)
                .toList();
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "children", ignore = true)
    @Mapping(target = "parent", source = "parentId", qualifiedByName = "idToCategoryReference")
    Category toEntity(CategoryAddRequest request);

    @Named("idToCategoryReference")
    default Category idToCategoryReference(Long parentId) {
        if (parentId == null) {
            return null;
        }
        Category parent = new Category();
        parent.setId(parentId);
        return parent;
    }
}
