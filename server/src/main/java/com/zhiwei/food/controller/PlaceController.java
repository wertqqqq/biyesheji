package com.zhiwei.food.controller;

import com.zhiwei.food.common.ApiResult;
import com.zhiwei.food.data.ReferenceData;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** 地点搜索 / 附近地址 / geohash 反解。 */
@RestController
public class PlaceController {

    private final ReferenceData ref;

    public PlaceController(ReferenceData ref) {
        this.ref = ref;
    }

    @GetMapping("/places/search")
    public ApiResult<List<Map<String, Object>>> search(@RequestParam(required = false) String keyword) {
        return ApiResult.ok(filter(keyword));
    }

    @GetMapping("/places/nearby")
    public ApiResult<List<Map<String, Object>>> nearby(@RequestParam(required = false) String keyword) {
        return ApiResult.ok(filter(keyword));
    }

    @SuppressWarnings("unchecked")
    @GetMapping("/location/resolve")
    public ApiResult<Map<String, Object>> resolve(@RequestParam(required = false) String geohash) {
        List<Map<String, Object>> places = (List<Map<String, Object>>) ref.city("nearbyPlaces");
        if (geohash != null && places != null) {
            for (Map<String, Object> p : places) {
                if (geohash.equals(String.valueOf(p.get("geohash")))) {
                    return ApiResult.ok(new LinkedHashMap<>(p));
                }
            }
        }
        return ApiResult.ok(new LinkedHashMap<>((Map<String, Object>) ref.city("defaultLocation")));
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> filter(String keyword) {
        List<Map<String, Object>> places = (List<Map<String, Object>>) ref.city("nearbyPlaces");
        List<Map<String, Object>> out = new ArrayList<>();
        if (places == null) {
            return out;
        }
        String kw = keyword == null ? "" : keyword.trim();
        for (Map<String, Object> p : places) {
            if (kw.isEmpty()) {
                out.add(p);
                continue;
            }
            String name = String.valueOf(p.getOrDefault("name", ""));
            String address = String.valueOf(p.getOrDefault("address", ""));
            if (name.contains(kw) || address.contains(kw)) {
                out.add(p);
            }
        }
        return out;
    }
}
