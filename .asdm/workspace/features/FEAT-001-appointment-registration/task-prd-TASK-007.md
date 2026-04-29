# Task PRD: 医生预约列表页

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号
**Task ID**: TASK-007
**Created Date**: 2026-04-29
**Status**: TODO
**Language**: 简体中文

---

## 1. 任务概述

### 1.1 任务摘要

创建 `DoctorAppointments.vue` 医生预约列表页，让医生可以查看自己所有时段的预约记录，筛选特定日期，并管理患者的到诊状态。

### 1.2 任务目标

- **目标 1**：创建 `/doctor/appointments/:username` 路由对应的页面
- **目标 2**：实现日期筛选器（默认显示今日预约）
- **目标 3**：展示预约表格（患者姓名、时间、联系方式、状态）
- **目标 4**：实现标记到诊/未到诊功能
- **目标 5**：显示统计栏（今日待就诊人数）

### 1.3 关联功能需求

- 功能需求：REQ-003（预约记录查询）、REQ-005（预约状态管理）
- 关联故事：故事 3

---

## 2. 详细需求

### 2.1 功能需求

- **FR-001**：页面布局
  - 页面标题：「预约管理」
  - 日期筛选器（默认当天）
  - 统计栏：今日待就诊人数
  - 预约数据表格

- **FR-002**：日期筛选
  - 日期选择器组件（`a-date-picker`）
  - 默认选中当天
  - 切换日期后刷新列表
  - 支持快速选择：今天、明天

- **FR-003**：预约表格内容
  - 患者姓名
  - 预约时段（日期 + 上午/下午/晚上）
  - 联系电话
  - 就诊备注（如果有）
  - 预约状态
  - 操作列（到诊/未到）

- **FR-004**：到诊管理
  - 「到诊」按钮：调用 `markAppointmentArrived`
  - 「未到」按钮：调用 `markAppointmentNoShow`
  - 操作后更新表格数据
  - 显示成功/失败提示

- **FR-005**：状态统计
  - 统计当日 `status === 'scheduled'` 的预约数量
  - 实时更新（操作后自动刷新）

### 2.2 技术需求

- 页面路径：`src/views/DoctorAppointments.vue`
- 路由路径：`/doctor/appointments/:username`
- 使用 Ant Design Vue `a-table` 组件
- 使用 Day.js 格式化日期
- 调用 `src/store/index.ts` 中的预约查询和状态更新方法
- 遵循 `.asdm/contexts/standard-coding-style.md` 中的 Vue 组件规范

### 2.3 约束与限制

- 需要医生身份验证，仅当前登录医生可查看自己的预约
- 仅 `scheduled` 状态的预约可操作（到诊/未到）
- 表格按预约时间升序排列

---

## 3. 实现方案

### 3.1 推荐方法

参考项目中现有的 `DoctorRoom.vue` 页面的代码风格，创建结构和风格一致的新页面。复用表格、时间选择器等组件的使用方式。

### 3.2 实现步骤

1. **创建页面组件**：在 `src/views/` 下创建 `DoctorAppointments.vue`
2. **获取医生信息**：从 Store 获取当前登录医生
3. **获取预约数据**：调用 `getAppointmentsByDoctor(doctorId)`
4. **实现日期筛选**：通过计算属性过滤指定日期的预约
5. **实现统计栏**：计算当日待就诊人数
6. **实现到诊管理**：在操作列添加按钮，调用对应方法
7. **配置路由**：在 `src/router/index.ts` 添加路由（可放在 TASK-008 中统一处理）
8. **验证**：运行 TypeScript 类型检查和构建

### 3.3 技术注意事项

- 使用 `computed` 按日期过滤预约：`appointments.filter(apt => apt.schedule.date === selectedDate)`
- 表格列使用 `a-table` 的 `customRender` 自定义渲染状态标签和操作按钮
- 到诊/未到操作后，使用 `message.success` 显示提示
- 需要在路由守卫中验证医生身份

### 3.4 项目上下文引用

- `.asdm/contexts/standard-coding-style.md` — Vue 组件规范
- `src/views/DoctorRoom.vue` — 页面风格参考
- `.asdm/workspace/features/FEAT-001-appointment-registration/task-prd-TASK-002.md` — Store API 参考

---

## 4. 验收标准

### 4.1 核心标准

