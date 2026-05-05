# 标准项目结构

## 概述
本文档定义了 QA Live Healthcare 工作区的标准项目结构，提供文件和目录组织指南，确保项目一致性和可维护性。

## 项目结构总览

```
qa-live-healthcare/
├── .asdm/                              # ASDM 配置与工具集
│   ├── contexts/                       # AI 模型上下文文件
│   │   ├── index.md                    # 上下文索引
│   │   ├── data-models.md             # 数据模型文档
│   │   ├── standard-project-structure.md  # 本文档
│   │   ├── standard-coding-style.md   # 编码标准
│   │   ├── deployment.md              # 部署配置
│   │   ├── api.md                     # API 文档
│   │   └── architecture.md            # 架构文档
│   └── toolsets/                       # 已安装 ASDM 工具集
│       ├── basic-tools/
│       ├── context-builder/
│       ├── prd-builder/
│       ├── prototype-builder/
│       └── sample-toolset/
├── .codebuddy/                         # Tencent CodeBuddy 配置
│   └── commands/                       # ASDM 快捷命令
│       ├── asdm-context-build.md
│       └── asdm-context-update.md
├── public/                             # 静态资源（直接复制到构建输出）
│   └── vite.svg                        # Vite 图标
├── src/                                # 源代码（主要开发区域）
│   ├── assets/                         # 静态资源（经构建处理）
│   │   └── vue.svg
│   ├── components/                     # 可复用公共组件
│   │   ├── AppHeader.vue              # 顶部导航栏
│   │   ├── AppFooter.vue              # 底部页脚
│   │   └── HelloWorld.vue             # 示例组件（未使用，可删除）
│   ├── data/                           # 模拟数据
│   │   ├── doctor-user-list.json      # 医生数据
│   │   ├── patient-user.json          # 患者数据
│   │   └── question-list.json         # 问题数据
│   ├── router/                         # 路由配置
│   │   └── index.ts                    # 路由定义与导航守卫
│   ├── store/                          # 状态管理
│   │   └── index.ts                    # 响应式 Store + 接口定义 + 业务逻辑
│   ├── views/                          # 页面视图组件
│   │   ├── Home.vue                    # 首页
│   │   ├── Consultation.vue            # 患者问诊页
│   │   ├── Doctors.vue                 # 医生团队列表页
│   │   ├── DoctorLogin.vue             # 医生登录页
│   │   ├── DoctorRoom.vue              # 医生诊室页
│   │   └── About.vue                   # 关于我们页
│   ├── App.vue                         # 根组件（布局容器）
│   ├── main.ts                         # 应用入口（挂载、插件注册）
│   ├── style.css                       # 全局样式
│   └── vite-env.d.ts                   # Vite 环境类型声明
├── index.html                          # HTML 入口模板
├── package.json                        # 依赖与脚本配置
├── package-lock.json                   # 依赖锁定文件
├── tsconfig.json                       # TypeScript 项目引用配置
├── tsconfig.app.json                   # 应用 TypeScript 编译配置
├── tsconfig.node.json                  # Node 端 TypeScript 编译配置
├── tsconfig.app.tsbuildinfo            # 应用构建信息缓存
├── tsconfig.node.tsbuildinfo           # Node 构建信息缓存
├── vite.config.ts                      # Vite 构建配置
└── README.md                           # 项目说明
```

## 目录详细说明

### `src/` — 源代码目录

所有应用代码均在此目录下，按职责划分子目录。

| 子目录 | 用途 | 规范 |
|--------|------|------|
| `assets/` | 静态资源（会被 Vite 构建处理，如 SVG、图片） | 小型资源放此目录；外部图片直接使用 URL |
| `components/` | 可复用的公共组件 | 以 `App` 前缀命名布局组件；每个组件一个 `.vue` 文件 |
| `data/` | JSON 模拟数据文件 | 与 Store 接口对应；仅用于初始化，运行时修改不会回写 |
| `router/` | Vue Router 配置 | 单文件 `index.ts`；路由按路径分组排列 |
| `store/` | 状态管理 | 单文件 `index.ts`；包含接口定义 + 响应式状态 + 业务方法 |
| `views/` | 页面级组件 | 每个路由对应一个 `.vue` 文件；PascalCase 命名 |

### `public/` — 公共静态资源

直接复制到构建输出目录，不经过 Vite 处理。适合不需要哈希命名的固定资源（如 `favicon`）。

### `.asdm/` — ASDM 工具集配置

ASDM（AI First 系统开发方法论）相关文件，由 `asdm` CLI 管理。

- **`contexts/`**: AI 上下文文件，供 AI 模型理解项目
- **`toolsets/`**: 已安装的 ASDM 工具集，不要手动修改

### `.codebuddy/` — CodeBuddy 配置

Tencent CodeBuddy IDE 的配置目录，包含 ASDM 快捷命令。

## 文件命名规范

### Vue 组件文件
| 类型 | 规范 | 示例 |
|------|------|------|
| 页面组件 | PascalCase | `Home.vue`, `DoctorLogin.vue` |
| 布局组件 | App 前缀 + PascalCase | `AppHeader.vue`, `AppFooter.vue` |
| 通用组件 | PascalCase | `HelloWorld.vue` |

