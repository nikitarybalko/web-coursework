package org.nikitarybalko.food_delivery.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class CategoryResponse {
    private Long id;
    private String name;
    private String imagePath;
    private Boolean isActive;
    private Integer sortOrder;
    private List<CategoryResponse> children;
}