- **AC-001**：页面可正常访问
  - 验证工具：访问 `/doctor/appointments/:username` 路由
  - 期望结果：页面正常渲染，显示预约列表

- **AC-002**：日期筛选功能正确
  - 验证工具：切换日期选择器
  - 期望结果：表格数据随日期变化

- **AC-003**：到诊操作正确
  - 验证工具：点击「到诊」按钮
  - 期望结果：预约状态变为 completed，显示成功提示

- **AC-004**：未到操作正确
  - 验证工具：点击「未到」按钮
  - 期望结果：预约状态变为 no-show，显示成功提示

- **AC-005**：统计栏正确
  - 验证工具：检查统计栏显示
  - 期望结果：显示当日待就诊人数

### 4.2 边界情况

- **BC-001**：医生无预约 → 显示空状态
- **BC-002**：非本人访问 → 路由守卫拦截，跳转登录页
- **BC-003**：已到诊的记录 → 操作列不显示按钮

### 4.3 负面测试

- **NC-001**：无效日期 → 显示空列表
- **NC-002**：快速连续操作 → 防止重复提交

---

## 5. 依赖关系

### 5.1 任务依赖

- **前置依赖**：TASK-002（Store API 扩展）、TASK-003（Mock 数据创建）
- **阻塞任务**：TASK-008（路由和导航配置）依赖本任务的页面组件

### 5.2 外部依赖

- `src/store/index.ts`（TASK-002 输出）
- `src/data/appointment-list.json`（TASK-003 输出）
- Ant Design Vue（项目已有）
- Day.js（项目已有）

### 5.3 前置条件

- TASK-002 和 TASK-003 完成
- `src/views/DoctorAppointments.vue` 文件创建

---

## 6. 预估工作量

- **预估工时**：15 分钟
- **复杂度**：低
- **风险**：低

### 6.1 影响工时的因素

- 表格列的布局和样式需要设计
- 日期过滤逻辑需要仔细实现

---

## 7. 测试策略

### 7.1 自动化验证（必需）

- **类型检查**：`tsc --noEmit`
  - 验证组件类型正确
  - 退出码 0 表示成功
- **项目构建**：`npm run build`
  - 验证页面可正常构建
  - 退出码 0 表示成功

### 7.2 手动测试

- 打开页面，检查今日预约是否显示
- 切换日期，检查数据是否刷新
- 点击「到诊」，检查状态变化
- 点击「未到」，检查状态变化
- 检查统计栏数字是否正确

---

## 8. 实施笔记

### 8.1 实施指导

参考 `DoctorRoom.vue` 中的表格使用方式：

```vue
<template>
  <div class="doctor-appointments">
    <a-card>
      <div class="statistics">
        <span>今日待就诊：{{ todayScheduledCount }} 人</span>
      </div>
      
      <div class="filter-bar">
        <span>筛选日期：</span>
        <a-date-picker v-model:value="selectedDate" @change="handleDateChange" />
      </div>
      
      <a-table :columns="columns" :data-source="filteredAppointments">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ getStatusText(record.status) }}
            </a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <template v-if="record.status === 'scheduled'">
              <a-button size="small" type="primary" @click="handleArrived(record.id)">
                到诊
              </a-button>
              <a-button size="small" danger @click="handleNoShow(record.id)">
                未到
              </a-button>
            </template>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>
```

### 8.2 表格列定义

```typescript
const columns = [
  { title: '患者姓名', dataIndex: 'patientName', key: 'patientName' },
  { title: '预约时间', key: 'scheduleTime', customRender: ... },
  { title: '联系电话', dataIndex: 'phone', key: 'phone' },
  { title: '就诊备注', dataIndex: 'notes', key: 'notes' },
  { title: '状态', key: 'status' },
  { title: '操作', key: 'action' },
];
```

---

## 9. 风险与应对

### 风险 1：路由参数校验

- **描述**：URL 中的 username 与当前登录医生不匹配
- **影响**：低
- **应对**：在路由守卫中检查，未匹配则跳转到正确的 URL

---

## 10. 交付物

- `src/views/DoctorAppointments.vue` — 医生预约列表页组件

### 必需交付物：验证结果

- **编译输出**：运行 `tsc --noEmit` 无错误
- **构建输出**：运行 `npm run build` 成功，退出码 0

---

**Task ID**: TASK-007
**Status**: TODO
**Updated**: 2026-04-29
