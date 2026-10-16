package com.zhiwei.food.model;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/** 订单。foods 以 JSON 列存储。 */
@Data
@NoArgsConstructor
@Entity
@Table(name = "food_order")
public class Order {
    @Id
    private String id;
    private String userId;
    private String shopName;
    private String shopImage;
    private String shopLogoColor;
    private String status;
    private String statusCode;
    private double total;
    private String timeAgo;
    private String address;
    private String remark;
    @Column(length = 4000)
    @Convert(converter = JsonListConverter.class)
    private List<OrderItem> foods = new ArrayList<>();
    /** 下单时间戳，用于倒序展示（新订单在前）。 */
    private long createdAt;
}
