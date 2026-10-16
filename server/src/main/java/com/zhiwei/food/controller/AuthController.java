package com.zhiwei.food.controller;

import com.zhiwei.food.common.ApiResult;
import com.zhiwei.food.common.BizException;
import com.zhiwei.food.common.Constants;
import com.zhiwei.food.common.JwtUtil;
import com.zhiwei.food.common.PasswordUtil;
import com.zhiwei.food.dto.ChangePasswordReq;
import com.zhiwei.food.dto.LoginMobileReq;
import com.zhiwei.food.dto.LoginPasswordReq;
import com.zhiwei.food.model.User;
import com.zhiwei.food.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * 账号 / 鉴权。
 * 登录成功后同时返回 token（响应体）并写入 HttpOnly Cookie，
 * 因此现有前端即使不主动携带 Authorization 头也能被识别。
 */
@RestController
public class AuthController {

    private final UserRepository userRepo;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepo, JwtUtil jwtUtil) {
        this.userRepo = userRepo;
        this.jwtUtil = jwtUtil;
    }

    /** 图形验证码（演示用，直接返回码值）。 */
    @PostMapping("/auth/captcha")
    public ApiResult<Map<String, Object>> captcha() {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("token", "cap-" + System.currentTimeMillis());
        m.put("code", random4());
        return ApiResult.ok(m);
    }

    /** 短信验证码（演示固定 1234）。 */
    @PostMapping("/auth/sms-code")
    public ApiResult<Map<String, Object>> smsCode() {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("sent", true);
        m.put("mockCode", Constants.MOCK_SMS_CODE);
        return ApiResult.ok(m);
    }

    /** 账号是否存在。 */
    @GetMapping("/auth/exists")
    public ApiResult<Map<String, Object>> exists(@RequestParam(required = false) String value) {
        boolean exists = "demo".equals(value)
                || (value != null && userRepo.findByUsername(value).isPresent());
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("exists", exists);
        return ApiResult.ok(m);
    }

    /** 账号密码登录。演示账号：demo / 123456 */
    @PostMapping("/auth/login/password")
    public ApiResult<Map<String, Object>> loginPassword(@RequestBody LoginPasswordReq req,
                                                        HttpServletResponse response) {
        if (req == null || isBlank(req.getUsername()) || req.getPassword() == null || req.getPassword().isEmpty()) {
            throw new BizException("请输入账号和密码");
        }
        if (req.getPassword().length() < 6) {
            throw new BizException("密码长度至少 6 位");
        }
        User user = userRepo.findByUsername(req.getUsername().trim())
                .orElseThrow(() -> new BizException(404, "用户不存在"));
        if (!PasswordUtil.matches(user.getUsername(), req.getPassword(), user.getPasswordHash())) {
            throw new BizException("密码错误");
        }
        return issueToken(user, response);
    }

    /** 手机号 + 验证码登录。演示手机号：13800000000，验证码：1234 */
    @PostMapping("/auth/login/mobile")
    public ApiResult<Map<String, Object>> loginMobile(@RequestBody LoginMobileReq req,
                                                      HttpServletResponse response) {
        if (req == null || req.getMobile() == null || !req.getMobile().matches("1\\d{10}")) {
            throw new BizException("手机号格式不正确");
        }
        if (!Constants.MOCK_SMS_CODE.equals(req.getCode())) {
            throw new BizException("验证码错误，请重新输入");
        }
        User user = userRepo.findByPhone(req.getMobile())
                .orElseThrow(() -> new BizException(404, "该手机号未注册"));
        return issueToken(user, response);
    }

    @PostMapping("/auth/signout")
    public ApiResult<Map<String, Object>> signout(HttpServletResponse response) {
        appendTokenCookie(response, "", Duration.ZERO);
        return ApiResult.ok(Map.of("ok", true));
    }

    /** 当前用户信息。 */
    @GetMapping("/user")
    public ApiResult<User> currentUser(HttpServletRequest request) {
        return ApiResult.ok(resolveUser(request));
    }

    /** 修改密码。 */
    @PostMapping("/user/password")
    public ApiResult<Map<String, Object>> changePassword(@RequestBody ChangePasswordReq req,
                                                         HttpServletRequest request) {
        if (req == null || req.getOldPassword() == null || req.getNewPassword() == null) {
            throw new BizException("请填写完整");
        }
        if (req.getNewPassword().length() < 6) {
            throw new BizException("新密码长度至少 6 位");
        }
        User user = resolveUser(request);
        if (!PasswordUtil.matches(user.getUsername(), req.getOldPassword(), user.getPasswordHash())) {
            throw new BizException("原密码不正确");
        }
        user.setPasswordHash(PasswordUtil.hash(user.getUsername(), req.getNewPassword()));
        userRepo.save(user);
        return ApiResult.ok(Map.of("ok", true));
    }

    // ---------- 内部 ----------
    private User resolveUser(HttpServletRequest request) {
        Object attr = request.getAttribute("userId");
        String uid = attr != null ? attr.toString() : Constants.DEMO_USER_ID;
        return userRepo.findById(uid)
                .orElseGet(() -> userRepo.findById(Constants.DEMO_USER_ID)
                        .orElseThrow(() -> new BizException(404, "用户不存在")));
    }

    private ApiResult<Map<String, Object>> issueToken(User user, HttpServletResponse response) {
        String token = jwtUtil.createToken(user.getId());
        appendTokenCookie(response, token, Duration.ofHours(24));

        Map<String, Object> m = new LinkedHashMap<>();
        m.put("token", token);
        m.put("userInfo", user);
        return ApiResult.ok(m);
    }

    /**
     * 下发鉴权 Cookie。
     * SameSite=None + Secure：允许前端（8080）跨端口请求后端（9090）时携带该 Cookie；
     * localhost 被浏览器视为安全上下文，因此本地 http 下也能正常写入与回传。
     */
    private static void appendTokenCookie(HttpServletResponse response, String value, Duration maxAge) {
        ResponseCookie cookie = ResponseCookie.from(Constants.TOKEN_COOKIE, value)
                .httpOnly(true)
                .path("/")
                .maxAge(maxAge)
                .secure(true)
                .sameSite("None")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private static String random4() {
        return String.valueOf(1000 + (int) (Math.random() * 9000));
    }

    private static boolean isBlank(String s) {
        return s == null || s.isBlank();
    }
}
