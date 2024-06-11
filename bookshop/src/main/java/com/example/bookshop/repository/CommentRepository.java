package com.example.bookshop.repository;
import com.example.bookshop.domain.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<Comment, String> {
    String db = "book_shop";
    @Query(value = " select * from "+db+".comment where product_id = :productId and parent_id is null order by created_at DESC ", nativeQuery = true)
    List<Comment> filterCommentByProduct(String productId);

    @Query(value = " select * from "+db+".comment where product_id = :productId and parent_id is not null order by created_at ASC", nativeQuery = true)
    List<Comment> filterCommentReply(Long productId);

    @Query(value = " select * from "+db+".comment where parent_id = :parentId", nativeQuery = true)
    List<Comment> findByParentId(String parentId);

}
