package com.zhiwei.food.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/** POST /users/{userId}/orders 请求体。 */
@Data
@NoArgsConstructor
public class PlaceOrderReq {
    private List<CartEntity> entities = new ArrayList<>();

    @JsonProperty("restaurant_id")
    private String restaurantId;

    @JsonProperty("address_id")
    private String addressId;

    private String description;

    @JsonProperty("validation_code")
    private String validationCode;
}
