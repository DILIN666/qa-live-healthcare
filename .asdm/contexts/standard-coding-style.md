# 代码风格标准 — QA Live Healthcare

> 本文档基于项目实际代码归纳而成，所有规则均有对应源码依据。

---

## 1. 总体原则

| 原则 | 说明 |
|------|------|
| 一致性 | 整个项目遵循相同的命名、格式与结构模式 |
| 可读性优先 | 代码意图应自解释，注释说明"为什么"而非"是什么" |
| 单一职责 | 每个组件/函数只做一件事 |
| 渐进增强 | 优先使用项目已有模式，引入新模式需经团队讨论 |

---

## 2. 技术栈约束

| 项 | 选型 | 版本 |
|----|------|------|
| 框架 | Vue 3 | ^3.5.10 |
| 语言 | TypeScript | ^5.5.3 |
| 构建 | Vite | ^5.4.8 |
| UI 库 | Ant Design Vue | ^4.2.6 |
| 路由 | Vue Router | ^4.6.3 |
| 日期 | dayjs | ^1.11.19 |
| 状态管理 | 自定义 Reactive Store | — |

---

## 3. 命名规范

### 3.1 文件命名

| 类型 | 规则 | 示例 |
|------|------|------|
| Vue 页面组件 | PascalCase | `Home.vue`, `DoctorLogin.vue`, `DoctorRoom.vue` |
| Vue 通用组件 | PascalCase | `AppHeader.vue`, `AppFooter.vue` |
| TypeScript 模块 | camelCase | `index.ts`（入口） |
| JSON 数据文件 | kebab-case | `doctor-user-list.json`, `patient-user.json` |
| 目录名 | kebab-case | `views/`, `components/`, `data/`, `store/` |

### 3.2 代码命名

```typescript
// ── 接口 / 类型：PascalCase ──
interface Doctor { ... }
interface Patient { ... }
interface Question { ... }
type Status = 'pending' | 'answered';

// ── 变量 / 函数：camelCase ──
const currentDoctor = computed(() => store.state.currentDoctor);
const submitQuestion = () => { ... };

// ── 常量：camelCase（本项目惯例，非 UPPER_SNAKE_CASE）──
const authRules = { ... };
const authForm = reactive({ ... });

// ── 组件内 ref：camelCase ──
const loading = ref(false);
const answerModalVisible = ref(false);

// ── CSS 类名：kebab-case ──
// .doctor-avatar, .hero-content, .question-card

// ── 路由 name：PascalCase ──
{ path: '/doctor/room/:username', name: 'DoctorRoom', component: DoctorRoom }

// ── 事件处理函数：动词 + 名词 ──
const submitAnswer = () => { ... };
const copyRoomUrl = () => { ... };
const markAsAnswered = (id: string) => { ... };
```

### 3.3 Store 方法命名

| 动作 | 前缀 | 示例 |
|------|------|------|
| 登录/验证 | `login` / `verify` | `loginDoctor()`, `verifyPatient()` |
| 退出 | `logout` | `logoutDoctor()`, `logoutPatient()` |
| 查询 | `get` | `getQuestionsByDoctor()`, `getActiveDoctors()` |
| 添加 | `add` | `addQuestion()` |
| 修改 | `answer` / `mark` | `answerQuestion()`, `markQuestionAsAnswered()` |
| 统计 | `get` | `getStatistics()` |

---

## 4. Vue 组件规范

### 4.1 SFC 结构顺序

所有 `.vue` 文件必须按以下顺序组织，块之间空一行：

```vue
<template>
  <!-- 模板内容 -->
</template>

<script setup lang="ts">
// 脚本内容
</script>

<style scoped>
/* 样式内容 */
</style>
```

> **注意**：`App.vue` 使用 `<style>`（无 `scoped`）定义全局样式，其他所有组件使用 `<style scoped>`。

### 4.2 `<script setup>` 规范

