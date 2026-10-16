package com.zhiwei.food.controller;

import com.zhiwei.food.common.ApiResult;
import com.zhiwei.food.common.BizException;
import com.zhiwei.food.data.ReferenceData;
import com.zhiwei.food.data.ShopCatalog;
import com.zhiwei.food.model.Food;
import com.zhiwei.food.model.MenuCategory;
import com.zhiwei.food.model.Shop;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 商家：列表 / 筛选 / 详情 / 菜单 / 评价 / 菜品详情。
 * 路径与前端 src/api/endpoints.js 完全一致。
 */
@RestController
@RequestMapping("/shops")
public class ShopController {

    private final ShopCatalog catalog;
    private final ReferenceData ref;

    public ShopController(ShopCatalog catalog, ReferenceData ref) {
        this.catalog = catalog;
        this.ref = ref;
    }

    // ---------- 筛选选项 ----------
    @GetMapping("/categories")
    public ApiResult<Object> categories() {
        return ApiResult.ok(ref.content("foodCategories"));
    }

    @GetMapping("/delivery-modes")
    public ApiResult<Object> deliveryModes() {
        return ApiResult.ok(ref.content("deliveryModes"));
    }

    @GetMapping("/activity-attributes")
    public ApiResult<Object> activityAttributes() {
        return ApiResult.ok(ref.content("activityAttributes"));
    }

    // ---------- 搜索 ----------
    @GetMapping("/search")
    public ApiResult<List<Map<String, Object>>> search(@RequestParam(required = false) String keyword) {
        String kw = keyword == null ? "" : keyword.trim();
        List<Map<String, Object>> list = catalog.all().stream()
                .filter(s -> kw.isEmpty() || (s.getName() != null && s.getName().contains(kw)))
                .map(Shop::summary)
                .collect(Collectors.toList());
        return ApiResult.ok(list);
    }

    // ---------- 列表（分页 + 筛选 + 排序）----------
    @GetMapping
    public ApiResult<Map<String, Object>> list(@RequestParam MultiValueMap<String, String> params) {
        String keyword = first(params, "keyword");
        List<String> supportIds = params.get("support_ids[]") == null
                ? new ArrayList<>()
                : params.get("support_ids[]");
        String categoryId = first(params, "category_id");
        String deliveryMode = first(params, "delivery_mode");
        String orderBy = first(params, "order_by");
        int offset = parseInt(first(params, "offset"), 0);
        int limit = parseInt(first(params, "limit"), 20);

        List<Shop> list = new ArrayList<>(catalog.all());

        if (!keyword.isEmpty()) {
            list = list.stream()
                    .filter(s -> (s.getName() != null && s.getName().contains(keyword))
                            || (s.getCategory() != null && s.getCategory().contains(keyword)))
                    .collect(Collectors.toList());
        }
        if (supportIds.contains("1")) {
            list = list.stream()
                    .filter(s -> Boolean.TRUE.equals(s.getIsBrand()))
                    .collect(Collectors.toList());
        }
        if (categoryId != null && !categoryId.isBlank()) {
            final String cid = categoryId;
            list = list.stream()
                    .filter(s -> s.getCategory() != null && s.getCategory().contains(cid))
                    .collect(Collectors.toList());
        }
        if (deliveryMode != null && !deliveryMode.isBlank()) {
            list = list.stream().filter(s -> s.getLeadTime() <= 30).collect(Collectors.toList());
        }

        if ("rating".equals(orderBy)) {
            list.sort(Comparator.comparingDouble(Shop::getRating).reversed());
        } else if ("sales".equals(orderBy)) {
            list.sort(Comparator.comparingInt(Shop::getRecentOrderNum).reversed());
        } else if ("distance".equals(orderBy)) {
            list.sort(Comparator.comparingInt(Shop::getDistance));
        }

        int total = list.size();
        int from = Math.min(offset, total);
        int to = Math.min(offset + limit, total);

        List<Map<String, Object>> page = list.subList(from, to).stream()
                .map(Shop::summary)
                .collect(Collectors.toList());

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("list", page);
        res.put("hasMore", offset + limit < total);
        res.put("offset", offset);
        res.put("total", total);
        return ApiResult.ok(res);
    }

    // ---------- 详情 / 菜单 ----------
    @GetMapping("/{id}")
    public ApiResult<Shop> detail(@PathVariable String id) {
        return ApiResult.ok(catalog.require(id));
    }

    @GetMapping("/{id}/menu")
    public ApiResult<Object> menu(@PathVariable String id) {
        return ApiResult.ok(catalog.require(id).getMenu());
    }

    // ---------- 评价 ----------
    @GetMapping("/{id}/ratings/scores")
    public ApiResult<Object> scores(@PathVariable String id) {
        return ApiResult.ok(catalog.require(id).getScores());
    }

    @GetMapping("/{id}/ratings/tags")
    public ApiResult<Object> tags(@PathVariable String id) {
        return ApiResult.ok(catalog.require(id).getTags());
    }

    @GetMapping("/{id}/ratings")
    public ApiResult<Map<String, Object>> ratings(
            @PathVariable String id,
            @RequestParam(required = false) String limit,
            @RequestParam(required = false) String offset,
            @RequestParam(name = "tag_name", required = false) String tagName) {
        Shop shop = catalog.require(id);
        int lim = parseInt(limit, 10);
        int off = parseInt(offset, 0);

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("list", catalog.ratings(shop, lim, off, tagName == null ? "" : tagName));
        res.put("hasMore", off + lim < shop.getRatingCount());
        res.put("offset", off);
        return ApiResult.ok(res);
    }

    // ---------- 菜品详情 ----------
    @GetMapping("/{shopId}/foods/{foodId}")
    public ApiResult<Map<String, Object>> foodDetail(@PathVariable String shopId, @PathVariable String foodId) {
        Shop shop = catalog.require(shopId);

        MenuCategory hitCategory = null;
        Food hitFood = null;
        if (shop.getMenu() != null) {
            for (MenuCategory c : shop.getMenu()) {
                if (c.getFoods() == null) {
                    continue;
                }
                for (Food f : c.getFoods()) {
                    if (foodId.equals(f.getId())) {
                        hitCategory = c;
                        hitFood = f;
                    }
                }
            }
        }
        if (hitFood == null) {
            throw new BizException(404, "菜品不存在");
        }

        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", hitFood.getId());
        m.put("name", hitFood.getName());
        m.put("description", hitFood.getDescription());
        m.put("price", hitFood.getPrice());
        m.put("image", hitFood.getImage());
        m.put("monthSales", hitFood.getMonthSales());
        m.put("rating", hitFood.getRating());
        m.put("satisfyRate", hitFood.getSatisfyRate());
        m.put("specs", hitFood.getSpecs());
        m.put("categoryName", hitCategory == null ? "" : hitCategory.getName());
        m.put("shopName", shop.getName());
        return ApiResult.ok(m);
    }

    // ---------- 工具 ----------
    private static String first(MultiValueMap<String, String> params, String key) {
        String v = params.getFirst(key);
        return v == null ? "" : v.trim();
    }

    private static int parseInt(String s, int def) {
        if (s == null || s.isBlank()) {
            return def;
        }
        try {
            return Integer.parseInt(s.trim());
        } catch (NumberFormatException e) {
            return def;
        }
    }
}