### TypeScript 文件
| 类型 | 规范 | 示例 |
|------|------|------|
| 入口文件 | 小写 | `main.ts` |
| 配置/模块 | 小写 kebab-case 或 index | `index.ts`, `vite-env.d.ts` |

### 数据文件
| 类型 | 规范 | 示例 |
|------|------|------|
| JSON 数据 | kebab-case | `doctor-user-list.json`, `question-list.json` |

### 配置文件
| 类型 | 规范 | 示例 |
|------|------|------|
| 项目配置 | 小写 + 点分隔 | `package.json`, `tsconfig.json` |
| Vite 配置 | kebab-case | `vite.config.ts` |

## 新增文件时的目录归属指南

### 新增页面
1. 在 `src/views/` 创建 `.vue` 文件
2. 在 `src/router/index.ts` 添加路由配置
3. 如需模拟数据，在 `src/data/` 添加 JSON 文件

```
示例：新增"健康资讯"页面
1. 创建 src/views/HealthNews.vue
2. 在 src/router/index.ts 添加:
   { path: '/health-news', name: 'HealthNews', component: HealthNews }
3. (可选) 创建 src/data/health-news.json
```

### 新增公共组件
1. 在 `src/components/` 创建 `.vue` 文件
2. 在需要使用的页面中 import

```
示例：新增医生评分组件
1. 创建 src/components/DoctorRating.vue
2. 在页面中: import DoctorRating from '../components/DoctorRating.vue'
```

### 新增数据模型
1. 在 `src/store/index.ts` 中定义 TypeScript 接口
2. 在 `src/data/` 中创建对应的 JSON 初始数据
3. 在 State 接口中添加新字段
4. 在 Store 中添加相关的 CRUD 方法

```
示例：新增"预约"功能
1. 在 src/store/index.ts 添加:
   interface Appointment { ... }
2. 创建 src/data/appointment-list.json
3. 在 State 接口添加: appointments: Appointment[]
4. 在 Store 添加: addAppointment(), getAppointmentsByDoctor() 等
```

### 新增路由
在 `src/router/index.ts` 的 `routes` 数组中添加新路由对象：

```typescript
{
  path: '/新路径',
  name: '路由名称',
  component: () => import('../views/新页面.vue')  // 懒加载
}
```

## 构建产物说明

运行 `npm run build` 后，Vite 将生成以下结构：

```
dist/                                  # 构建输出目录
├── assets/                            # 带 hash 的静态资源
│   ├── index-[hash].js                # 应用 JS
│   ├── index-[hash].css               # 应用 CSS
│   └── [name]-[hash].[ext]            # 其他资源
├── index.html                         # 入口 HTML
└── vite.svg                           # 公共资源（原样复制）
```

## 项目配置文件说明

| 文件 | 用途 | 备注 |
|------|------|------|
| `package.json` | 依赖声明、脚本命令 | `type: "module"` 使用 ES Modules |
| `vite.config.ts` | Vite 构建配置 | 当前仅启用 Vue 插件 |
| `tsconfig.json` | TypeScript 项目引用 | 引用 app 和 node 两个子配置 |
| `tsconfig.app.json` | 应用 TS 编译选项 | target ES2020, strict 模式 |
| `tsconfig.node.json` | Node 端 TS 编译选项 | 用于 vite.config.ts |
| `index.html` | HTML 入口 | Vite 使用此文件作为入口点 |

## 不存在的目录说明

以下目录在同类项目中常见，但本项目当前不需要：

| 目录 | 说明 | 何时添加 |
|------|------|----------|
| `src/composables/` | Vue 3 组合式函数 | 当出现可复用逻辑时提取 |
| `src/utils/` | 工具函数 | 当出现通用工具方法时添加 |
| `src/types/` | 类型定义文件 | 当类型定义过多需要从 store 分离时 |
| `src/styles/` | 样式文件 | 当全局样式复杂需要拆分时 |
| `tests/` | 测试文件 | 引入测试框架时添加 |
| `.github/` | CI/CD 配置 | 引入 GitHub Actions 时添加 |
| `docs/` | 项目文档 | 需要详细开发文档时添加 |

## 最佳实践

### 1. 保持结构扁平
- `src/` 下最多两层子目录
- 避免过深的嵌套结构
- 当前项目规模适合单文件 Store 和 Router

### 2. 关注点分离
- 视图组件（`views/`）负责页面布局和交互
- 公共组件（`components/`）负责可复用 UI 元素
- Store（`store/`）负责数据状态和业务逻辑
- 数据文件（`data/`）负责初始数据

### 3. 遵循 Vue 3 约定
- 使用 `<script setup lang="ts">` 语法
- 组件内样式使用 `<style scoped>`
- 响应式数据使用 `ref` / `reactive` / `computed`

### 4. 随项目演进调整
- 当 `store/index.ts` 过大时，可拆分为多个模块
- 当 `views/` 页面增多时，可按功能模块分组
- 当项目复杂度增加时，可引入 Pinia 替代自定义 Store

---

*本项目结构文档由 Context Builder 工具集维护。当项目结构发生变更时，使用 `/asdm-context-update` 更新。*
