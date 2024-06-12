package com.example.bookshop.mapper;

import com.example.bookshop.domain.CartItem;
import com.example.bookshop.domain.OrderItem;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Component
public class CartItemMapOrderItemMapper implements EntityMapper<CartItem, OrderItem> {
    @Override
    public CartItem toDo(OrderItem orderItem) {
        return null;
    }

    @Override
    public OrderItem toEntity(CartItem cartItem) {
        OrderItem orderItem = new OrderItem();
        orderItem.setProduct(cartItem.getProduct());
        orderItem.setPrice(cartItem.getPrice());
        orderItem.setDiscount(cartItem.getDiscount());
        orderItem.setQuantity(cartItem.getQuantity());
        orderItem.setContent(cartItem.getContent());
        orderItem.setCreatedAt(Instant.now());
        return orderItem;
    }

    @Override
    public List<CartItem> toDo(List<OrderItem> e) {
        return null;
    }

    @Override
    public List<OrderItem> toEntity(List<CartItem> d) {
        List<OrderItem> orderItems = new ArrayList<>();
        d.forEach(cartItem -> {
            orderItems.add(toEntity(cartItem));
        });
        return orderItems;
    }
}
