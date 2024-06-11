package com.example.bookshop.repository;

import com.example.bookshop.domain.ImageProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ImageProductRepository extends JpaRepository<ImageProduct, Long> {
    String db = "book_shop";
    Optional<ImageProduct> findByName(String fileName);
    @Query(value = "select image_product.* from " + db + ".image_product , " + db + ".product  where image_product.product_id = product.id and product.slug like concat(:slug) ", nativeQuery = true)
    Optional<ImageProduct> findByProduct(@Param("slug") String slug);
}