# 知味外卖 — 全栈扩展技术方案推荐

> 基于本地环境实际检测结果给出。当前为纯前端项目（Vue 2.7 + Vite），目标是扩展为"前后端结合"的完整项目。

---

## 一、本地环境检测结果

| 类别 | 工具 | 版本 | 状态 |
| --- | --- | --- | --- |
| 语言运行时 | Node.js | v22.22.2（托管版，主力） | ✅ |
| | Python | 3.13.14（托管版与系统版一致） | ✅ |
| | Java (OpenJDK) | 17.0.20.1 LTS | ✅ |
| | Go / .NET / Rust / PHP | — | ❌ 未安装 |
| 包管理器 | npm | 10.9.7 | ✅ |
| | pnpm | 9.12.3（全局存在，但 PATH 默认指向 node14 有冲突） | ⚠️ |
| | yarn | 1.22.22（classic） | ✅ |
| | npx | 10.9.7 | ✅ |
| 构建 / VCS | Vite | 4.5.14（项目内） | ✅ |
| | Git | 2.55.0.windows.3 | ✅ |
| 容器化 | Docker | — | ❌ 未安装 |
| 数据库 | SQLite | 3.50.4 CLI **+ Node 22 内置 `node:sqlite`** | ✅ |
| | MySQL / PostgreSQL / MongoDB / Redis | — | ❌ 均未安装 |

**关键事实（直接决定推荐）：**

1. 当前前端栈：**Vue 2.7.16 + Vite 4 + Vuex 3 + Vue Router 3（hash 模式）**。
2. 已有一套干净的 API 抽象层：
   - `src/api/http.js`：统一 `fetch` + 请求/响应拦截器 + 超时 + **`{ code: 0, data, message }` 解包**；
   - `src/api/endpoints.js`：集中维护所有端点（登录、商家、订单、地址、权益等）；
   - `src/api/mock/server.js`：本地 mock 分发。
3. `vite.config.js` 已内置 `/api` 代理：`VITE_API_BASE` 配置后 `/api` → 真实后端；`http.js` 通过 `VITE_USE_MOCK` 切换 mock / 真实。
4. **结论：前端已经为"接真实后端"预留了全部开关**，后端只需按 `endpoints.js` 的契约实现路由，前端调用代码一行都不用改。

---

## 二、关键约束与机会

- ❌ **没有 Docker** → 无法用容器跑 MySQL/PG/Redis 镜像。本地只能跑"可独立安装 / 嵌入式"的组件。
- ❌ **没有 MySQL/PostgreSQL/MongoDB/Redis 服务端** → 本地全栈开发**首选 SQLite**（系统自带 CLI，且 Node 22 内置 `node:sqlite`，零编译、零安装即用）。
- ✅ **Node 22 + SQLite 是黄金组合**：单一语言贯通前后端，Vite 代理无缝对接，SQLite 文件即数据库，无需任何常驻服务进程。
- ⚠️ **pnpm PATH 冲突**：全局 `pnpm@9.12.3` 存在，但默认 `pnpm` 命令被 node 14 路径劫持而报错。建议统一用 npm，或在 node 22 下重装 pnpm：
  ```bash
  # 在 node 22 环境
  npm i -g pnpm
  ```

---

## 三、可选完整技术栈方案

### 方案 A：Node 全栈（BFF + SQLite）⭐ 推荐

- 前端：现有 Vue 2.7 + Vite 不变
- 后端：Node 22 + **Express**（或 Fastify / Hono 轻量替代）+ **`node:sqlite`**（内置，免安装；或 `better-sqlite3`）
- 鉴权：`jsonwebtoken` + `bcryptjs`
- 校验：`zod`
- 工程化：`concurrently`（一键起前后端）、`tsx` / `nodemon`（热重载）

**适用场景**：最快落地、单一语言栈、与现有 Vite 代理天然契合、零外部依赖。
**取舍**：SQLite 不适合高并发 / 多写生产；后期如需扩展，可平滑迁移 PostgreSQL（只改一个 db 适配层）。

### 方案 B：Node + NestJS + Prisma + SQLite / Postgres

- 后端：NestJS（模块化、DI、装饰器路由）+ Prisma（ORM：dev 用 SQLite，prod 只改 `datasource` 即可切 Postgres）
- 适合：需要严格分层、RBAC、未来团队化开发、强可维护性。

