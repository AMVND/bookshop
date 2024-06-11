package com.example.bookshop.dto;

import lombok.Data;

@Data
public class ProductCategoryDto  {
    private  Long id;
    private  ProductDto product;
    private  CategoryDto category;
}
