# 知味 · 外卖点餐前端网页

一个从零独立实现的外卖点餐 Web 应用（功能对标主流外卖 App 的核心链路），使用 **Vue 2.7 + Vite + Vuex + Vue Router 3**。

> 本项目为独立实现，代码、目录命名、组件命名与文案均与任何参考实现无关。

---
## 目录结构

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
