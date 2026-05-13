package com.nikitarybalko.food_delivery.order.mapper;

import com.nikitarybalko.food_delivery.order.dto.OrderItemResponse;
import com.nikitarybalko.food_delivery.order.model.OrderItem;
import org.mapstruct.Mapper;
import com.nikitarybalko.food_delivery.order.dto.OrderResponse;
import com.nikitarybalko.food_delivery.order.model.Order;
import org.mapstruct.Mapping;

@Mapper
public interface OrderMapper {

    @Mapping(source = "restaurant.id", target = "restaurantId")
    @Mapping(source = "user.email", target = "customerEmail")
    OrderResponse toResponse(Order order);

    @Mapping(source = "dish.id", target = "dishId")
    @Mapping(source = "dish.name", target = "dishName")
    OrderItemResponse toOrderItemResponse(OrderItem orderItem);
}
