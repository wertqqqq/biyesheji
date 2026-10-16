package com.zhiwei.food.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/** POST /carts/checkout 请求体。 */
@Data
@NoArgsConstructor
public class CheckoutReq {
    private List<CartEntity> entities = new ArrayList<>();

    @JsonProperty("restaurant_id")
    private String restaurantId;
}
