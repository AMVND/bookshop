package com.example.bookshop.dto;

import lombok.Data;

import java.time.Instant;

@Data
public class TransactionDto {
    private Long id;
    private UserDto user;
    private Long userId;
    private OrderDto order;
    private Long orderId;
    private String code;
    private Integer type;
    private Integer mode;
    private Integer status;
    private Instant createdAt;
    private Instant updatedAt;
    private String content;
}