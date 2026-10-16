package com.zhiwei.food.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

/** POST /auth/login/password 请求体。 */
@Data
@NoArgsConstructor
public class LoginPasswordReq {
    private String username;
    private String password;
}
