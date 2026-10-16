package com.zhiwei.food.model;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.ArrayList;
import java.util.List;

/**
 * 把 List&lt;OrderItem&gt; 以 JSON 字符串持久化（H2 无需额外表即可存储订单明细）。
 */
@Converter
public class JsonListConverter implements AttributeConverter<List<OrderItem>, String> {

    private static final ObjectMapper OM = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<OrderItem> attribute) {
        if (attribute == null) {
            return "[]";
        }
        try {
            return OM.writeValueAsString(attribute);
        } catch (Exception e) {
            return "[]";
        }
    }

    @Override
    public List<OrderItem> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return new ArrayList<>();
        }
        try {
            return OM.readValue(dbData, new TypeReference<List<OrderItem>>() {
            });
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }
}
