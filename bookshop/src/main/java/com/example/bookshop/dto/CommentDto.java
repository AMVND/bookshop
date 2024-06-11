package com.example.bookshop.dto;

import lombok.Data;

import java.time.Instant;

@Data
public class CommentDto {
    private Long id;
    private ProductDto product;
    private UserDto user;
    private String content;
    private Instant createdAt;
    private Long parentId;
    private String productId;
}