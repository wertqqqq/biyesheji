package com.zhiwei.food.common;

/**
 * 约定常量。
 */
public final class Constants {
    /** 登录后写入的鉴权 Cookie 名（HttpOnly + SameSite=None;Secure）。 */
    public static final String TOKEN_COOKIE = "zw_token";
    /** 走真实后端时的默认演示账号。 */
    public static final String DEMO_USER_ID = "u1001";
    /** 短信验证码（演示固定值）。 */
    public static final String MOCK_SMS_CODE = "1234";
    /** 演示账号密码。 */
    public static final String DEMO_PASSWORD = "123456";

    private Constants() {
    }
}
