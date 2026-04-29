# 编码规范 - 在线医疗咨询平台

## 语言

本文档使用 **简体中文** 编写，所有代码注释和文档均使用中文。

---

## 1. TypeScript 编码规范

### 1.1 类型定义

```typescript
// ✅ 推荐：使用 interface 定义数据结构
export interface Doctor {
  id: string;
  username: string;
  name: string;
  isActive: boolean;
}

// ✅ 推荐：使用 type 定义联合类型或别名
export type QuestionStatus = 'pending' | 'answered';

// ❌ 避免：使用 any 类型
let data: any; // 不推荐

// ✅ 替代方案：unknown + 类型守卫
let data: unknown;
if (typeof data === 'string') {
  console.log(data.toUpperCase());
}
```

### 1.2 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 变量/函数 | camelCase | `getUserById`, `isActive` |
| 类/接口 | PascalCase | `UserService`, `Doctor` |
| 常量 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| 文件名 | kebab-case | `doctor-service.ts` |
| Vue 组件 | PascalCase | `DoctorCard.vue` |
| TypeScript 类型/接口 | PascalCase | `DoctorInfo`, `QuestionItem` |
| 枚举成员 | PascalCase | `QuestionStatus.Pending` |

### 1.3 函数定义

```typescript
// ✅ 推荐：使用箭头函数和显式返回类型
const getDoctorByUsername = (username: string): Doctor | undefined => {
  return state.doctors.find(d => d.username === username);
};

// ✅ 推荐：接口方法定义
interface StoreInterface {
  loginDoctor(username: string, password: string): Doctor | null;
  logoutDoctor(): void;
}

// ✅ 推荐：函数重载处理多种参数组合
function parseQuery(query: string): Record<string, string>;
function parseQuery(query: string[]): Record<string, string>;
function parseQuery(query: string | string[]): Record<string, string> {
  // 实现
}
```

### 1.4 泛型使用

```typescript
// ✅ 推荐：使用泛型约束
function getItem<T extends { id: string }>(items: T[], id: string): T | undefined {
  return items.find(item => item.id === id);
}

// ✅ 推荐：使用泛型接口
interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}
```

### 1.5 类型守卫与断言

```typescript
// ✅ 推荐：使用类型守卫
function isDoctor(obj: unknown): obj is Doctor {
  return typeof obj === 'object' && obj !== null && 'username' in obj;
}

// ✅ 推荐：使用 satisfies 运算符（TS 4.9+）
const config = {
  endpoint: 'https://api.example.com',
  timeout: 5000,
} satisfies Record<string, string | number>;
```

---

## 2. Vue 3 编码规范

### 2.1 组件结构 (Composition API)

```vue
<template>
  <!-- 模板内容 -->
</template>

<script setup lang="ts">
// 1. 导入
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

// 2. 类型定义
interface Props {
  title: string;
}

// 3. Props 定义
const props = defineProps<Props>();

// 4. Emits 定义
const emit = defineEmits<{
  (e: 'update', value: string): void;
}>();

// 5. Composables 使用
// import { useAuth } from '@/composables/useAuth';

// 6. 响应式数据
const count = ref(0);

// 7. 计算属性
const doubled = computed(() => count.value * 2);

// 8. 方法
const increment = () => {
  count.value++;
};

// 9. 生命周期钩子
// onMounted(() => { });
</script>

<style scoped>
/* 样式内容 */
</style>
```

### 2.2 组件命名

- **PascalCase** 用于 `.vue` 文件名：`DoctorCard.vue`
- **kebab-case** 用于模板引用：`<doctor-card />`
- 组件名应使用两个以上单词（避免与 HTML 元素冲突）：`DoctorCard` 而非 `Card`

### 2.3 Props 定义规范

```typescript
// ✅ 推荐：使用 withDefaults 提供默认值
interface Props {
  title: string;
  count?: number;
  items?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
  items: () => [],
});

// ✅ 推荐：使用泛型定义复杂 Props
interface TableColumn<T = unknown> {
  key: keyof T;
  label: string;
}
```

### 2.4 响应式数据规范