**取舍**：学习曲线与样板代码更重；对当前演示型外卖项目略显"重型"，但最利于长期演进，也最契合此前规划的后台管理（RBAC / 操作日志）。
**机会**：之前已设计过 `src/admin/permissions.js`（角色 super_admin / editor / viewer + `can(role, perm)`），可在此方案下低成本复活。

### 方案 C：Python 后端（FastAPI + SQLite / SQLAlchemy）

- 后端：FastAPI（异步、自动 OpenAPI 文档）+ SQLAlchemy + SQLite
- 鉴权：`python-jose` + `passlib`

**适用场景**：你更熟 Python，或未来想接推荐 / 数据分析 / ML。前端集成方式不变（仍走 `/api` 代理）。
**取舍**：引入第二语言与运行时，前后端工具链分裂，但开发体验与类型支持同样优秀。

### 方案 D：Java Spring Boot + H2（嵌入式）

- 后端：Spring Boot 3 + Spring Security + Spring Data JPA + H2（内存 / 文件库，替代缺失的 MySQL）
- **适用场景**：强企业级、强事务一致性需求。
- **取舍**：JVM 启动慢、依赖重、与现有 JS 栈割裂；对当前项目偏过度设计，仅在你明确要走 Java 体系时考虑。

### 横向取舍对比

| 维度 | A Node+SQLite | B NestJS+Prisma | C Python+FastAPI | D Spring Boot |
| --- | --- | --- | --- | --- |
| 落地速度 | 最快 | 中 | 中 | 慢 |
| 学习 / 维护成本 | 低 | 中高 | 中 | 高 |
| 与现有前端契合 | 最好 | 好 | 好（代理一致） | 一般 |
| 生产可扩展性 | 中（需迁 PG） | 高 | 高 | 最高 |
| 本地零依赖 | ✅ SQLite | ✅ SQLite | ✅ SQLite | ✅ H2 |
| 适合后台 RBAC | 需自写 | 天然适合 | 需自写 | 天然适合 |

---

## 四、前后端集成方式（关键，已具备基础）

现有代码已为接后端做好准备，落地只需三步：

**1. 后端实现契约**
按 `src/api/endpoints.js` 的路径实现路由，例如：
- `POST /auth/login/password`、`POST /auth/login/mobile`
- `GET /shops`、`GET /shops/:id/menu`
- `POST /users/:userId/orders`
- `GET /users/:userId/addresses`

响应体统一为 `{ code: 0, data, message }`，`code === 0` 视为成功——这样前端 `http.js` 的 `unwrap` **无需任何改动**。

**2. 本地联调（Vite 代理，已就绪）**
- 后端监听 `http://localhost:3000`
- `.env.development` 设 `VITE_USE_MOCK=false`，`VITE_API_BASE=` 可留空（走代理）或填 `http://localhost:3000`
- `vite.config.js` 已配置 `server.proxy['/api']` → target = `VITE_API_BASE`，前端 `/api/shops` 自动转发到后端 `/shops`（已 `rewrite` 去掉 `/api` 前缀）；若后端想保留前缀，去掉 `rewrite` 即可。

**3. 生产部署**
- 方式一：`vite build` 产物放到后端静态目录（`express.static`），同源部署，无需代理；
- 方式二：前后端分离 + Nginx 反代（生产推荐）。

**数据流示意：**
```
浏览器 (Vue) ──fetch /api/*──▶ Vite DevServer :8080 ──proxy──▶ Node 后端 :3000 ──node:sqlite──▶ db.sqlite
                                        │
                              mock 模式时：src/api/mock/server.js 直接返回
```

---

## 五、推荐项目结构

**最小改动、最低摩擦（推荐先这样）：**
```
wm/
├── src/                 # 现有前端（不动）
├── public/
├── server/              # 新增后端（独立 package.json）
│   ├── src/
│   │   ├── index.js     # 入口：启动 express + 注册路由
│   │   ├── db/          # node:sqlite 连接 + 建表
│   │   ├── routes/      # 按 endpoints.js 契约拆模块
│   │   ├── middleware/  # auth(jwt) / error / validate
│   │   └── seed.js      # 初始商家/菜单/用户数据
│   ├── data/            # db.sqlite（加入 .gitignore）
│   └── package.json
├── package.json         # 根：加 concurrently 脚本
└── vite.config.js       # 已有 /api 代理
```

