package com.zhiwei.food.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

/** 收货地址。 */
@Data
@NoArgsConstructor
@Entity
@Table(name = "delivery_address")
public class Address {
    @Id
    private String id;
    private String userId;
    private String name;
    private String phone;
    private String tag;
    private String address;
    private String detail;
    private String geohash;
    /** 0-女士 1-先生 */
    private int sex;
}
