package com.example.bookshop.mapper;

import com.example.bookshop.domain.Order;
import com.example.bookshop.dto.OrderDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class OrderMapper implements EntityMapper<OrderDto, Order> {
    @Autowired
    UserMapper userMapper;
    @Autowired
    CartMapper cartMapper;

    @Override
    public OrderDto toDo(Order entity) {
        OrderDto dto = new OrderDto();
        dto.setId(entity.getId());
        dto.setUser(userMapper.toDo(entity.getUser()));
        dto.setCart(cartMapper.toDo(entity.getCart()));
        dto.setStatus(entity.getStatus());
        dto.setSubTotal(entity.getSubTotal());
        dto.setItemDiscount(entity.getItemDiscount());
        dto.setTotal(entity.getTotal());
        dto.setFirstName(entity.getFirstName());
        dto.setLastName(entity.getLastName());
        dto.setMobile(entity.getMobile());
        dto.setEmail(entity.getEmail());
        dto.setLine1(entity.getLine1());
        dto.setCity(entity.getCity());
        dto.setCountry(entity.getCity());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        dto.setContent(entity.getContent());
        return dto;
    }

    @Override
    public Order toEntity(OrderDto dto) {
        Order entity = new Order();
        entity.setId(dto.getId());
        //
        entity.setStatus(dto.getStatus());
        entity.setSubTotal(dto.getSubTotal());
        entity.setItemDiscount(dto.getItemDiscount());
        entity.setTotal(dto.getTotal());
        entity.setFirstName(dto.getFirstName());
        entity.setLastName(dto.getLastName());
        entity.setMobile(dto.getMobile());
        entity.setEmail(dto.getEmail());
        entity.setLine1(dto.getLine1());
        entity.setCity(dto.getCity());
        entity.setCountry(dto.getCity());
        entity.setCreatedAt(dto.getCreatedAt());
        entity.setUpdatedAt(dto.getUpdatedAt());
        entity.setContent(dto.getContent());
        return entity;
    }

    @Override
    public List<OrderDto> toDo(List<Order> e) {
        List<OrderDto> dtos = new ArrayList<>();
        e.forEach(order -> {
            OrderDto dto = toDo(order);
            dtos.add(dto);
        });
        return dtos;
    }

    @Override
    public List<Order> toEntity(List<OrderDto> d) {
        return null;
    }
}
