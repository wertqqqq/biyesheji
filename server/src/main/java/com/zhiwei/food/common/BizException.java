package com.zhiwei.food.common;

/**
 * 业务异常：携带一个非 0 的错误码，由 GlobalExceptionAdvice 统一转换为 ApiResult。
 */
public class BizException extends RuntimeException {
    private final int code;

    public BizException(int code, String message) {
        super(message);
        this.code = code;
    }

    public BizException(String message) {
        this(1, message);
    }

    public int getCode() {
        return code;
    }
}
