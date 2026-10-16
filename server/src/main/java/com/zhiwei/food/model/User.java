package com.zhiwei.food.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 用户。balance 单位为“分”，与前端 mockUser 一致。
 */
@Data
@NoArgsConstructor
@Entity
@Table(name = "app_user")
public class User {
    @Id
    private String id;
    private String username;
    private String phone;
    /** 不对外输出。 */
    @JsonIgnore
    private String passwordHash;
    private String avatar;
    private int balance;
    private int points;
    private int giftAmount;
}
