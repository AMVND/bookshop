package com.example.bookshop.mapper;
import com.example.bookshop.domain.ProductCategory;
import com.example.bookshop.dto.ProductCategoryDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;


@Component
public class ProductCategoryMapper implements EntityMapper<ProductCategoryDto, ProductCategory>{
    @Autowired
    ProductMapper productMapper;
    @Autowired
    CategoryMapper categoryMapper;

    @Override
    public ProductCategoryDto toDo(ProductCategory entity) {
        ProductCategoryDto dto = new ProductCategoryDto();
        dto.setId(entity.getId());
        dto.setProduct(productMapper.toDo(entity.getProduct()));
        dto.setCategory(categoryMapper.toDo(entity.getCategory()));
        return dto;
    }

    @Override
    public ProductCategory toEntity(ProductCategoryDto dto) {
        ProductCategory entity = new ProductCategory();
        entity.setId(dto.getId());
        entity.setProduct(productMapper.toEntity(dto.getProduct()));
        entity.setCategory(categoryMapper.toEntity(dto.getCategory()));
        return entity;
    }

    @Override
    public List<ProductCategoryDto> toDo(List<ProductCategory> e) {
        List<ProductCategoryDto> dtos = new ArrayList<>();
        e.forEach(productCategory -> {
            ProductCategoryDto dto = toDo(productCategory);
            dtos.add(dto);
        });
        return dtos;
    }

    @Override
    public List<ProductCategory> toEntity(List<ProductCategoryDto> d) {
        return null;
    }
}