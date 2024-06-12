package com.example.bookshop.dto;

import lombok.Data;

import java.time.Instant;


@Data
public class CartDto {
    private Long id;
    private UserDto user;
    private Long userId;
    private Integer status;
    //    private String firstName;
//    private String lastName;
//    private String mobile;
//    private String email;
    private String line1;
    private String city;
    private String country;
    private Instant createdAt;
    private Instant updatedAt;
    private String content;
}