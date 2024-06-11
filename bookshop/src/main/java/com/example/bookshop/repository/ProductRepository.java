package com.example.bookshop.repository;

import com.example.bookshop.config.Config;
import com.example.bookshop.domain.Product;
import com.example.bookshop.projection.ProductInfo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {

    String db = "book_shop";

    @Query(value = "SELECT t.* " +
            "FROM " + db + ".product t " +
            "WHERE id like concat('%',:keySearch, '%') " +
            "or user_id like concat('%', :keySearch, '%')" +
            "or title like concat('%', :keySearch, '%')" +
            "or author like concat('%', :keySearch, '%')"
            , nativeQuery = true)
    List<Product> filter(@Param("keySearch") String keySearch);

    // find by sulg
    Optional<Product> findBySlug(String slug);

    @Query(value = "SELECT t.* FROM " + db + ".product t " +
            "        WHERE user_id = :users and title like concat('%', :title ,'%')", nativeQuery = true)
    List<Product> findByUsers(@Param("users") Long users, @Param("title") String title);

    // todo: findAllProductPage - lọc sản phẩm hiện thị trên trang chủ bán hàng
    @Query(value = "select " + db + ".product.* " +
            " from " + db + ".product , " + db + ".user , " + db + ".product_category " +
            " where " +
            " " + db + ".product.user_id = " + db + ".user.id " +
            " and " + db + ".product.id = " + db + ".product_category.product_id " +
            " and product_category.category_id = :categoryId " +
            " and product.title like concat('%', :title , '%') " +
            " and product.status = 1 " +
            " and user.vendor = 1 ", nativeQuery = true)
    Page<Product> findAllProductPage(Pageable pageable, String title, String categoryId);

    @Query(value = "select " + db + ".product.* " +
            " from " + db + ".product , " + db + ".user , " + db + ".product_category " +
            " where " +
            " " + db + ".product.user_id = " + db + ".user.id " +
            " and " + db + ".product.id = " + db + ".product_category.product_id " +
            " and product.title like concat('%', :title , '%') " +
            " and product.status = 1 " +
            " and user.vendor = 1 ", nativeQuery = true)
    Page<Product> findAllProductPage1(Pageable pageable, String title);

    // todo: filterUsersProducts - lọc tất cả các product của user đang đăng nhập ở dạng page
    @Query(value = "select " + db + ".product.* " +
            " from " + db + ".product , " + db + ".product_category " +
            " where " +
            " " + db + ".product.id = " + db + ".product_category.product_id and " +
            " user_id = :userId and " +
            " product_category.category_id = :categoryId and" +
            " title like concat('%', :title , '%') and " +
            " status like concat('%', :status , '%') "
            , nativeQuery = true)
    Page<Product> filterUsersProducts(String title, Pageable pageable, String userId, String categoryId, String status);

    @Query(value = "select * from " + db + ".product  where " +
            " user_id = :userId and " +
            " title like concat('%', :title , '%') and " +
            " status like concat('%', :status , '%') "
            , nativeQuery = true)
    Page<Product> filterUsersProducts1(String title, Pageable pageable, String userId, String status);

    // todo: filterAllProducts - lọc tất cả các product ở dạng page
    @Query(value = "select " + db + ".product.* from " + db + ".product , " + db + ".user, " + db + ".product_category where " +
            " product.user_id = user.id and " +
            " product.id = product_category.product_id and " +
            " product.title like concat('%', :ptitle, '%') and " +
            " product_category.category_id = :ctitle and " +
            " concat(user.first_name, ' ' , user.last_name) like concat('%', :username,'%') and " +
            " user.vendor like concat('%', :vendor,'%') and " +
            " product.status like concat('%', :status, '%')"
            , nativeQuery = true)
    Page<Product> filterAllProducts(Pageable pageable, String username, String ptitle, String ctitle, String status, String vendor);

    @Query(value = "select " + db + ".product.* from " + db + ".product , " + db + ".user, " + db + ".product_category where " +
            " product.user_id = user.id and " +
            " product.id = product_category.product_id and " +
            " product.title like concat('%', :ptitle, '%') and " +
            " concat(user.first_name, ' ' , user.last_name) like concat('%', :username,'%') and " +
            " user.vendor like concat('%', :vendor,'%') and " +
            " product.status like concat('%', :status, '%')"
            , nativeQuery = true)
    Page<Product> filterAllProducts1(Pageable pageable, String username, String ptitle, String status, String vendor);

    @Query(value = "select p.* from " + db + ".product p where slug = :slug", nativeQuery = true)
    Product findProductBySlug(@Param("slug") String Slug);

    // Hiển thị tất cả các product có status =1 : trạng thái được hiển thị trên "+db+
    @Query(value = "select p.* from " + db + ".product p where status = 1", nativeQuery = true)
    List<Product> findProductByStatus();

    // todo: Lastest Product
    @Query(value = "select  p.* from " + db + ".product p " +
            " join " + db + ".product_category pc on p.id = pc.product_id " +
            " join " + db + ".category c on c.id = pc.category_id " +
            " join " + db + ".user u on p.user_id = u.id  " +
            " where p.status = 1 and u.vendor = 1 and c.slug like concat('%',:field,'%') " +
            " order by updated_at DESC " +
            " limit 8", nativeQuery = true)
    List<Product> lastestProduct(@Param("field") String field);

    @Query(value = "DELETE  " + db + ".image_product, " + db + ".product_category, " + db + ".product " +
            "FROM " + db + ".product " +
            "LEFT JOIN " + db + ".product_category ON product.id = product_category.product_id " +
            "LEFT JOIN " + db + ".image_product ON product.id = image_product.product_id " +
            "WHERE product.id = :id ", nativeQuery = true)
    Product deleteProductById(@Param("id") String id);

    @Query(value = "SELECT p.id     as id, " +
            "       p.title         as title, " +
            "       p.slug          as slug, " +
            "       p.discount      as discount, " +
            "       p.quantity      as quantity, " +
            "       p.price         as price, " +
            "       p.photos        as photos, " +
            "       p.status        as status, " +
            "       DATE(p.createdAt)     as createdAt, " +
            "       DATE(p.updatedAt)     as updatedAt, " +
            "       COUNT(oi.id)    as count " +
            " FROM Product p" +
            "         INNER JOIN OrderItem oi ON oi.product.id = p.id " +
            "         INNER JOIN Order o ON o.id = oi.order.id " +
            " WHERE o.status = 1 " +
            " AND  DATE(o.updatedAt) BETWEEN :time1 AND :time2 "+
            " AND  p.title like concat('%', :title,'%')"+
            " GROUP BY p.id, p.title "
//           + " ORDER BY count DESC "
    )
    Page<ProductInfo> findBestSellingProduct(Pageable pageable, String title, LocalDate time1, LocalDate time2);

    @Query(value = "select p.* from " + db + ".product p " +
            " INNER JOIN " + db + ".product_category pc ON p.id = pc.product_id " +
            " INNER JOIN " + db + ".category c ON pc.category_id = c.id " +
            " INNER JOIN " + db + ".user u ON p.user_id = u.id " +
            " WHERE (" +
            "   SELECT COUNT(*) FROM " + db + ".product_category pc2 " +
            "   WHERE pc2.category_id = c.id " +
            "       AND pc2.product_id <= p.id" +
            " ) <= 8  and p.status = 1  and u.vendor = 1 " +
            " ORDER BY c.id, p.id"
            , nativeQuery = true)
    List<Product> filterProductByCategory();
}
