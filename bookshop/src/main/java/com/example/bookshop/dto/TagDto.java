package com.example.bookshop.dto;

import lombok.Data;

@Data
public class TagDto {
    private Long id;
    private String title;
    private String slug;
    private String content;
}
