package com.zhiwei.food.common;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

/**
 * 口令摘要（演示用 SHA-256 + 用户名做 salt）。
 * 生产环境请替换为 BCrypt/Argon2（spring-security-crypto 的 BCryptPasswordEncoder）。
 */
public final class PasswordUtil {

    public static String hash(String username, String rawPassword) {
        return sha256(username + ":" + rawPassword);
    }

    public static boolean matches(String username, String rawPassword, String storedHash) {
        return storedHash != null && storedHash.equalsIgnoreCase(hash(username, rawPassword));
    }

    private static String sha256(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] bytes = md.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : bytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new IllegalStateException("SHA-256 不可用", e);
        }
    }

    private PasswordUtil() {
    }
}
