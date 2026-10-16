# 知味外卖 · Spring Boot 后端

把原有纯前端项目扩展为「前后端结合」的完整项目：后端用 **Java Spring Boot** 实现，
数据来自 **H2 嵌入式文件数据库**，与现有 Vue 前端零改动对接。


## 技术栈

| 组件 | 版本 |
| --- | --- |
| Java | 17（本机 OpenJDK 17.0.20.1） |
| Spring Boot | 3.2.5（web + data-jpa） |
| H2 | 嵌入式文件库 `./data/zhiwei.mv.db` |
| JWT | com.auth0:java-jwt 4.4.0 |
| 构建 | Maven 3.6.1 |

## 目录结构

```
server/
├── pom.xml
├── src/main/java/com/zhiwei/food/
│   ├── FoodApplication.java
│   ├── common/       ApiResult(统一响应体) BizException GlobalExceptionAdvice
│   │                 JwtUtil PasswordUtil Constants
│   ├── config/       WebConfig(CORS) AuthInterceptor(非阻塞鉴权)
│   ├── data/         ShopCatalog(商家目录) ReferenceData(城市/内容/权益)
│   ├── model/        Shop MenuCategory Food；User Address Order OrderItem JsonListConverter
│   ├── dto/          请求体
│   ├── repository/   JPA 仓储
│   ├── service/      DataSeeder(演示数据)
│   └── controller/   Shop City Place Auth Address Order Cart Payment Content
└── src/main/resources/
    ├── application.properties
    └── data/         shops.json / cities.json / content.json（由前端 fixtures 导出）
```

## 启动

```bash
cd server
mvn spring-boot:run        # 启动，监听 9090
mvn test                   # 冒烟测试（MockMvc，覆盖主要接口）
```

也可在根目录执行 `npm run dev:server`。

前端另开一个终端：

```bash
npm run dev                # Vite 8080，已配置代理把 API 请求转发到 9090
```

浏览器访问 http://localhost:8080

## 关键配置（application.properties）

```properties
server.port=9090
spring.datasource.url=jdbc:h2:file:./data/zhiwei;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
spring.jpa.hibernate.ddl-auto=update
zhiwei.cors.allowed-origins=http://localhost:8080,http://localhost:4173
```

- H2 控制台：http://localhost:9090/h2-console （JDBC URL 同上，用户 `sa`，密码留空）
- 数据文件落在 `server/data/`，新增地址 / 下单结果会持久化（该目录已加入 .gitignore）

## 演示账号

| 登录方式 | 凭据 |
| --- | --- |
| 账号密码 | `demo` / `123456` |
| 手机号 | `13800000000`，验证码固定 `1234`（`POST /auth/sms-code` 会返回 `mockCode: "1234"`） |

## 与前端的集成方式

**前端零改动**——后端完全遵循 `src/api/endpoints.js` 的路径与 `{ code, data, message }` 响应约定，
前端 `http.js` 的 `unwrap` 无需修改即可工作。

- `.env.development`：`VITE_USE_MOCK=false`，`VITE_API_BASE` 留空
  → 前端请求相对路径，由 Vite 代理同源转发到 9090（最稳，无跨域 / Cookie 问题）
- 想回到离线 mock 演示：把 `VITE_USE_MOCK` 改回 `true`

> 顺带修复：`vite.config.js` 原来用 `process.env.VITE_API_BASE` 读取配置（读不到 .env），
> 已改为 `loadEnv`；并把代理前缀补齐为实际的接口根路径（原来只代理 `/api，而 endpoints 并不带该前缀）。

## 已实现接口

- **城市 / 定位**：`/cities/guess`、`/cities/hot`、`/cities/groups`、`/cities/{id}`、
  `/places/search`、`/places/nearby`、`/location/resolve`
- **商家**：`/shops`（分页 + 关键词 / 品牌 / 配送方式筛选 + 评分销量距离排序）、`/shops/search`、
  `/shops/categories`、`/shops/delivery-modes`、`/shops/activity-attributes`、
  `/shops/{id}`、`/shops/{id}/menu`、`/shops/{id}/ratings(/scores|/tags)`、`/shops/{shopId}/foods/{foodId}`
- **账号**：`/auth/captcha`、`/auth/sms-code`、`/auth/exists`、`/auth/login/password`、
  `/auth/login/mobile`、`/auth/signout`、`GET /user`、`POST /user/password`
- **地址**：`/users/{userId}/addresses` 增删改查
- **订单**：`GET/POST /users/{userId}/orders`、`/users/{userId}/orders/{orderId}/snapshot`
- **购物车**：`POST /carts/checkout`、`/carts/{id}/remarks`、`/carts/{id}/addresses`、`/carts/{id}/verify`
- **支付**：`POST /payments/query`
- **内容 / 权益**：`/content/service`、`/content/vip/description`、红包、积分、余额、会员卡绑定

> 另外修正了一处前端既有不一致：`endpoints.js` 用的是 `expired-hongbaos`（连字符），
> 而旧 mock 路由写的是 `expired_hongbaos`（下划线）。后端两种写法都已支持。

## 设计说明与生产化建议

- **鉴权**：登录成功后同时返回 JWT（响应体 `token`）并写入 `HttpOnly` Cookie `zw_token`。
  `AuthInterceptor` 采用**非阻塞**设计——携带合法 token 时解析出 userId，未携带也放行，
  这样现有前端不改代码即可跑通全部功能；**生产环境应改为“未认证直接 401”**。
- **口令**：演示用 `SHA-256(用户名:密码)`；生产请换 BCrypt / Argon2（`BCryptPasswordEncoder`）。
- **JWT 密钥**：放在 `application.properties` 的 `zhiwei.jwt.secret`，生产请改为环境变量 / 配置中心，并换成 RSA。
- **数据库迁移**：把 `h2` 换成 `mysql-connector-j` 或 `postgresql` 依赖，并修改
  `spring.datasource.*` 与 `spring.jpa.database-platform` 即可，实体层无需改动。
- **商家数据**：属于只读参考数据，从前端 fixtures 导出的 JSON 直接加载，未落库；
  若需要商家后台维护，可进一步建模为 JPA 实体。