```typescript
// ✅ 推荐：ref 用于基本类型
const count = ref(0);
const name = ref('');

// ✅ 推荐：reactive 用于对象
const form = reactive({
  username: '',
  password: '',
});

// ❌ 避免：reactive 解构丢失响应性
const { username } = reactive({ username: '', password: '' });

// ✅ 正确：使用 toRefs 保持响应性
import { toRefs } from 'vue';
const { username, password } = toRefs(reactive({ username: '', password: '' }));
```

### 2.5 生命周期钩子使用

| 钩子 | 用途 |
|------|------|
| `onMounted` | DOM 初始化、第三方库实例化 |
| `onUpdated` | DOM 更新后执行（谨慎使用） |
| `onUnmounted` | 清理定时器、移除事件监听 |
| `onBeforeMount` | 渲染前数据准备 |
| `watchEffect` | 响应式依赖的副作用处理 |

---

## 3. CSS / SCSS 样式规范

### 3.1 样式规范

```vue
<style scoped>
/* ✅ 推荐：使用 scoped 作用域 */
.card {
  padding: 16px;
}

/* ✅ 推荐：使用有意义的类名 */
.hero-section { }
.statistics-grid { }
.patient-card { }

/* ✅ 推荐：响应式设计 */
@media (max-width: 768px) {
  .hero { flex-direction: column; }
}

/* ✅ 推荐：使用 CSS 变量 */
:root {
  --primary-color: #1890ff;
  --border-radius: 8px;
}
</style>
```

### 3.2 类名命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 布局类 | `layout-*` | `layout-header`, `layout-sidebar` |
| 组件类 | `component-*` | `component-button`, `component-modal` |
| 状态类 | `is-*` / `has-*` | `is-active`, `has-error` |
| 修饰类 | `--*` | `--primary`, `--danger` |

### 3.3 样式顺序

```scss
.selector {
  // 1. 定位
  position: absolute;
  top: 0;

  // 2. 盒模型
  display: flex;
  width: 100px;
  padding: 10px;
  margin: 5px;

  // 3. 文字
  font-size: 14px;
  color: #333;

  // 4. 背景边框
  background: #fff;
  border: 1px solid #ddd;

  // 5. 其他
  opacity: 1;
}
```

---

## 4. 项目特定规范

### 4.1 状态管理 (Store)

项目使用 Vue 3 `reactive` 实现简单状态管理：

```typescript
// src/store/index.ts
import { reactive } from 'vue';
import doctorData from '../data/doctor-user-list.json';

interface State {
  doctors: Doctor[];
  currentDoctor: Doctor | null;
}

const state = reactive<State>({
  doctors: doctorData as Doctor[],
  currentDoctor: null,
});

export const store = {
  state,
  // 方法...
};
```

**使用规范：**
- 在组件中通过 `import { store } from '@/store'` 导入
- 使用 `store.getXxx()` 方法访问数据
- 不直接修改 `store.state`，通过方法操作

### 4.2 路由定义

```typescript
// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'), // 懒加载
  },
];
```

### 4.3 图标使用

使用 Ant Design Vue 图标库：

```typescript
import {
  CheckCircleOutlined,
  TeamOutlined,
  UserOutlined
} from '@ant-design/icons-vue';
```

---

## 5. Git 提交规范

```
<type>(<scope>): <subject>

# 示例
feat(consultation): 添加在线咨询功能
fix(doctor): 修复医生登录验证问题
docs(readme): 更新项目文档
style(home): 调整首页样式
refactor(store): 重构状态管理模块
```

**Type 类型：**
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `test`: 测试
- `chore`: 构建/工具

---

## 6. 文件组织规范

```
src/
├── assets/           # 静态资源（图片、字体等）
├── components/       # 公共组件（全局复用）
│   ├── AppHeader.vue
│   └── AppFooter.vue
├── data/             # JSON 数据文件
├── router/           # 路由配置
├── store/            # 状态管理
├── views/            # 页面视图（路由组件）
├── App.vue           # 根组件
├── main.ts           # 入口文件
└── style.css         # 全局样式
```

---

## 7. 错误处理规范

