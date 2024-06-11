package com.example.bookshop.repository;

import com.example.bookshop.domain.Product;
import com.example.bookshop.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;
import java.util.Optional;

@CrossOrigin("*")
@Repository
public interface UserRepository extends JpaRepository<User, String> {

    String db = "book_shop";
    // Filter by id, first_name, last_name, mobile, email
    @Query(value = "SELECT * from "+ db +".user as U " +
            "         where U.id like concat('%', :id,'%') " +
            "            and U.first_name like concat('%',:firstName,'%') " +
            "            and U.last_name like concat('%', :lastName ,'%') " +
            "            and U.mobile like concat('%', :mobile ,'%') " +
            "            and U.email like concat('%', :email ,'%') " +
            "         ORDER BY U.first_name, U.last_name ASC;", nativeQuery = true)
    List<User> filter(@Param("id") String id,
                      @Param("firstName") String firstName,
                      @Param("lastName") String lastName,
                      @Param("mobile") String mobile,
                      @Param("email") String email);

    // find by mobile
    Optional<User> findByMobile(String mobile);
    // find by email
    Optional<User> findByEmail(String email);

    // todo: findAllUsers
    @Query(value = " select * from " + db + ".user " +
            " where concat(first_name, ' ', last_name) like concat('%', :keyname, '%') " +
            " and mobile like concat('%', :mobile , '%') " +
            " and email like concat('%', :email , '%') " +
            " and role like concat('%', :role) "
            , nativeQuery = true)
    Page<User> findAllUser(Pageable pageable, String keyname, String mobile, String email, String role);

    boolean existsByEmail(String email);
}
