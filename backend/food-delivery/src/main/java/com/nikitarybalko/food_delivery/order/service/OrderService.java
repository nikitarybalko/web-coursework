package org.nikitarybalko.food_delivery.order.service;

import lombok.RequiredArgsConstructor;
import org.nikitarybalko.food_delivery.catalog.model.Dish;
import org.nikitarybalko.food_delivery.catalog.model.Restaurant;
import org.nikitarybalko.food_delivery.catalog.repository.DishRepository;
import org.nikitarybalko.food_delivery.catalog.service.RestaurantService;
import org.nikitarybalko.food_delivery.order.dto.OrderCreateRequest;
import org.nikitarybalko.food_delivery.order.dto.OrderItemRequest;
import org.nikitarybalko.food_delivery.order.dto.OrderItemResponse;
import org.nikitarybalko.food_delivery.order.dto.OrderResponse;
import org.nikitarybalko.food_delivery.order.mapper.OrderMapper;
import org.nikitarybalko.food_delivery.order.model.Order;
import org.nikitarybalko.food_delivery.order.model.OrderItem;
import org.nikitarybalko.food_delivery.order.model.OrderStatus;
import org.nikitarybalko.food_delivery.order.repository.OrderRepository;
import org.nikitarybalko.food_delivery.shared.exception.ResourceNotFoundException;
import org.nikitarybalko.food_delivery.user.model.User;
import org.nikitarybalko.food_delivery.user.repository.UserRepository;
import org.nikitarybalko.food_delivery.user.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {

    private final OrderRepository orderRepository;
    private final DishRepository dishRepository;
    private final OrderMapper orderMapper;
    private final UserService userService;
    private final RestaurantService restaurantService;

    @Transactional
    public OrderResponse createOrder(OrderCreateRequest request, String userEmail) {
        User user = userService.getUserByEmail(userEmail);
        Restaurant restaurant = restaurantService.getRestaurantById(request.restaurantId());

        Order order = new Order();
        order.setUser(user);
        order.setRestaurant(restaurant);
        order.setDeliveryAddress(request.deliveryAddress());
        order.setStatus(OrderStatus.PENDING);
        order.setCreatedAt(LocalDateTime.now());

        BigDecimal totalOrderPrice = BigDecimal.ZERO;

        for (OrderItemRequest itemRequest : request.items()) {
            Dish dish = dishRepository.findById(itemRequest.dishId())
                    .orElseThrow(() -> new ResourceNotFoundException("Dish with ID " + itemRequest.dishId() + " not found"));

            if (!dish.getRestaurant().getId().equals(request.restaurantId())) {
                throw new IllegalArgumentException("Dish " + dish.getName() + " does not belong to this restaurant!");
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setDish(dish);
            orderItem.setQuantity(itemRequest.quantity());
            orderItem.setPriceAtPurchase(dish.getPrice());

            BigDecimal itemTotal = dish.getPrice().multiply(BigDecimal.valueOf(itemRequest.quantity()));
            totalOrderPrice = totalOrderPrice.add(itemTotal);

            order.getItems().add(orderItem);
        }

        order.setTotalPrice(totalOrderPrice);

        Order savedOrder = orderRepository.save(order);

        return orderMapper.toResponse(savedOrder);
    }

    public List<OrderResponse> getMyOrders(String userEmail) {
        return orderRepository.findAllByUserEmailOrderByCreatedAtDesc(userEmail)
                .stream()
                .map(orderMapper::toResponse)
                .collect(Collectors.toList());
    }
}
