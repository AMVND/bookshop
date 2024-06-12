package com.example.bookshop.dto;

import lombok.Data;

import java.time.Instant;

@Data
public class ProductReviewDto {
    private Long id;
    private ProductDto product;
    private UserDto user;
    private String title;
    private Integer rating;
    // Nó có thể được sử dụng để xác định xem bài đánh giá có được công khai hay không.
    private Integer published;
    private Instant createdAt;
    // Nó lưu trữ ngày và giờ mà đánh giá được xuất bản.
    private Instant published_at;
    private String content;
    private String productId;
}