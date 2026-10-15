# 知味外卖前端 — 交付总览

## 做了什么
从零独立实现了一个功能对标主流外卖 App 的 Vue 前端，落在 `C:\Users\Administrator\Desktop\wm`。代码、目录/组件命名、文案均独立撰写，未复用任何参考实现源码。

- **技术栈**：Vue 2.7 + Vite 4 + Vuex + Vue Router 3 + better-scroll + showdown + Sass。
- **数据层**：`src/api/` 下的 fetch 客户端 + 业务模块 + Mock 适配器 + JSDoc 类型定义，默认离线 Mock，改 `.env` 即可切真实后端。
- **页面**：约 45 个路由/页面，覆盖选址、列表/筛选、搜索、店铺详情（菜单/购物车/评价）、登录、结算全流程、订单、个人中心、地址、会员卡、优惠/红包/积分/余额、客服、下载/发现、404。
- **质量**：构建通过（94 模块、路由级代码分割、index gzip ≈ 57KB），统一处理空/错误/加载/表单校验态，移动优先 + 桌面限宽居中，交互一致。

## 关键决策
- 按你的确认采用 **Vue 2.7 + Vuex + Vue Router**，类型定义用 JSDoc 表达。
- 「尽量全量对齐」：核心交易链路做扎实，外围页面功能齐全但更精简（见 README 对照表）。
- 购物车/结算状态放 Vuex，跨页面一致；结算临时选择（备注/发票/支付/地址）用独立 `checkout` 模块，导航不丢失。
- 加购抛物线用 Web Animations API 实现，零额外依赖。

## 运行
```bash
cd C:\Users\Administrator\Desktop\wm
npm install
npm run dev      # http://localhost:8080
```

## 待办 / 可扩展
- 接入真实后端（`.env` + `vite.config.js` 代理 + 按 `types.js` 对齐字段）。
- 补充 Vitest 单元/集成测试。
- 如需真实地图/支付，可引入对应 SDK（当前为模拟）。
- 外围静态页（下载/发现）可按需丰富。
