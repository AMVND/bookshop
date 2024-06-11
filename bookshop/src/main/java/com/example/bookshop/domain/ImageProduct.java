package com.example.bookshop.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "image_product")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ImageProduct {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id")
    private Product product;
    private String name;
    private String type;
    @Lob
    @Column(name = "imagedata", columnDefinition = "MEDIUMBLOB", length = 1000)
    private byte[] imageData;
}
