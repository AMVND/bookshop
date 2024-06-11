package com.example.bookshop.projection;

import com.example.bookshop.domain.User;

import java.time.Instant;
import java.time.LocalDate;

public interface ProductInfo {
    String getId();
    String getTitle();
    String getSlug();
    String getDiscount();
    String getQuantity();
    String getPrice();
    String getPhotos();
    String getStatus();
    LocalDate getCreatedAt();
    LocalDate getUpdatedAt();
    String getCount();

}
