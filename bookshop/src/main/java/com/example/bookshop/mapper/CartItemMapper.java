package com.example.bookshop.mapper;

import com.example.bookshop.domain.CartItem;
import com.example.bookshop.dto.CartItemDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class CartItemMapper implements EntityMapper<CartItemDto, CartItem> {
    @Autowired
    ProductMapper productMapper;
    @Autowired
    CartMapper cartMapper;

    @Override
    public CartItemDto toDo(CartItem entity) {
        CartItemDto dto = new CartItemDto();
        dto.setId(entity.getId());
        dto.setProduct(productMapper.toDo(entity.getProduct()));
        dto.setCart(cartMapper.toDo(entity.getCart()));
        dto.setPrice(entity.getPrice());
        dto.setDiscount(entity.getDiscount());
        dto.setQuantity(entity.getQuantity());
        dto.setActive(entity.getActive());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        dto.setContent(entity.getContent());
        return dto;
    }

    @Override
    public CartItem toEntity(CartItemDto dto) {
        CartItem entity = new CartItem();
        entity.setId(dto.getId());

        entity.setPrice(dto.getPrice());
        entity.setDiscount(dto.getDiscount());
        entity.setQuantity(dto.getQuantity());
        entity.setCreatedAt(dto.getCreatedAt());
//        entity.setUpdatedAt(dto.getUpdatedAt());
        entity.setContent(dto.getContent());
        return entity;
    }

    @Override
    public List<CartItemDto> toDo(List<CartItem> e) {
        List<CartItemDto> dtos = new ArrayList<>();
        e.forEach(cartItem -> {
            CartItemDto dto = toDo(cartItem);
            dtos.add(dto);
        });
        return dtos;
    }

    @Override
    public List<CartItem> toEntity(List<CartItemDto> d) {
        return null;
    }
}
