package com.example.bookshop.repository;

import com.example.bookshop.domain.Category;
import com.example.bookshop.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, String> {

    String db = "shop";

    // find by slug
    Optional<Category> findBySlug(String slug);

    @Query(value = " SELECT C from Category C where C.title like concat('%', :title , '%') ")
    List<Category> filter(@Param("title") String title);

    @Query(value = " select c.* from " + db + ".category c" +
            " join " + db + ".product_category pc on c.id = pc.category_id" +
            " join " + db + ".product p on p.id = pc.product_id " +
            " where p.slug = :field "
            , nativeQuery = true)
    Optional<Category> singleProductCategory(String field);

    // todo: findAllCategory
    @Query(value = " select * from " + db + ".category " +
            " where title like concat('%', :title, '%') "
            , nativeQuery = true)
    Page<Category> findAllCategory(Pageable pageable, String title);
}