**必须使用** `<script setup lang="ts">`，禁止使用 Options API。

```vue
<!-- ✅ 正确 -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { store } from '../store';

const router = useRouter();
const loading = ref(false);
</script>

<!-- ❌ 错误 -->
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({ ... });
</script>
```

### 4.3 导入顺序

按以下分组排列，组间空一行：

```typescript
// 1. Vue 核心 API
import { ref, reactive, computed, onMounted, watch } from 'vue';

// 2. Vue Router
import { useRouter, useRoute } from 'vue-router';

// 3. 第三方库（Ant Design、dayjs 等）
import { message } from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';

// 4. Ant Design 图标
import {
  UserOutlined,
  LogoutOutlined,
  PlusOutlined
} from '@ant-design/icons-vue';

// 5. 项目内部模块
import { store, Doctor } from '../store';
```

### 4.4 响应式状态

| 场景 | 使用方式 | 示例 |
|------|----------|------|
| 组件局部简单值 | `ref()` | `const loading = ref(false)` |
| 组件局部对象/表单 | `reactive()` | `const formState = reactive({ username: '' })` |
| 派生状态 | `computed()` | `const activeDoctors = computed(() => store.getActiveDoctors())` |
| 全局状态 | `store.state` | `store.state.currentDoctor` |

### 4.5 生命周期

仅使用 `onMounted` 进行初始化逻辑，如路由参数读取和权限检查：

```typescript
onMounted(() => {
  if (!currentDoctor.value || currentDoctor.value.username !== username) {
    message.error('请先登录');
    router.push('/doctor/login');
  }
});
```

---

## 5. TypeScript 规范

### 5.1 类型定义

```typescript
// ── 接口用于数据模型（定义在 store/index.ts 并 export）──
export interface Doctor {
  id: string;
  username: string;
  name: string;
  // ...
}

// ── 联合类型用于有限状态 ──
status: 'pending' | 'answered';

// ── 可空字段使用 | null ──
answer: string | null;
answerTime: string | null;

// ── Omit 用于函数参数类型 ──
addQuestion(question: Omit<Question, 'id' | 'submitTime' | 'status'>): Question;

// ── 函数返回类型显式声明 ──
loginDoctor(username: string, password: string): Doctor | null { ... }
getActiveDoctors(): Doctor[] { ... }
```

### 5.2 类型断言

仅用于 JSON 数据导入时的类型收窄：

```typescript
doctors: doctorData as Doctor[],
```

禁止在其他场景使用 `as` 断言，应使用类型守卫或类型收窄。

### 5.3 禁止 `any`

不允许使用 `any` 类型。若类型不确定，使用 `unknown` 并配合类型守卫。

---

## 6. 路由规范

### 6.1 路由定义

```typescript
const routes: RouteRecordRaw[] = [
  {
    path: '/doctor/room/:username',   // kebab-case 路径，camelCase 参数
    name: 'DoctorRoom',                // PascalCase 名称
    component: DoctorRoom,             // 与 name 一致的组件引用
  },
];
```

### 6.2 导航方式

```typescript
// ── 声明式（模板中）──
<a-button @click="navigateTo('/consultation')">问诊</a-button>

// ── 编程式（脚本中）──
const navigateTo = (path: string) => {
  router.push(path);
};

// ── 带参数导航 ──
router.push(`/doctor/room/${doctor.username}`);
router.push(`/consultation/${doctorUsername}`);
```

### 6.3 路由参数读取

```typescript
const route = useRoute();
const username = route.params.username as string;   // 直接断言为 string
const doctorUsername = route.params.doctorUsername as string;
```

---

## 7. 样式规范

### 7.1 核心规则

| 规则 | 说明 |
|------|------|
| 作用域 | 所有页面/组件使用 `<style scoped>`，仅 `App.vue` 使用全局样式 |
| 预处理器 | 纯 CSS，不使用 Sass/Less/Stylus |
| 类名格式 | kebab-case：`.doctor-avatar`、`.hero-content` |
| BEM | **不使用** BEM，使用扁平的语义化类名 |

