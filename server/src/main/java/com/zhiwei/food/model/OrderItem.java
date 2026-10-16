package com.zhiwei.food.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** 订单中的单个菜品明细（存于订单表的 JSON 列）。 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    private String name;
    private int quantity;
    private double price;
}
