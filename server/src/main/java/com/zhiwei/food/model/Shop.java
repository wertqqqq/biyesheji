package com.zhiwei.food.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * 商家（从 resources/data/shops.json 反序列化，语义与前端 fixtures 完全一致）。
 */
@Data
@NoArgsConstructor
public class Shop {
    private String id;
    private String name;
    private String image;
    private String logoColor;
    private String bannerColor;
    private String category;
    private double rating;
    private int ratingCount;
    private int recentOrderNum;
    private int distance;
    private double deliveryFee;
    private double minOrderAmount;
    private int leadTime;
    private Map<String, Object> deliveryMode;
    private List<Map<String, Object>> supports;
    /** 用包装类型，保证 Jackson 输出键名为 isBrand（而非 brand）。 */
    private Boolean isBrand;
    private List<Map<String, Object>> activities;
    private String announcement;
    private String address;
    private String phone;
    private Map<String, Object> piecewiseAgentFee;
    private Map<String, Object> safe;
    private List<MenuCategory> menu;
    private Map<String, Object> scores;
    private List<Map<String, Object>> tags;

    /**
     * 列表摘要：剔除 menu / announcement / safe / scores / tags。
     * 与前端 mock 的 toSummary 保持一致，避免列表页载荷过大。
     */
    public Map<String, Object> summary() {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", id);
        m.put("name", name);
        m.put("image", image);
        m.put("logoColor", logoColor);
        m.put("bannerColor", bannerColor);
        m.put("category", category);
        m.put("rating", rating);
        m.put("ratingCount", ratingCount);
        m.put("recentOrderNum", recentOrderNum);
        m.put("distance", distance);
        m.put("deliveryFee", deliveryFee);
        m.put("minOrderAmount", minOrderAmount);
        m.put("leadTime", leadTime);
        m.put("deliveryMode", deliveryMode);
        m.put("supports", supports);
        m.put("isBrand", isBrand);
        m.put("activities", activities);
        m.put("address", address);
        m.put("phone", phone);
        m.put("piecewiseAgentFee", piecewiseAgentFee);
        return m;
    }
}