### 7.2 布局模式

```css
/* ── 页面容器：固定最大宽度 + 居中 ── */
.container,
.room-container,
.consultation-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

/* ── 页面顶部偏移：为固定 Header 留空间 ── */
.page-wrapper {
  min-height: calc(100vh - 64px);
  padding-top: 64px;
}

/* ── 网格布局：统一使用 CSS Grid ── */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

/* ── 响应式断点：768px ── */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
```

### 7.3 设计令牌（Design Tokens）

```css
/* ── 主题色 ── */
--primary: #1890ff;        /* Ant Design 蓝 */
--success: #52c41a;        /* 成功绿 */
--gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* ── 文本色 ── */
--text-primary: #333;
--text-secondary: #666;
--text-muted: #999;

/* ── 背景色 ── */
--bg-page: #f0f2f5;
--bg-card: #fff;
--bg-section: #fafafa;

/* ── 圆角 ── */
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;

/* ── 阴影 ── */
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
```

### 7.4 交互动效

```css
/* ── 卡片悬停：统一上移 + 阴影加深 ── */
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

/* ── 过渡时间统一 ── */
transition: all 0.3s;
```

---

## 8. Store 规范

### 8.1 结构

```typescript
// store/index.ts 单文件模式

// 1. 导入
import { reactive } from 'vue';
import doctorData from '../data/doctor-user-list.json';

// 2. 接口定义（export）
export interface Doctor { ... }
export interface Patient { ... }
export interface Question { ... }

// 3. State 接口（不 export）
interface State { ... }

// 4. 创建响应式 state
const state = reactive<State>({ ... });

// 5. 导出 store 对象
export const store = {
  state,
  // 方法...
};
```

### 8.2 方法签名

```typescript
// ── 返回值类型必须显式声明 ──
loginDoctor(username: string, password: string): Doctor | null { ... }
getActiveDoctors(): Doctor[] { ... }
getStatistics() { ... }   // 简单返回对象可省略

// ── 使用 Omit 简化创建参数 ──
addQuestion(question: Omit<Question, 'id' | 'submitTime' | 'status' | 'answer' | 'answerTime'>): Question { ... }

// ── ID 生成：前缀 + Date.now() ──
id: `patient${Date.now()}`
id: `q${Date.now()}`
```

---

## 9. 格式化规则

| 项 | 规则 | 示例 |
|----|------|------|
| 缩进 | 2 空格 | `if (condition) {` |
| 分号 | 使用分号 | `const name = 'test';` |
| 引号 | 单引号 | `const path = '/consultation';` |
| 模板字符串 | 含插值时使用 | `` `Hello ${name}` `` |
| 行宽 | 建议不超过 120 字符 | — |
| 尾随逗号 | 对象/数组最后一项不加 | `{ a: 1, b: 2 }` |
| 空行 | 导入分组间空一行；逻辑段落间空一行 | — |
| 箭头函数 | 单参数不加括号 | `d => d.isActive` |
| 组件引用 | 在模板中使用 kebab-case | `<app-header />` |

---

## 10. 注释规范

### 10.1 何时注释

- 解释 **为什么**，而非做什么
- 复杂业务逻辑的说明
- 临时方案或 workaround 的标注
- 公共 API / Store 方法的 JSDoc

### 10.2 注释风格

```typescript
/**
 * 验证患者身份，不存在则自动创建
 * @param name 患者姓名
 * @param birthday 出生日期 (YYYY-MM-DD)
 * @returns 患者信息
 */
verifyPatient(name: string, birthday: string): Patient { ... }

// 行内注释：解释意图
// 首次输入会自动创建账户
const existingPatientCount = store.state.patients.filter(...).length;
```

---

## 11. Ant Design Vue 使用规范

### 11.1 组件前缀

