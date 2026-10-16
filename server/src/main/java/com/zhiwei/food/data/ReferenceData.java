package com.zhiwei.food.data;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Map;

/**
 * 只读参考数据（城市 / 定位 / 内容 / 权益），同样由前端 fixtures 导出为 JSON。
 */
@Service
public class ReferenceData {

    private final Map<String, Object> cities;
    private final Map<String, Object> content;

    public ReferenceData(@Value("classpath:data/cities.json") Resource citiesRes,
                         @Value("classpath:data/content.json") Resource contentRes) throws IOException {
        ObjectMapper om = new ObjectMapper();
        this.cities = om.readValue(citiesRes.getInputStream(), new TypeReference<Map<String, Object>>() {
        });
        this.content = om.readValue(contentRes.getInputStream(), new TypeReference<Map<String, Object>>() {
        });
    }

    public Map<String, Object> getCities() {
        return cities;
    }

    public Map<String, Object> getContent() {
        return content;
    }

    @SuppressWarnings("unchecked")
    public <T> T city(String key) {
        return (T) cities.get(key);
    }

    @SuppressWarnings("unchecked")
    public <T> T content(String key) {
        return (T) content.get(key);
    }
}
