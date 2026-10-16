package com.zhiwei.food.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/** 菜品。 */
@Data
@NoArgsConstructor
public class Food {
    private String id;
    private String name;
    private String description;
    private double price;
    /** 前端用 emoji 作为占位图。 */
    private String image;
    private int monthSales;
    private int rating;
    private int satisfyRate;
    private List<Map<String, Object>> specs;
}
