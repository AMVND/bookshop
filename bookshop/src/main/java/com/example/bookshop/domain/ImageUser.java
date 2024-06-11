package com.example.bookshop.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "image_user")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ImageUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;
    private String name;
    private String type;
    @Lob
    @Column(name = "imagedata", columnDefinition = "MEDIUMBLOB", length = 1000)
    private byte[] imageData;
}