### 7.1 同步错误处理

```typescript
// ✅ 推荐：使用 try-catch 捕获同步错误
try {
  const result = dangerousOperation();
  return result;
} catch (error) {
  console.error('操作失败:', error);
  throw new Error('操作失败，请稍后重试');
}
```

### 7.2 异步错误处理

```typescript
// ✅ 推荐：async/await 配合 try-catch
async function fetchDoctor(id: string): Promise<Doctor> {
  try {
    const response = await api.getDoctor(id);
    return response.data;
  } catch (error) {
    console.error('获取医生信息失败:', error);
    throw error;
  }
}
```

### 7.3 错误边界

```typescript
// ✅ 推荐：定义统一错误类型
interface AppError {
  code: string;
  message: string;
  details?: unknown;
}

const ErrorCodes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
} as const;
```

---

## 8. API 设计规范

### 8.1 API 请求规范

```typescript
// ✅ 推荐：统一请求封装
interface ApiRequest<T = unknown> {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  params?: T;
  headers?: Record<string, string>;
}

// ✅ 推荐：统一响应格式
interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  message: string;
  timestamp: number;
}
```

### 8.2 API 命名规范

| 操作 | 方法 | 示例 |
|------|------|------|
| 获取列表 | GET | `GET /doctors` |
| 获取单个 | GET | `GET /doctors/:id` |
| 创建 | POST | `POST /questions` |
| 更新 | PUT | `PUT /questions/:id` |
| 删除 | DELETE | `DELETE /questions/:id` |

---

## 9. 性能优化规范

### 9.1 组件优化

```typescript
// ✅ 推荐：使用 v-memo 优化列表渲染
<div v-memo="[item.id === selectedId]">
  <!-- 仅在 selectedId 变化时更新 -->
</div>

// ✅ 推荐：使用 shallowRef 优化大数据
const largeData = shallowRef<DataType[]>([]);

// ✅ 推荐：避免在模板中使用复杂计算
// ❌ 避免
<template>
  <div>{{ list.filter(item => item.active).map(item => item.name).join(',') }}</div>
</template>

// ✅ 正确：使用计算属性
const activeNames = computed(() =>
  list.value.filter(item => item.active).map(item => item.name).join(',')
);
```

### 9.2 异步组件

```typescript
// ✅ 推荐：路由懒加载
const routes = [
  {
    path: '/doctors',
    component: () => import('../views/Doctors.vue'),
  },
];

// ✅ 推荐：异步组件
const AsyncDoctorCard = defineAsyncComponent({
  loader: () => import('./DoctorCard.vue'),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorBoundary,
});
```

---

## 10. 注释规范

### 10.1 函数注释

```typescript
/**
 * 根据用户名获取医生信息
 * @param username - 医生用户名
 * @returns 医生信息，如果未找到返回 undefined
 */
function getDoctorByUsername(username: string): Doctor | undefined {
  return state.doctors.find(d => d.username === username);
}
```

### 10.2 类型注释

```typescript
// ✅ 推荐：为复杂类型添加 JSDoc
/**
 * 医生用户信息
 * @property id - 唯一标识符
 * @property username - 登录用户名
 * @property name - 显示名称
 * @property isActive - 是否在线
 */
interface Doctor {
  id: string;
  username: string;
  name: string;
  isActive: boolean;
}
```

### 10.3 TODO 注释

```typescript
// TODO(username): 待完成功能描述
// FIXME(username): 需要修复的问题
// HACK(username): 临时解决方案
```

---

## 11. 测试规范（预留）

### 11.1 单元测试规范

```typescript
// ✅ 推荐：测试文件命名
// doctor.test.ts -> __tests__/doctor.test.ts

describe('Doctor Store', () => {
  it('should get doctor by username', () => {
    const doctor = store.getDoctorByUsername('zhang_san');
    expect(doctor).toBeDefined();
  });
});
```

---

## 12. 代码质量检查

```bash
# 类型检查
npm run build

# 预览构建结果
npm run preview

# 类型检查（单独运行）
npx vue-tsc --noEmit
```

---

*最后更新：2026-04-29*
