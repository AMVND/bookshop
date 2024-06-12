package com.example.bookshop.mapper;

import com.example.bookshop.domain.Cart;
import com.example.bookshop.domain.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CartMapOrderMapper implements EntityMapper<Cart, Order> {

    @Autowired
    private CartItemMapOrderItemMapper orderItemMapper;

    @Override
    public Cart toDo(Order order) {
        return null;
    }

    @Override
    public Order toEntity(Cart cart) {
        Order order = new Order();
        order.setUser(cart.getUser());
        order.setCart(cart);

        return order;
    }

    @Override
    public List<Cart> toDo(List<Order> e) {
        return null;
    }

    @Override
    public List<Order> toEntity(List<Cart> d) {
        return null;
    }
}
