# Task PRD: 路由和导航配置

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号
**Task ID**: TASK-008
**Created Date**: 2026-04-29
**Status**: TODO
**Language**: 简体中文

---

## 1. 任务概述

### 1.1 任务摘要

配置预约挂号功能涉及的路由和导航入口，包括患者端的预约记录页面路由、医生端的预约管理入口，以及相关的路由守卫。

### 1.2 任务目标

- **目标 1**：配置 `/appointments` 路由，指向患者预约记录页
- **目标 2**：配置 `/doctor/appointments/:username` 路由，指向医生预约管理页
- **目标 3**：在 `AppHeader.vue` 添加「我的预约」导航入口
- **目标 4**：在 `DoctorRoom.vue` 添加「预约管理」标签页入口
- **目标 5**：添加必要的路由守卫

### 1.3 关联功能需求

- 功能需求：REQ-003（预约记录查询）
- 关联故事：故事 2、故事 3

---

## 2. 详细需求

### 2.1 功能需求

- **FR-001**：路由配置
  - `/appointments` → `PatientAppointments.vue`（患者端）
  - `/doctor/appointments/:username` → `DoctorAppointments.vue`（医生端）

- **FR-002**：患者端导航
  - 在 `AppHeader.vue` 添加「我的预约」入口
  - 仅在患者已验证身份时显示（currentPatient 不为空）
  - 链接到 `/appointments`

- **FR-003**：医生端导航
  - 在 `DoctorRoom.vue` 添加「预约管理」标签页
  - 显示在现有标签页（待回复问题/已回复问题）旁边
  - 链接到 `/doctor/appointments/:username`
  - 仅在医生已登录时显示

- **FR-004**：路由守卫
  - `/appointments` 需要患者身份验证守卫
  - `/doctor/appointments/:username` 需要医生身份验证守卫

### 2.2 技术需求

- 修改文件：`src/router/index.ts`、`src/components/AppHeader.vue`、`src/views/DoctorRoom.vue`
- 新增页面由 TASK-004 和 TASK-007 提供
- 遵循 `.asdm/contexts/standard-coding-style.md` 中的 Vue 组件规范
- 参考 `.asdm/contexts/standard-project-structure.md` 中的路由规范

### 2.3 约束与限制

- 不修改现有的其他路由配置
- 导航入口样式与现有风格保持一致
- 路由守卫逻辑与现有守卫风格一致

---

## 3. 实现方案

### 3.1 推荐方法

参考项目中现有的路由配置（`src/router/index.ts`）和导航组件（`AppHeader.vue`、`DoctorRoom.vue`）的组织方式，在现有代码基础上进行增量修改。

### 3.2 实现步骤

1. **配置患者路由**：在 `src/router/index.ts` 中添加 `/appointments` 路由
2. **配置医生路由**：添加 `/doctor/appointments/:username` 路由
3. **添加路由守卫**：为新路由添加身份验证守卫
4. **更新 AppHeader**：在 `AppHeader.vue` 中添加「我的预约」链接
5. **更新 DoctorRoom**：在 `DoctorRoom.vue` 中添加「预约管理」标签页
6. **验证**：运行 TypeScript 类型检查和构建

### 3.3 技术注意事项

- 路由守卫检查 `currentPatient` 是否存在，不存在则跳转 `/consultation` 验证
- 路由守卫检查 `currentDoctor` 是否存在，不存在则跳转 `/doctor/login`
- 医生端 URL 参数 `username` 用于获取医生信息，需与登录状态匹配
- 新路由应在路由表中按字母顺序或按功能分组

### 3.4 项目上下文引用

- `.asdm/contexts/standard-project-structure.md` — 路由规范
- `.asdm/contexts/standard-coding-style.md` — Vue 组件规范
- `src/router/index.ts` — 现有路由配置参考
- `src/components/AppHeader.vue` — 导航组件参考
- `src/views/DoctorRoom.vue` — 医生端页面参考

---

## 4. 验收标准

### 4.1 核心标准

- **AC-001**：路由可正常访问
  - 验证工具：访问 `/appointments`
  - 期望结果：页面正常渲染（需要患者身份验证）

- **AC-002**：患者端导航入口显示
  - 验证工具：患者验证后查看 Header
  - 期望结果：「我的预约」链接可见

