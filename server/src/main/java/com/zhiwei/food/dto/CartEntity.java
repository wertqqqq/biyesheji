package com.zhiwei.food.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

/** 购物车条目（结算 / 下单共用）。 */
@Data
@NoArgsConstructor
public class CartEntity {
    private String name;
    private double price;
    private int quantity;
}
