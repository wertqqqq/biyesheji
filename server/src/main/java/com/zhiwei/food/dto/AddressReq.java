package com.zhiwei.food.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

/** 新增 / 修改收货地址请求体。 */
@Data
@NoArgsConstructor
public class AddressReq {
    private String name;
    private String phone;
    private String tag;
    private String address;
    private String detail;
    private String geohash;
    /** 0-女士 1-先生 */
    private Integer sex;
}
