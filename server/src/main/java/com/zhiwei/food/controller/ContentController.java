package com.zhiwei.food.controller;

import com.zhiwei.food.common.ApiResult;
import com.zhiwei.food.common.BizException;
import com.zhiwei.food.data.ReferenceData;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

/** 内容 / 权益：服务中心、会员说明、红包、积分、余额、会员卡。 */
@RestController
public class ContentController {

    private final ReferenceData ref;

    public ContentController(ReferenceData ref) {
        this.ref = ref;
    }

    @GetMapping("/content/service")
    public ApiResult<Object> service() {
        return ApiResult.ok(ref.content("serviceCenter"));
    }

    @GetMapping("/content/vip/description")
    public ApiResult<Object> vipDescription() {
        return ApiResult.ok(ref.content("vipDescription"));
    }

    @GetMapping("/users/{userId}/hongbaos")
    public ApiResult<Object> hongbaos(@PathVariable String userId) {
        return ApiResult.ok(ref.content("hongbaos"));
    }

    /**
     * 过期红包。同时兼容连字符与下划线两种写法
     * （前端 endpoints.js 用的是 expired-hongbaos，既有的 mock 路由用的是 expired_hongbaos）。
     */
    @GetMapping({"/users/{userId}/expired-hongbaos", "/users/{userId}/expired_hongbaos"})
    public ApiResult<Object> expiredHongbaos(@PathVariable String userId) {
        return ApiResult.ok(ref.content("expiredHongbaos"));
    }

    @PostMapping("/users/{userId}/hongbao/exchange")
    public ApiResult<Map<String, Object>> exchange(@PathVariable String userId,
                                                   @RequestBody Map<String, Object> body) {
        Object code = body == null ? null : body.get("exchange_code");
        if (code == null || String.valueOf(code).isBlank()) {
            throw new BizException("请输入兑换码");
        }
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("ok", true);
        m.put("message", "兑换成功");
        return ApiResult.ok(m);
    }

    @GetMapping("/users/{userId}/points")
    public ApiResult<Object> points(@PathVariable String userId) {
        return ApiResult.ok(ref.content("points"));
    }

    @GetMapping("/users/{userId}/balance")
    public ApiResult<Object> balance(@PathVariable String userId) {
        return ApiResult.ok(ref.content("balance"));
    }

    @PostMapping("/member/users/{userId}/vip-card/bind")
    public ApiResult<Map<String, Object>> bindVipCard(@PathVariable String userId,
                                                      @RequestBody Map<String, Object> body) {
        if (body == null || body.get("number") == null || body.get("password") == null) {
            throw new BizException("请填写卡号和密码");
        }
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("ok", true);
        m.put("message", "会员卡绑定成功");
        return ApiResult.ok(m);
    }
}
