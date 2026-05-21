package com.nikitarybalko.food_delivery.catalog.service;

import com.nikitarybalko.food_delivery.catalog.dto.PromotionDTO;
import com.nikitarybalko.food_delivery.catalog.mapper.PromotionMapper;
import com.nikitarybalko.food_delivery.catalog.model.Promotion;
import com.nikitarybalko.food_delivery.catalog.repository.PromotionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PromotionService {

    private final PromotionRepository promotionRepository;
    private final PromotionMapper promotionMapper;

    @Transactional(readOnly = true)
    public List<PromotionDTO> getActivePromotions() {
        return promotionRepository.findActivePromotions(LocalDateTime.now())
                .stream()
                .map(promotionMapper::toPromotionDTO)
                .toList();
    }
}