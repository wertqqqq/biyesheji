package com.zhiwei.food.config;

import com.zhiwei.food.common.Constants;
import com.zhiwei.food.common.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * 鉴权拦截器（非阻塞版）。
 * 若请求携带合法 JWT（Cookie 或 Authorization 头），则把 userId 放入 request 属性；
 * 即使未携带/失效也放行，保证现有前端在不改代码的情况下仍可正常调用。
 * 生产环境可在此处改为「未认证直接 401」。
 */
@Component
public class AuthInterceptor implements HandlerInterceptor {

    private final JwtUtil jwtUtil;

    public AuthInterceptor(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String token = extractToken(request);
        if (token != null) {
            String uid = jwtUtil.verifyToken(token);
            if (uid != null) {
                request.setAttribute("userId", uid);
            }
        }
        return true;
    }

    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7).trim();
        }
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie c : cookies) {
                if (Constants.TOKEN_COOKIE.equals(c.getName())) {
                    return c.getValue();
                }
            }
        }
        return null;
    }
}
