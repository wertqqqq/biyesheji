package com.zhiwei.food.data;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zhiwei.food.model.Food;
import com.zhiwei.food.model.Shop;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 商家目录：启动时从 resources/data/shops.json 载入（数据由前端 fixtures 导出，形状完全一致）。
 * 商家属于只读参考数据，无需落库。
 */
@Service
public class ShopCatalog {

    private final List<Shop> shops;

    public ShopCatalog(@Value("classpath:data/shops.json") Resource resource) throws IOException {
        ObjectMapper om = new ObjectMapper();
        Shop[] arr = om.readValue(resource.getInputStream(), Shop[].class);
        this.shops = new ArrayList<>(Arrays.asList(arr));
    }

    public List<Shop> all() {
        return shops;
    }

    public Optional<Shop> find(String id) {
        return shops.stream().filter(s -> s.getId().equals(id)).findFirst();
    }

    public Shop require(String id) {
        return find(id).orElseThrow(() -> new com.zhiwei.food.common.BizException(404, "商家不存在"));
    }

    // ---------- 评价生成（对齐前端 fixtures.generateRatings）----------
    private static final String[] USERNAMES = {
            "小*喵", "爱吃*的兔", "匿名用*88", "干饭*王", "甜*酱",
            "月半*圆", "匿名用*12", "美食*探", "元*少女", "夜宵*党"
    };
    private static final String[] AVATARS = {
            "🐱", "🐰", "🐻", "🦊", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷"
    };
    private static final String[] REVIEW_GOOD = {
            "分量很足，味道超预期，会回购！",
            "包装严实，送到还是热乎的，好评。",
            "味道正宗，家人都很喜欢，推荐。",
            "第二次点了，依旧稳定发挥，赞。",
            "食材新鲜，处理得干净，吃得放心。",
            "配送很快，骑手态度也很好。",
            "性价比很高，这个价位很满意。",
            "颜值在线，味道也好，拍照好看。"
    };
    private static final String[] REVIEW_BAD = {
            "这次稍微咸了一点，希望改进。",
            "配送比预计慢了一会儿，其他还好。",
            "汤洒了一点，不影响味道。"
    };

    public List<Map<String, Object>> ratings(Shop shop, int count, int offset, String tagName) {
        List<Map<String, Object>> list = new ArrayList<>();
        List<Food> foods = shop.getMenu() == null
                ? new ArrayList<>()
                : shop.getMenu().stream()
                        .filter(c -> c.getFoods() != null)
                        .flatMap(c -> c.getFoods().stream())
                        .collect(Collectors.toList());

        for (int i = 0; i < count; i++) {
            int seed = offset + i;
            boolean isBad = seed % 11 == 5;
            String[] pool = isBad ? REVIEW_BAD : REVIEW_GOOD;

            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", shop.getId() + "-r" + seed);
            m.put("username", USERNAMES[seed % USERNAMES.length]);
            m.put("avatar", AVATARS[seed % AVATARS.length]);
            m.put("rating", isBad ? 3 : 5);
            m.put("text", pool[seed % pool.length]);
            m.put("timeAgo", ((seed % 30) + 1) + " 天前");

            List<String> items = new ArrayList<>();
            if (!foods.isEmpty()) {
                items.add(foods.get(seed % foods.size()).getName());
                items.add(foods.get((seed + 3) % foods.size()).getName());
            }
            m.put("orderItems", items);
            m.put("images", new ArrayList<>());
            list.add(m);
        }
        return list;
    }
}
