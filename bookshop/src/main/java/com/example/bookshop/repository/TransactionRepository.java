package com.example.bookshop.repository;

import com.example.bookshop.domain.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository

public interface TransactionRepository extends JpaRepository<Transaction, String> {
    String db = "shop";

    /*
        todo: các trạng thái của transaction:
        0 -> user - Chưa thanh toán : mới
        1 -> user - Đã thanh toán
        2 -> Thành công
        3 -> user - Huỷ
        4 -> admin - huỷ
        6 -> hoàn trả
        7 -> user - đã hoàn trả
        ...
     */
    @Query(value = "Select t.* from " + db + ".transaction t where user_id = :userId", nativeQuery = true)
    Transaction findByUserId(@Param("userId") String userId);

    // todo: findAllTransaction
    @Query(value = " select " + db + ".transaction.* from " + db + ".transaction , " + db + ".user, " + db + ".order  " +
            " where transaction.user_id = user.id and transaction.order_id = order.id " +
            " and transaction.user_id like concat('%', :userId, '%') " +
            " and transaction.order_id like concat('%', :orderId, '%') " +
            " and concat(user.first_name, ' ', user.last_name) like concat('%', :username, '%') " +
            " and user.mobile like concat('%', :mobile , '%') " +
            " and user.email like concat('%', :email , '%') " +
            " and concat(order.line1, ' ', order.city, ' ', order.country) like concat('%', :address , '%') " +
            " and order.city like concat('%', :city , '%') " +
            " and order.country like concat('%', :country , '%') " +
            " and transaction.type like concat('%', :type , '%') " +
            " and transaction.mode like concat('%', :mode , '%') " +
            " and transaction.status like concat('%', :status) "
            , nativeQuery = true)
    Page<Transaction> findAllTransaction(
            Pageable pageable,
            String userId,
            String orderId,
            String username,
            String mobile,
            String email,
            String address,
            String city,
            String country,
            String type,
            String mode,
            String status
    );

    // todo: tìm kiếm phiếu thanh toán theo id của phiếu order
    @Query(value = "select * from " + db + ".transaction where order_id = :orderId ", nativeQuery = true)
    Optional<Transaction> findByOrderId(@Param("orderId") Long orderId);
}