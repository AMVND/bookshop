package com.example.bookshop.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;
@Data
@Entity
@Table(name = "cart_item")
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id")
    private Product product;

    @JsonIgnoreProperties(value = {"cartItem, users"})
    @ManyToOne(fetch = FetchType.LAZY, optional = false, cascade = CascadeType.ALL)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    @Column(name = "price", nullable = false)
    private Float price;

    @Column(name = "discount", nullable = false)
    private Float discount;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "active", nullable = false)
    private Boolean active = false;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @Lob
    @Column(name = "content")
    private String content;

}
