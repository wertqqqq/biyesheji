package com.zhiwei.food;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * 冒烟测试：验证核心接口可用、响应体符合前端 { code, data } 约定。
 */
@SpringBootTest
@AutoConfigureMockMvc
class SmokeTest {

    @Autowired
    private MockMvc mvc;

    @Test
    void shopListReturnsPagedEnvelope() throws Exception {
        mvc.perform(get("/shops").param("offset", "0").param("limit", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.list").isArray())
                .andExpect(jsonPath("$.data.total").value(10))
                .andExpect(jsonPath("$.data.hasMore").value(true));
    }

    @Test
    void shopDetailExposesMenuAndRatings() throws Exception {
        mvc.perform(get("/shops/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value("1"))
                .andExpect(jsonPath("$.data.menu").isArray());

        mvc.perform(get("/shops/1/menu"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].foods").isArray());

        mvc.perform(get("/shops/1/ratings").param("limit", "3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.list").isArray());
    }

    @Test
    void cityEndpointsWork() throws Exception {
        mvc.perform(get("/cities/hot"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray());
        mvc.perform(get("/cities/guess"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("上海"));
    }

    @Test
    void passwordLoginIssuesToken() throws Exception {
        mvc.perform(post("/auth/login/password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"demo\",\"password\":\"123456\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.token").exists())
                .andExpect(jsonPath("$.data.userInfo.id").value("u1001"));
    }

    @Test
    void badCredentialIsRejected() throws Exception {
        mvc.perform(post("/auth/login/password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"demo\",\"password\":\"000000\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(1));
    }

    @Test
    void seededUserAddressesAndOrders() throws Exception {
        mvc.perform(get("/user"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value("u1001"));

        mvc.perform(get("/users/u1001/addresses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray());

        mvc.perform(get("/users/u1001/orders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.list").isArray());
    }

    @Test
    void checkoutComputesTotals() throws Exception {
        mvc.perform(post("/carts/checkout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"restaurant_id\":\"1\",\"entities\":[{\"name\":\"招牌麻辣香锅\",\"price\":38,\"quantity\":2}]}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.goodsTotal").value(76))
                .andExpect(jsonPath("$.data.total").exists());
    }

    @Test
    void contentEndpointsWork() throws Exception {
        mvc.perform(get("/content/service"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.categories").isArray());
        // 兼容连字符与下划线两种写法
        mvc.perform(get("/users/u1001/expired-hongbaos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0));
    }
}
