package com.example.bookshop.mapper;
import com.example.bookshop.domain.Product;
import com.example.bookshop.dto.ProductDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
@Component
public class ProductMapper implements EntityMapper<ProductDto, Product>{

    @Autowired
    UserMapper userMapper;
    @Override
    public ProductDto toDo(Product entity) {
        ProductDto dto = new ProductDto();
        dto.setId(entity.getId());
        dto.setUser(userMapper.toDo(entity.getUser()));
        dto.setTitle(entity.getTitle());
        dto.setSlug(entity.getSlug());
        dto.setPhotos((entity.getPhotos()));
        dto.setAuthor(entity.getAuthor());
        dto.setPrice(entity.getPrice());
        dto.setDiscount(entity.getDiscount());
        dto.setQuantity(entity.getQuantity());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        dto.setEndsAt(entity.getEndsAt());
        dto.setStatus(entity.getStatus());
        dto.setDetails(entity.getDetails());
        return dto;
    }

    @Override
    public Product toEntity(ProductDto dto) {
        Product entity = new Product();
        entity.setId(dto.getId());
//        entity.setUsers(userMapper.toEntity(dto.getUsers()));
        entity.setTitle(dto.getTitle());
        entity.setSlug(dto.getSlug());
        entity.setPhotos(dto.getPhotos());
        entity.setAuthor(dto.getAuthor());
        entity.setPrice(dto.getPrice());
        entity.setDiscount(dto.getDiscount());
        entity.setQuantity(dto.getQuantity());
        entity.setCreatedAt(dto.getCreatedAt());
        entity.setUpdatedAt(dto.getUpdatedAt());
        entity.setEndsAt(dto.getEndsAt());
        entity.setStatus(dto.getStatus());
        entity.setDetails(dto.getDetails());
        return entity;
    }

    @Override
    public List<ProductDto> toDo(List<Product> e) {
        List<ProductDto> dtos = new ArrayList<>();
        e.forEach(product -> {
            ProductDto dto = toDo(product);
            dtos.add(dto);
        });
        return dtos;
    }

    @Override
    public List<Product> toEntity(List<ProductDto> d) {
        return null;
    }

}
