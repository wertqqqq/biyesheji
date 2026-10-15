# 知味 · 外卖点餐前端

一个从零独立实现的外卖点餐 Web 应用（功能对标主流外卖 App 的核心链路），使用 **Vue 2.7 + Vite + Vuex + Vue Router 3**。

- 数据默认走**本地 Mock**（离线可完整体验），并通过**统一数据访问层**预留真实后端接口，切换环境变量即可接入。
- 移动端优先，桌面端以「限宽居中壳」呈现，**交互完全一致**。
- 全量覆盖空数据 / 加载失败 / 表单校验等关键异常状态。

> 本项目为独立实现，代码、目录命名、组件命名与文案均与任何参考实现无关。

---

## 一、快速开始

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器（默认 http://localhost:8080）
npm run dev

# 3. 生产构建
npm run build

# 4. 预览生产构建
npm run preview
```

要求 Node.js >= 16（推荐 18+）。

---

## 二、接入真实后端

数据访问层集中在 `src/api/`，页面只与 `api/modules/*` 交互，换后端零成本：

1. 复制 `.env.example` 为 `.env.development` / `.env.production`。
2. 设置 `VITE_USE_MOCK=false`，并配置 `VITE_API_BASE=https://你的后端地址`。
3. 在 `vite.config.js` 的 `server.proxy` 中按需代理后端路径（默认已代理 `/api`）。
4. 响应体约定：`{ code: 0, data, message }`，`code === 0` 视为成功（在 `src/api/http.js` 的 `unwrap` 中统一处理，可按后端实际约定调整）。
5. 字段契约见 `src/api/types.js`（JSDoc `@typedef`）。

---

## 三、目录结构

```
wm/
├─ index.html
├─ vite.config.js            # Vite 配置（别名 / 代理）
├─ .env.*                    # 环境变量（mock 开关 / 后端地址）
└─ src/
   ├─ main.js                # 入口
   ├─ App.vue                # 根组件（限宽壳 + 过渡 + 全局 Toast）
   ├─ router/index.js        # 路由表（懒加载 + 标题守卫）
   ├─ layouts/               # 布局（预留）
   ├─ views/                 # 页面（按功能域分目录）
   │  ├─ HomeView / CityPickerView / ShopListView / SearchView / FoodView
   │  ├─ ShopDetailView / ShopSafeView / FoodDetailView
   │  ├─ LoginView / ForgetView / CheckoutView
   │  ├─ checkout/           # 结算子页（备注/发票/支付/验证/选地址/新增/搜索）
   │  ├─ OrderListView / OrderDetailView
   │  ├─ AccountView
   │  ├─ account/            # 个人资料/用户名/地址管理
   │  ├─ ServiceView / QuestionDetailView
   │  ├─ VipcardView, vip/   # 会员卡及子页
   │  ├─ BenefitView, benefit/ # 优惠/红包/积分相关
   │  ├─ PointsView(+Detail) / BalanceView(+Detail)
   │  ├─ DownloadView / FindView / NotFoundView
   ├─ components/
   │  ├─ base/               # 通用 UI：按钮/星级/步进/加载/空/错误/Toast/页面骨架
   │  └─ business/           # 业务组件：店铺卡/筛选条/店铺头/菜单/购物车/评价
   ├─ api/
   │  ├─ http.js             # fetch 客户端（拦截器/超时/统一错误/mock 开关）
   │  ├─ endpoints.js        # 接口路径常量
   │  ├─ types.js            # 领域模型类型定义（JSDoc）
   │  ├─ mock/               # mock 适配器 + 种子数据
   │  └─ modules/            # 业务接口函数（city/shop/account/order/content）
   ├─ composables/           # useRequest / useInfiniteList
   ├─ stores/                # Vuex：location / cart / user / checkout
   ├─ styles/                # tokens / mixins / base
   └─ utils/                 # rem 适配 / 格式化 / 校验
```

---

## 四、与参考实现的功能对照表

| 功能模块 | 状态 | 说明 |
|---|---|---|
| 城市 / 定位选择 | ✅ 已实现 | 定位默认城市、热门城市、字母分组、搜索 |
| 商家列表（排序 / 筛选 / 加载更多） | ✅ 已实现 | 综合/好评/销量/距离排序；分类/配送/属性筛选；滚动分页 |
| 搜索（历史 / 热门 / 结果 / 空态） | ✅ 已实现 | 防抖搜索、历史持久化、清空 |
| 分类美食 | ✅ 已实现 | 左侧分类 + 右侧列表联动 |
| 店铺详情（菜单 / 购物车 / 评价 / 商家） | ✅ 已实现 | better-scroll 左右联动、增减购物车、加购抛物线、购物车弹层/清空/起送价 |
| 加购飞入动画 | ✅ 已实现 | Web Animations API 抛物线 |
| 菜品详情 | ✅ 已实现 | 单菜品展示 + 加购 |
| 资质与安全 | ✅ 已实现 | Markdown 渲染（showdown） |
| 登录（账号 / 短信 + 验证码 + 校验） | ✅ 已实现 | 双模式、表单校验、错误提示 |
| 确认订单（地址 / 备注 / 发票 / 支付 / 提交） | ✅ 已实现 | 地址选择、备注、发票抬头、支付方式、起送价校验、未登录拦截 |
| 地址搜索 / 新增 | ✅ 已实现 | POI 搜索、表单校验 |
| 订单列表 / 详情 | ✅ 已实现 | 分页、状态、快照 |
| 个人中心 / 资料 / 用户名 / 地址管理 | ✅ 已实现 | 增 / 改 / 删 |
| 服务中心 / 问题详情 | ✅ 已实现 | 分类问答 |
| 会员卡（中心 / 说明 / 购买 / 开票记录） | ✅ 已实现 | 套餐选择、实体卡绑定 |
| 优惠（红包 / 代金券说明 / 历史 / 兑换 / 推荐） | ✅ 已实现 | 红包数统计、兑换表单 |
| 积分（列表 / 说明） | ✅ 已实现 | 明细 + 说明 |
| 余额（列表 / 说明） | ✅ 已实现 | 收支明细 |
| 修改密码 | ✅ 已实现 | 表单校验 |
| 下载 App / 发现 | 🔶 已简化 | 静态展示页（演示用途，无真实下载/文章） |
| 订单身份验证 | 🔶 已简化 | 独立验证页可用；正常下单流程不强制验证（Mock 默认通过） |
| 真实地图 / 定位 SDK | ⛔ 未实现 | 演示使用固定 geohash 与模拟 POI，不接第三方地图 |
| 真实支付 | ⛔ 未实现 | 支付为模拟流程，不产生真实扣款 |
| 图片资源 | ⚪ 处理方式 | 使用 emoji + 渐变色占位，无外部图片依赖 |
| 测试（Vitest） | ⛔ 未实现 | 本轮聚焦功能交付，测试可后续补充 |

图例：✅ 已实现 · 🔶 已简化 · ⛔ 未实现 · ⚪ 特殊处理

---

## 五、设计要点

- **统一数据访问层**：`http.js`（拦截器/超时/错误）+ `modules/*`（业务函数）+ `mock/server.js`（路由到假数据）+ `types.js`（类型契约）。接后端仅改 `.env`。
- **状态管理**：Vuex 四模块 —— `location`（定位/城市/地址）、`cart`（跨页购物车，持久化）、`user`（登录态）、`checkout`（结算临时选择）。
- **响应式**：移动优先 + rem 适配（750 基准、桌面封顶），桌面端限宽居中，交互一致。
- **异常状态**：全局统一处理加载中 / 空数据 / 加载失败（含重试）/ 表单校验错误 / 网络 Toast。
- **性能**：路由级代码分割、列表页 keep-alive、better-scroll 实例随组件销毁。
