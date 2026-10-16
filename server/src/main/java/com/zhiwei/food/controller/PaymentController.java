package com.zhiwei.food.controller;

import com.zhiwei.food.common.ApiResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/** 支付结果查询（演示：直接成功）。 */
@RestController
public class PaymentController {

    @PostMapping("/payments/query")
    public ApiResult<Map<String, Object>> query() {
        return ApiResult.ok(Map.of("status", "SUCCESS"));
    }
}
