package com.example.bookshop.repository;

import com.example.bookshop.domain.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, String> {
    String db = "book_shop";

    List<CartItem> findByCartId(Long long1);

    @Query(value = "SELECT ci.* FROM "+ db +".cart_item ci " +
            " join "+ db +".product p on ci.product_id = p.id " +
            " where p.user_id = :productUserId", nativeQuery = true)
    List<CartItem> findCartItemByProductUserId(Long productUserId);


    @Query(value = "Select ci.* from "+ db +".cart_item ci where product_id = :product and cart_id = :cart", nativeQuery = true)
    Optional<CartItem> findByProductAndCart(Long product, Long cart);
}
