# 标准项目结构文档

## 1. 概述

本项目为**在线医疗咨询平台（qa-live-healthcare）**，基于 Vue 3 + TypeScript 构建，采用渐进式框架设计理念，为患者提供与医生在线咨询的服务平台。

### 1.1 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 前端框架 | Vue | ^3.4.0 |
| 语言 | TypeScript | ^5.0.0 |
| 构建工具 | Vite | ^5.0.0 |
| UI 框架 | Ant Design Vue | ^4.0.0 |
| 路由管理 | vue-router | ^4.0.0 |
| 状态管理 | Pinia | ^2.0.0 |
| 日期处理 | dayjs | ^1.11.0 |

### 1.2 目录结构概览

```
qa-live-healthcare/
├── public/                     # 静态资源目录
│   └── favicon.svg             # 网站图标
├── src/                        # 源代码目录
│   ├── assets/                 # 资源文件（图片、字体等）
│   ├── components/             # 公共组件
│   ├── data/                   # 静态 JSON 数据
│   ├── router/                 # 路由配置
│   ├── store/                  # 状态管理
│   ├── views/                  # 页面视图
│   ├── App.vue                 # 根组件
│   ├── main.ts                 # 入口文件
│   ├── style.css               # 全局样式
│   └── vite-env.d.ts           # Vite 类型声明
├── .asdm/                      # ASDM 工具集配置
│   ├── contexts/               # 上下文文件（本文档所在目录）
│   └── toolsets/               # 工具集存储目录
├── index.html                  # HTML 入口
├── package.json                # 项目依赖配置
├── tsconfig.json               # TypeScript 基础配置
├── tsconfig.app.json           # TypeScript 应用配置
├── tsconfig.node.json          # TypeScript Node 配置
├── vite.config.ts              # Vite 构建配置
└── README.md                   # 项目说明文档
```

## 2. 目录规范

### 2.1 `src/assets/` — 静态资源

用于存放不可通过构建工具处理的静态文件，如图片、字体等。构建时会被复制到输出目录。

```
src/assets/
└── vue.svg                     # Vue 官方 Logo
```

**规范：**
- 图片文件统一使用 `png`、`jpg`、`jpeg`、`svg`、`gif` 格式
- 大尺寸图片建议压缩后放入此目录
- 较大的二进制资源建议使用 CDN 引入

### 2.2 `src/components/` — 公共组件

用于存放项目全局复用的 Vue 组件，与具体业务无关。

```
src/components/
├── AppHeader.vue               # 全局页头组件（导航栏）
├── AppFooter.vue               # 全局页脚组件
└── HelloWorld.vue              # 示例/欢迎组件
```

**规范：**
- 组件名称使用 PascalCase（如 `AppHeader.vue`）
- 组件文件名应清晰表达组件功能
- 仅放置全局通用组件，业务组件应放在 `views/` 中或单独的业务目录
- 组件内部使用 `<script setup lang="ts">` 语法

### 2.3 `src/data/` — 静态数据

用于存放模拟数据或配置文件，以 JSON 格式管理。

```
src/data/
├── doctor-user-list.json        # 医生用户列表
└── question-list.json           # 问题列表
```

**规范：**
- 文件名使用 kebab-case + JSON 后缀
- 数据结构需符合 TypeScript 接口定义
- 避免在此目录存放敏感信息

### 2.4 `src/router/` — 路由配置

统一管理项目路由规则。

```
src/router/
└── index.ts                     # 路由配置及路由表定义
```

**规范：**
- 使用 `createRouter` + `createWebHistory` 模式
- 路由表统一导出，懒加载页面组件
- 路由路径使用 kebab-case（如 `/doctor-room`）
- 路由命名使用 PascalCase（如 `DoctorRoom`）

### 2.5 `src/store/` — 状态管理

使用 Pinia 进行全局状态管理。

```
src/store/
└── index.ts                     # Store 定义
```

**规范：**
- 使用 `defineStore` 定义 Store
- 按业务模块划分 State、Getters、Actions
- 避免在 Store 中直接操作 DOM

### 2.6 `src/views/` — 页面视图

按路由划分的业务页面组件。

```
src/views/
├── Home.vue                     # 首页
├── Consultation.vue              # 咨询页面（患者提问）
├── Doctors.vue                  # 医生列表页面
├── DoctorLogin.vue               # 医生登录页面
├── DoctorRoom.vue                # 医生诊室页面
└── About.vue                    # 关于页面
```

**规范：**
- 页面组件文件名与路由路径保持一致
- 每个页面应有明确的职责，避免过度耦合
- 复杂页面可拆分多个子组件

### 2.7 根目录文件说明

