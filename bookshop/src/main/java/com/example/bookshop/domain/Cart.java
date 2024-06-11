package com.example.bookshop.domain;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;
import java.util.Set;

@Data
@Entity
@Table(name = "cart")
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL)
    private Set<CartItem> cartItem;

    @Column(name = "status", nullable = false)
    private Integer status;

//    @Column(name = "first_name", length = 50)
//    private String firstName;
//
//    @Column(name = "last_name", length = 50)
//    private String lastName;
//
//    @Column(name = "mobile", length = 15)
//    private String mobile;
//
//    @Column(name = "email", length = 50)
//    private String email;

    @Column(name = "line1", length = 50)
    private String line1;

    @Column(name = "city", length = 50)
    private String city;

    @Column(name = "country", length = 50)
    private String country;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @Lob
    @Column(name = "content")
    private String content;
}
