package com.zhiwei.food.common;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * 统一响应体：{ code, data, message }
 * 与前端 http.js 的 unwrap 约定一致：code===0 视为成功。
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiResult<T>(int code, T data, String message) {

    public static <T> ApiResult<T> ok(T data) {
        return new ApiResult<>(0, data, "success");
    }

    public static <T> ApiResult<T> ok() {
        return new ApiResult<>(0, null, "success");
    }

    public static <T> ApiResult<T> fail(int code, String message) {
        return new ApiResult<>(code == 0 ? 1 : code, null, message);
    }
}