**进阶（后续需要再上）：** pnpm / yarn workspaces 单仓多包 `apps/web` + `apps/server`。当前阶段不建议，会增加不必要的复杂度。

根 `package.json` 增加：
```json
{
  "scripts": {
    "dev": "concurrently -n web,api -c blue,green \"vite\" \"npm --prefix server run dev\"",
    "dev:server": "npm --prefix server run dev"
  }
}
```

---

## 六、本地落地所需主要依赖 / 工具

后端（方案 A，在 `server/` 下）：
```bash
npm init -y
npm i express cors dotenv jsonwebtoken bcryptjs zod
npm i -D tsx nodemon
# 数据库：优先用 Node 22 内置 node:sqlite（无需安装、无需编译）
# 若选 better-sqlite3，需要 MSVC 构建工具（本机未验证，可能缺失）→ 故推荐 node:sqlite
```

根目录：
```bash
npm i -D concurrently
```

> **pnpm 注意**：默认 `pnpm` 被 node14 劫持会报错，建议统一用 npm；或显式使用 `D:\nodejs\node_global\node_modules\.bin\pnpm`，在 node 22 下 `npm i -g pnpm` 重装。

---

## 七、缺失关键工具说明与替代

| 缺失 | 影响 | 替代建议 |
| --- | --- | --- |
| Docker | 不能容器化部署 / 跑镜像库 | 用嵌入式或可安装组件：SQLite（已具备）、H2（Java）；或去官网下 MySQL / PostgreSQL Windows 安装包直接装（非容器） |
| MySQL / PostgreSQL / MongoDB / Redis | 本地无服务端 | 开发期用 SQLite；生产再上云或本机装 PG（https://www.postgresql.org/download/windows/）。Redis 仅在你用到缓存 / 会话共享时需要，初期可不用 |
| Go / .NET / Rust / PHP | 不能选对应栈 | 不影响——Node / Python / Java 已覆盖主要需求 |
| pnpm PATH 冲突 | 直接 `pnpm` 报错 | 用 npm，或在 node 22 环境重装 pnpm |

若你希望本地真正跑起 MySQL / Redis：最稳是去官方下载 Windows 安装版（MySQL Installer、Redis for Windows 由 Memurai 提供），或装 WSL2 后 `apt install`——但都不如 SQLite 省事，**建议开发期先用 SQLite**。

---

## 八、落地路线图（建议顺序）

1. `server/` 初始化 Node 项目，安装 express + `node:sqlite` 等。
2. 实现 `db` 层：建表（users / shops / foods / orders / addresses）+ `seed.js` 灌入现有 mock 数据（`src/api/mock/fixtures.js` 可直接复用）。
3. 按 `endpoints.js` 逐模块实现路由 + JWT 鉴权中间件。
4. 统一响应体 `{ code: 0, data }` + 全局错误处理，保证与前端 `unwrap` 兼容。
5. 根 `package.json` 加 `concurrently` 一键起前后端；`.env.development` 切 `VITE_USE_MOCK=false`。
6. 联调：浏览器走 `localhost:8080`，Vite 代理到 `:3000`。
7. （可选）加后台管理 RBAC——此前已规划，可基于方案 B 的 NestJS 或方案 A 自写中间件落地。

---

## 九、结论

基于你本机环境（**Node 22 + Python 3.13 + Java 17 可用；Docker 与主流数据库服务端缺失；SQLite 内置可用**），**首选方案 A：Node 22 + Express + 内置 `node:sqlite`**，理由：

- 与现有 Vue / Vite **单语言栈**、零外部服务依赖、Vite `/api` 代理已就绪、前端无需改任何调用代码；
- SQLite 文件即库，开箱即用，后期可平滑迁移 PostgreSQL；
- 最快把"纯前端"变成"前后端结合"的可运行全栈项目。

若你重视长期可维护与后台管理（RBAC / 日志），选 **方案 B（NestJS + Prisma）**；若更熟 Python 并想保留 ML 空间，选 **方案 C**；明确走 Java 体系才选 **方案 D**。

---

*附：本检测命令均在你本机 `C:\Users\Administrator\Desktop\wm` 实际执行，版本号真实有效（非沙箱模拟）。*
