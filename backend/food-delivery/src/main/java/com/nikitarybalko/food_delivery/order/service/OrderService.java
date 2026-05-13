package com.nikitarybalko.food_delivery.order.service;

import com.nikitarybalko.food_delivery.catalog.model.Dish;
import com.nikitarybalko.food_delivery.catalog.model.Restaurant;
import com.nikitarybalko.food_delivery.catalog.repository.DishRepository;
import com.nikitarybalko.food_delivery.catalog.repository.RestaurantRepository;
import com.nikitarybalko.food_delivery.catalog.service.RestaurantService;
import com.nikitarybalko.food_delivery.order.dto.OrderCreateRequest;
import com.nikitarybalko.food_delivery.order.dto.OrderItemRequest;
import com.nikitarybalko.food_delivery.order.dto.OrderResponse;
import com.nikitarybalko.food_delivery.order.mapper.OrderMapper;
import com.nikitarybalko.food_delivery.order.model.Order;
import com.nikitarybalko.food_delivery.order.model.OrderItem;
import com.nikitarybalko.food_delivery.order.model.OrderStatus;
import com.nikitarybalko.food_delivery.order.repository.OrderRepository;
import com.nikitarybalko.food_delivery.shared.exception.ResourceNotFoundException;
import com.nikitarybalko.food_delivery.user.model.User;
import com.nikitarybalko.food_delivery.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {

    private final OrderRepository orderRepository;
    private final DishRepository dishRepository;
    private final OrderMapper orderMapper;
    private final UserService userService;
    private final RestaurantService restaurantService;
    private final RestaurantRepository restaurantRepository;

    @Transactional
    public OrderResponse createOrder(OrderCreateRequest request, String userEmail) {
        User user = userService.getUserByEmail(userEmail);
        Restaurant restaurant = restaurantService.getRestaurantEntityById(request.restaurantId());

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

            order.addItem(orderItem);
        }

        order.setTotalPrice(totalOrderPrice);

        Order savedOrder = orderRepository.saveAndFlush(order);

        return orderMapper.toResponse(savedOrder);
    }

    public List<OrderResponse> getMyOrders(String userEmail) {
        return orderRepository.findAllByUserEmailOrderByCreatedAtDesc(userEmail)
                .stream()
                .map(orderMapper::toResponse)
                .toList();
    }

    public List<OrderResponse> getOrdersForOwner(String ownerEmail) {
        Restaurant restaurant = restaurantRepository.findByOwnerEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant with owner " + ownerEmail + " not found"));

        List<Order> order = orderRepository.findAllByRestaurantId(restaurant.getId());

        return order.stream()
                .map(orderMapper::toResponse)
                .toList();
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long id, OrderStatus status, String ownerEmail) {
        if(status == null) {
            throw new IllegalArgumentException("Status cannot be null");
        }
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order with id " + id + " not found"));

        if (!order.getRestaurant().getOwner().getEmail().equals(ownerEmail)) {
            throw new AccessDeniedException("У вас немає прав для зміни цього замовлення");
        }

        order.setStatus(status);
        Order savedOrder = orderRepository.saveAndFlush(order);

        return orderMapper.toResponse(savedOrder);
    }
}