| 文件 | 用途 |
|------|------|
| `index.html` | 应用入口 HTML，提供 `#app` 挂载点 |
| `main.ts` | Vue 应用初始化、挂载及全局配置 |
| `App.vue` | 根组件，处理全局布局和路由视图 |
| `style.css` | 全局样式文件 |
| `vite-env.d.ts` | Vite 环境类型声明 |

## 3. 命名规范

### 3.1 文件命名

| 类型 | 规范 | 示例 |
|------|------|------|
| Vue 组件 | PascalCase | `DoctorRoom.vue` |
| TypeScript 文件 | camelCase | `index.ts`、`router.ts` |
| 配置文件 | kebab-case | `vite.config.ts` |
| JSON 数据文件 | kebab-case | `doctor-user-list.json` |

### 3.2 目录命名

- 所有目录名统一使用 **kebab-case**（如 `doctor-room`）
- 业务模块目录可使用 PascalCase（如 `DoctorModule`）

### 3.3 代码命名

| 类型 | 规范 | 示例 |
|------|------|------|
| 变量/函数 | camelCase | `doctorName`、`getDoctorList()` |
| 常量 | UPPER_SNAKE_CASE | `MAX_PAGE_SIZE` |
| 类/接口/类型 | PascalCase | `DoctorInfo`、`QuestionStatus` |
| 组件名 | PascalCase | `AppHeader`、`ConsultationList` |

## 4. 路由规范

### 4.1 路由命名与路径

| 页面 | 路径 | 命名 | 说明 |
|------|------|------|------|
| 首页 | `/` | `Home` | 应用首页 |
| 咨询 | `/consultation/:username` | `Consultation` | 医生咨询页（动态用户名） |
| 医生列表 | `/doctors` | `Doctors` | 所有医生列表 |
| 医生登录 | `/doctor-login` | `DoctorLogin` | 医生登录入口 |
| 医生诊室 | `/doctor-room/:username` | `DoctorRoom` | 医生工作台（动态用户名） |
| 关于 | `/about` | `About` | 关于我们 |

### 4.2 路由参数规范

- **路径参数**：使用冒号前缀（如 `:username`）
- **查询参数**：使用标准 URL 查询字符串
- **参数命名**：使用 camelCase 或 kebab-case

## 5. 组件开发规范

### 5.1 组件模板

```vue
<script setup lang="ts">
// 导入
import { ref, computed, onMounted } from 'vue'

// Props 定义
interface Props {
  title?: string
}
const props = withDefaults(defineProps<Props>(), {
  title: '默认标题'
})

// Emits 定义
const emit = defineEmits<{
  (e: 'update', value: string): void
}>()

// 响应式数据
const count = ref(0)

// 计算属性
const doubled = computed(() => count.value * 2)

// 方法
function increment() {
  count.value++
  emit('update', String(count.value))
}

// 生命周期
onMounted(() => {
  console.log('组件已挂载')
})
</script>

<template>
  <div class="component-wrapper">
    <h2>{{ props.title }}</h2>
    <p>Count: {{ count }}, Doubled: {{ doubled }}</p>
    <button @click="increment">增加</button>
  </div>
</template>

<style scoped>
.component-wrapper {
  padding: 16px;
}
</style>
```

### 5.2 组件通信

| 方式 | 适用场景 |
|------|----------|
| Props / Emits | 父子组件通信 |
| Pinia Store | 跨组件共享状态 |
| 路由传参 | 页面间数据传递 |

## 6. 状态管理规范

### 6.1 Store 结构

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useStoreName = defineStore('storeName', () => {
  // State
  const list = ref<any[]>([])
  const loading = ref(false)

  // Getters
  const itemCount = computed(() => list.value.length)

  // Actions
  async function fetchData() {
    loading.value = true
    try {
      // 获取数据逻辑
    } finally {
      loading.value = false
    }
  }

  return { list, loading, itemCount, fetchData }
})
```

## 7. 扩展目录建议

随着项目规模增长，建议按需增加以下目录结构：

| 目录 | 用途 |
|------|------|
| `src/api/` | 统一管理 API 接口调用 |
| `src/utils/` | 工具函数（如格式化、验证） |
| `src/types/` | 全局 TypeScript 类型定义 |
| `src/hooks/` | 组合式函数（Composables）复用逻辑 |
| `src/constants/` | 全局常量定义 |
| `src/plugins/` | Vue 插件配置 |
| `src/directives/` | 自定义指令 |
| `tests/` | 单元测试文件 |

> 当前项目处于 MVP 阶段，以上目录尚未创建，后续迭代时可按需扩展。

## 8. 构建与部署

### 8.1 开发环境

```bash
npm install
npm run dev
```

### 8.2 生产构建

```bash
npm run build
```

构建产物输出至 `dist/` 目录。

### 8.3 预览构建结果

```bash
npm run preview
```
