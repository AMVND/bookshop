package com.example.bookshop.dto;

import com.example.bookshop.projection.RatingInfo;
import lombok.Data;

import java.time.Instant;

@Data
public class ProductDto {
    private Long id;
    private UserDto user;
    private Long userId;
    private String title;
    private String slug;
    private String summary;
    private Float price;
    private Float discount;
    private String photos;
    private Integer quantity;
    private Instant createdAt;
    private Instant updatedAt;
    private Instant endsAt;
    private Integer status;
    private String content;
    private String category;
    private RatingInfo rating;
}