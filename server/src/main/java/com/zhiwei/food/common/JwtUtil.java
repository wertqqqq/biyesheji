package com.zhiwei.food.common;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

/**
 * JWT 工具（java-jwt）。本地开发用对称 HMAC；生产应替换为非对称/RSA 并放入配置中心。
 */
@Component
public class JwtUtil {

    private final Algorithm algorithm;
    private final long expireMillis;

    public JwtUtil(
            @Value("${zhiwei.jwt.secret}") String secret,
            @Value("${zhiwei.jwt.expire-hours:24}") long expireHours) {
        this.algorithm = Algorithm.HMAC256(secret);
        this.expireMillis = expireHours * 3600_000L;
    }

    public String createToken(String userId) {
        Date now = new Date();
        return JWT.create()
                .withSubject(userId)
                .withIssuedAt(now)
                .withExpiresAt(new Date(now.getTime() + expireMillis))
                .sign(algorithm);
    }

    /** 校验成功返回 userId，失败返回 null（非阻塞设计：失败不直接抛错）。 */
    public String verifyToken(String token) {
        try {
            return JWT.require(algorithm).build().verify(token).getSubject();
        } catch (JWTVerificationException | IllegalArgumentException e) {
            return null;
        }
    }
}
