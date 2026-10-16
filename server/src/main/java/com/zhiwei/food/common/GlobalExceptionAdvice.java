package com.zhiwei.food.common;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 全局异常 -> 统一响应体 { code, data:null, message }
 */
@RestControllerAdvice
public class GlobalExceptionAdvice {

    @ExceptionHandler(BizException.class)
    public ApiResult<Void> handleBiz(BizException e) {
        return ApiResult.fail(e.getCode(), e.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ApiResult<Void> handleOther(Exception e) {
        return ApiResult.fail(500, e.getMessage() == null ? "服务器异常" : e.getMessage());
    }
}
