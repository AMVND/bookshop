package com.example.bookshop.repository;

import com.example.bookshop.domain.ProductCategory;
import com.example.bookshop.projection.ProductInfo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, String> {
    String db = "book_shop";

    @Query(value = "select pc from ProductCategory pc where pc.product.id = :productId ")
    Optional<ProductCategory> findByProductId(Long productId);

    //
//    @Query(value = "select " + db + ".product_category.* from " + db + ".product_category," + db + ".product, " + db + ".category " +
//            " where " + db + ".product.id = product_category.product_id " +
//            " and " + db + ".category.id = product_category.category_id " +
//            " and category.id like concat('%', :category, '%') " +
//            " and product.title like concat('%', :title , '%') " +
//            " and product.status like concat('%', :status , '%') ", nativeQuery = true)
    @Query(value = "select " + db + ".product_category.* from " + db + ".product_category," + db + ".product, " + db + ".category, "  + db + ".user " +
            " where " + db + ".product.id = product_category.product_id " +
            " and " + db + ".category.id = product_category.category_id " +
            " and " + db + ".user.id = product.user_id " +
            " and category.title like concat('%', :category, '%') " +
            " and product.title like concat('%', :title , '%') " +
            " and product.status like concat('%', :status , '%') ", nativeQuery = true)
    Page<ProductCategory> filterAllProduct(String title, Pageable pageable, String category, String status);

}
