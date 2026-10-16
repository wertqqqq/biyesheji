package com.zhiwei.food.controller;

import com.zhiwei.food.common.ApiResult;
import com.zhiwei.food.common.BizException;
import com.zhiwei.food.data.ReferenceData;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** 城市：定位 / 热门 / 分组 / 详情。 */
@RestController
@RequestMapping("/cities")
public class CityController {

    private final ReferenceData ref;

    public CityController(ReferenceData ref) {
        this.ref = ref;
    }

    @GetMapping("/guess")
    public ApiResult<Object> guess() {
        return ApiResult.ok(ref.city("guessCity"));
    }

    @GetMapping("/hot")
    public ApiResult<Object> hot() {
        return ApiResult.ok(ref.city("hotCities"));
    }

    @GetMapping("/groups")
    public ApiResult<Object> groups() {
        return ApiResult.ok(ref.city("cityGroups"));
    }

    @SuppressWarnings("unchecked")
    @GetMapping("/{id}")
    public ApiResult<Map<String, Object>> byId(@PathVariable String id) {
        List<Map<String, Object>> all = new ArrayList<>();

        Object hot = ref.city("hotCities");
        if (hot instanceof List) {
            all.addAll((List<Map<String, Object>>) hot);
        }
        Object groups = ref.city("cityGroups");
        if (groups instanceof List) {
            for (Object g : (List<?>) groups) {
                if (g instanceof Map) {
                    Object cities = ((Map<?, ?>) g).get("cities");
                    if (cities instanceof List) {
                        all.addAll((List<Map<String, Object>>) cities);
                    }
                }
            }
        }

        for (Map<String, Object> c : all) {
            if (String.valueOf(c.get("id")).equals(id)) {
                return ApiResult.ok(new LinkedHashMap<>(c));
            }
        }
        throw new BizException(404, "城市不存在");
    }
}
