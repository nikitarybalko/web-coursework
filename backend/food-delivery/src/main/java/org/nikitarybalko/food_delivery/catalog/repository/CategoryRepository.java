package org.nikitarybalko.food_delivery.catalog;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByIsActiveTrueAndParentIsNullOrderBySortOrderAsc(Pageable pageable);

    List<Category> findByParentIsNullOrderBySortOrderAsc(Pageable pageable);
}