模板中使用 `a-` 前缀（全局注册模式）：

```vue
<!-- ✅ 正确 -->
<a-button type="primary" @click="submit">提交</a-button>
<a-form :model="form" @finish="onFinish">
  <a-form-item label="姓名" name="name">
    <a-input v-model:value="form.name" />
  </a-form-item>
</a-form>

<!-- ❌ 错误：不使用 AButton 等大写形式 -->
<AButton type="primary">提交</AButton>
```

### 11.2 图标导入

从 `@ant-design/icons-vue` 按需导入：

```typescript
import {
  UserOutlined,
  LogoutOutlined,
  PlusOutlined
} from '@ant-design/icons-vue';
```

### 11.3 消息提示

使用 `message` 工具函数：

```typescript
import { message } from 'ant-design-vue';

message.success('登录成功');
message.error('用户名或密码错误');
```

---

## 12. 异步模拟规范

当前项目为纯前端，异步操作使用 `setTimeout` 模拟延迟：

```typescript
const submitAnswer = () => {
  submitting.value = true;

  setTimeout(() => {
    // 业务逻辑
    store.answerQuestion(selectedQuestion.value.id, answerText.value);
    message.success('回复成功');
    closeAnswerModal();
    submitting.value = false;
  }, 500);  // 统一 500ms 延迟
};
```

> **后端化后** 应替换为 `async/await` + 实际 API 调用。

---

## 13. 错误处理规范

```typescript
// ── 表单验证：手动检查 + message 提示 ──
if (!questionForm.doctorId) {
  message.error('请选择医生');
  return;
}

if (!questionForm.question.trim()) {
  message.error('请输入问题');
  return;
}

// ── 权限检查：onMounted 中重定向 ──
onMounted(() => {
  if (!currentDoctor.value) {
    message.error('请先登录');
    router.push('/doctor/login');
  }
});

// ── API 结果检查 ──
const doctor = store.loginDriver(username, password);
if (doctor) {
  // 成功
} else {
  message.error('用户名或密码错误');
}
```

---

## 14. 禁止事项

| 禁止 | 原因 | 替代方案 |
|------|------|----------|
| 使用 `any` 类型 | 丧失类型安全 | `unknown` + 类型守卫 |
| 使用 Options API | 与项目风格不一致 | `<script setup>` + Composition API |
| 使用 Vuex/Pinia | 项目使用自定义 Store | 扩展现有 `store/index.ts` |
| 使用 CSS 预处理器 | 项目使用纯 CSS | 继续使用纯 CSS |
| 使用 BEM 命名 | 项目使用扁平 kebab-case | 语义化 kebab-case |
| 内联样式 | 难以维护 | `<style scoped>` + 类名 |
| `console.log` | 生产环境不应残留 | `message` 提示或移除 |
| 硬编码中文字符串散落 | 不利于国际化 | 集中管理（后续） |

---

## 15. 编辑器配置建议

```ini
# .editorconfig
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.vue]
indent_size = 2
```

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "prettier.semi": true,
  "prettier.singleQuote": true,
  "prettier.tabWidth": 2,
  "prettier.trailingComma": "none"
}
```

---

## 16. 代码审查清单

- [ ] 使用 `<script setup lang="ts">` 且无 Options API
- [ ] 所有公共函数有显式返回类型
- [ ] 无 `any` 类型
- [ ] 导入按分组排列且无未使用导入
- [ ] CSS 使用 `<style scoped>` + kebab-case 类名
- [ ] 响应式状态使用正确的 API（`ref` / `reactive` / `computed`）
- [ ] 异步操作使用 `setTimeout` 模拟（后端化后替换为 `async/await`）
- [ ] 错误提示使用 `message.error()` 而非 `console.log`
- [ ] 路由路径 kebab-case、名称 PascalCase
- [ ] 新增 Store 方法遵循命名规范（`get`/`add`/`login`/`logout` 前缀）
