package com.example.bookshop.dto;

import lombok.Data;

import java.time.Instant;

@Data
public class OrderItemDto {
    private Long id;
    private ProductDto product;

    // Biến ảo id của product
    private Long productId;
    private OrderDto order;
    // Biến ảo id của order
    private Long orderId;
    private String sku;
    private Float price;
    private Float discount;
    private Integer quantity;

    private Instant createdAt;
    private Instant updatedAt;
    private String content;
}