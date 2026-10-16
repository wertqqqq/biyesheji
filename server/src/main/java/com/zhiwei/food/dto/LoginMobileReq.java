package com.zhiwei.food.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

/** POST /auth/login/mobile 请求体。 */
@Data
@NoArgsConstructor
public class LoginMobileReq {
    private String mobile;
    private String code;
}
