package com.zhiwei.food.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

/** POST /user/password 请求体。 */
@Data
@NoArgsConstructor
public class ChangePasswordReq {
    private String oldPassword;
    private String newPassword;
}
