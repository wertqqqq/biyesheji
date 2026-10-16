package com.zhiwei.food;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 知味外卖 · Spring Boot 后端入口。
 * 启动后监听 9090 端口，通过 Vite 代理（或前端 VITE_API_BASE）与现有 Vue 前端对接。
 */
@SpringBootApplication
public class FoodApplication {
    public static void main(String[] args) {
        SpringApplication.run(FoodApplication.class, args);
    }
}
