package org.nikitarybalko.food_delivery.order.mapper;

import org.mapstruct.Mapper;
import org.nikitarybalko.food_delivery.order.dto.OrderResponse;
import org.nikitarybalko.food_delivery.order.model.Order;

@Mapper
public interface OrderMapper {
    OrderResponse toResponse(Order order);
}
