package com.example.bookshop.mapper;
import com.example.bookshop.domain.ProductReview;
import com.example.bookshop.dto.ProductReviewDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
@Component
public class ProductReviewMapper implements EntityMapper<ProductReviewDto, ProductReview>{
    @Autowired
    ProductMapper productMapper;
    @Autowired
    UserMapper userMapper;
    @Override
    public ProductReviewDto toDo(ProductReview entity) {
        ProductReviewDto dto = new ProductReviewDto();
        dto.setId(entity.getId());
        dto.setProduct(productMapper.toDo(entity.getProduct()));
        dto.setUser(userMapper.toDo(entity.getUser()));
        dto.setTitle(entity.getTitle());
        dto.setRating(entity.getRating());
        dto.setPublished(entity.getPublished());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setPublished_at(entity.getPublished_at());
        dto.setContent(entity.getContent());
        return dto;
    }

    @Override
    public ProductReview toEntity(ProductReviewDto dto) {
        ProductReview entity = new ProductReview();
        entity.setId(dto.getId());
        entity.setTitle(dto.getTitle());
        entity.setRating(dto.getRating());
        entity.setPublished(dto.getPublished());
        entity.setCreatedAt(dto.getCreatedAt());
        entity.setPublished_at(dto.getPublished_at());
        entity.setContent(dto.getContent());
        return entity;
    }

    @Override
    public List<ProductReviewDto> toDo(List<ProductReview> e) {
        List<ProductReviewDto> dtos = new ArrayList<>();
        e.forEach(productReview -> {
            ProductReviewDto dto = toDo(productReview);
            dtos.add(dto);
        });
        return dtos;
    }

    @Override
    public List<ProductReview> toEntity(List<ProductReviewDto> d) {
        return null;
    }
}