- **AC-003**：医生端标签页显示
  - 验证工具：医生登录后查看诊室页面
  - 期望结果：「预约管理」标签页可见

- **AC-004**：路由守卫生效
  - 验证工具：未登录时访问 `/appointments`
  - 期望结果：跳转至患者验证页

### 4.2 边界情况

- **BC-001**：医生查看他人预约 → 路由守卫拦截
- **BC-002**：直接访问医生预约页 → 守卫检查用户名匹配

### 4.3 负面测试

- **NC-001**：导航链接 URL 错误 → 404 页面
- **NC-002**：重复点击导航 → 路由重复激活（使用 `replace` 模式）

---

## 5. 依赖关系

### 5.1 任务依赖

- **前置依赖**：TASK-004（预约页面开发）、TASK-005（排班选择组件）、TASK-006（预约表单组件）、TASK-007（医生预约列表页）
- **阻塞任务**：无

### 5.2 外部依赖

- `src/router/index.ts`（现有文件）
- `src/components/AppHeader.vue`（现有文件）
- `src/views/DoctorRoom.vue`（现有文件）
- `src/views/PatientAppointments.vue`（TASK-004 输出）
- `src/views/DoctorAppointments.vue`（TASK-007 输出）

### 5.3 前置条件

- TASK-004 和 TASK-007 完成
- 页面组件已创建

---

## 6. 预估工作量

- **预估工时**：10 分钟
- **复杂度**：低
- **风险**：低

### 6.1 影响工时的因素

- 路由守卫逻辑需要仔细设计
- 导航样式需要与现有风格一致

---

## 7. 测试策略

### 7.1 自动化验证（必需）

- **类型检查**：`tsc --noEmit`
  - 验证路由配置类型正确
  - 退出码 0 表示成功
- **项目构建**：`npm run build`
  - 验证路由配置正确，无编译错误
  - 退出码 0 表示成功

### 7.2 手动测试

- 未登录访问 `/appointments` → 跳转至验证页
- 患者登录后访问 `/appointments` → 正常显示
- 医生登录后访问 `/doctor/appointments/:username` → 正常显示
- 点击 Header「我的预约」 → 跳转正确页面
- 点击 DoctorRoom「预约管理」 → 跳转正确页面

---

## 8. 实施笔记

### 8.1 路由配置示例

```typescript
// src/router/index.ts
{
  path: '/appointments',
  name: 'PatientAppointments',
  component: () => import('../views/PatientAppointments.vue'),
  meta: { requiresPatientAuth: true },
},
{
  path: '/doctor/appointments/:username',
  name: 'DoctorAppointments',
  component: () => import('../views/DoctorAppointments.vue'),
  meta: { requiresDoctorAuth: true },
}
```

### 8.2 AppHeader 导航入口示例

```vue
<!-- AppHeader.vue -->
<template>
  <header>
    <nav>
      <router-link to="/">首页</router-link>
      <router-link to="/consultation">在线咨询</router-link>
      <router-link to="/appointments" v-if="currentPatient">
        我的预约
      </router-link>
    </nav>
  </header>
</template>
```

### 8.3 DoctorRoom 标签页示例

```vue
<!-- DoctorRoom.vue -->
<template>
  <div class="doctor-room">
    <a-tabs v-model:activeKey="activeTab">
      <a-tab-pane key="pending" tab="待回复问题" />
      <a-tab-pane key="answered" tab="已回复问题" />
      <a-tab-pane key="appointments" tab="预约管理" />
    </a-tabs>
    
    <router-view v-if="activeTab === 'appointments'" />
  </div>
</template>
```

---

## 9. 风险与应对

### 风险 1：现有功能回归

- **描述**：修改 AppHeader 和 DoctorRoom 可能影响现有功能
- **影响**：低
- **应对**：仅添加增量代码，不修改现有逻辑

---

## 10. 交付物

- 更新后的 `src/router/index.ts`（新增路由配置）
- 更新后的 `src/components/AppHeader.vue`（新增导航入口）
- 更新后的 `src/views/DoctorRoom.vue`（新增标签页入口）

### 必需交付物：验证结果

- **编译输出**：运行 `tsc --noEmit` 无错误
- **构建输出**：运行 `npm run build` 成功，退出码 0

---

**Task ID**: TASK-008
**Status**: TODO
**Updated**: 2026-04-29
