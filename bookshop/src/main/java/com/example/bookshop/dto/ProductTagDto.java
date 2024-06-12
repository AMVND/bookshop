package com.example.bookshop.dto;

import com.example.bookshop.domain.Product;
import com.example.bookshop.domain.Tag;
import lombok.Data;

@Data
public class ProductTagDto {
    private Long id;
    private Product product;
    private Tag tag;
}