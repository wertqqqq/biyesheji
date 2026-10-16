package com.zhiwei.food.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/** 菜单分类（含该分类下的菜品列表）。 */
@Data
@NoArgsConstructor
public class MenuCategory {
    private String name;
    private String icon;
    private List<Food> foods;
}
