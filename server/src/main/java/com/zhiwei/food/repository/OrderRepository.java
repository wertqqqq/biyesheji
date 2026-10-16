package com.zhiwei.food.repository;

import com.zhiwei.food.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, String> {
    /** 新订单在前，与前端 mock 的 unshift 行为一致。 */
    List<Order> findByUserIdOrderByCreatedAtDesc(String userId);
}
