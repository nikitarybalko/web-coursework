package com.nikitarybalko.food_delivery.order.controller;

import com.nikitarybalko.food_delivery.order.model.OrderStatus;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import com.nikitarybalko.food_delivery.order.dto.OrderCreateRequest;
import com.nikitarybalko.food_delivery.order.dto.OrderResponse;
import com.nikitarybalko.food_delivery.order.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            @Valid @RequestBody OrderCreateRequest request,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();

        OrderResponse response = orderService.createOrder(request, userEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/my")
    public ResponseEntity<List<OrderResponse>> getMyOrders(Authentication authentication) {
        String userEmail = authentication.getName();

        List<OrderResponse> response = orderService.getMyOrders(userEmail);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/restaurant")
    public ResponseEntity<List<OrderResponse>> getOrdersForRestaurant(Authentication authentication) {
        String ownerEmail = authentication.getName();
        List<OrderResponse> orders = orderService.getOrdersForOwner(ownerEmail);
        return ResponseEntity.ok(orders);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status,
            Authentication authentication
    ) {
        String ownerEmail = authentication.getName();

        OrderResponse updatedOrder = orderService.updateOrderStatus(id, status, ownerEmail);
        return ResponseEntity.ok(updatedOrder);
    }
}
