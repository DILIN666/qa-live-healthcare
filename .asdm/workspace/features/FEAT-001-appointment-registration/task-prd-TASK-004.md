# Task PRD: 预约页面开发

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号
**Task ID**: TASK-004
**Created Date**: 2026-04-29
**Status**: TODO
**Language**: 简体中文

---

## 1. 任务概述

### 1.1 任务摘要

创建患者预约记录页面 `PatientAppointments.vue`，让患者可以查看和管理自己的所有预约记录，包括按状态筛选、取消待就诊预约等功能。

### 1.2 任务目标

- **目标 1**：创建 `/appointments` 路由对应的页面组件
- **目标 2**：实现 Tabs 切换（全部 / 待就诊 / 已完成 / 已取消）
- **目标 3**：展示预约卡片，显示医生、科室、时间、状态
- **目标 4**：实现取消预约功能（仅限待就诊）
- **目标 5**：空状态友好提示

### 1.3 关联功能需求

- 功能需求：REQ-003（预约记录查询）、REQ-004（取消预约）
- 关联故事：故事 2

---

## 2. 详细需求

### 2.1 功能需求

- **FR-001**：页面布局
  - 页面标题：「我的预约」
  - Tabs 切换栏：全部 / 待就诊 / 已完成 / 已取消
  - 预约卡片列表（按预约时间倒序排列）

- **FR-002**：预约卡片内容
  - 医生姓名和头像
  - 科室名称
  - 预约日期和时间段
  - 预约状态标签（不同状态不同颜色）
  - 取消按钮（仅「待就诊」状态显示）

- **FR-003**：取消预约功能
  - 点击取消按钮后弹出确认对话框
  - 确认后调用 `cancelAppointment` 方法
  - 取消成功后刷新列表
  - 显示成功提示

- **FR-004**：状态筛选
  - 全部：显示患者所有预约
  - 待就诊：status === 'scheduled'
  - 已完成：status === 'completed'
  - 已取消：status === 'cancelled'

- **FR-005**：空状态处理
  - 无预约时显示空状态插图和提示文字
  - 「暂无预约记录」

### 2.2 技术需求

- 页面路径：`src/views/PatientAppointments.vue`
- 路由路径：`/appointments`
- 复用项目现有的 Ant Design Vue 组件风格
- 使用 `Day.js` 格式化日期显示
- 调用 `src/store/index.ts` 中 TASK-002 扩展的方法
- 遵循 `.asdm/contexts/standard-coding-style.md` 中的 Vue 组件规范

### 2.3 约束与限制

- 需要患者身份验证，未验证时提示去验证
- 不能取消已完成或已取消的预约
- 页面需处理加载状态

---

## 3. 实现方案

### 3.1 推荐方法

参考项目中现有的 `Consultation.vue` 和 `Doctors.vue` 页面的代码风格和组件使用方式，创建结构和风格一致的新页面。

### 3.2 实现步骤

1. **创建页面组件**：在 `src/views/` 下创建 `PatientAppointments.vue`
2. **导入依赖**：导入 Store 方法、Day.js、Ant Design Vue 组件
3. **获取患者预约**：在 `onMounted` 时调用 `getAppointmentsByPatient`
4. **实现状态筛选**：通过计算属性 `filteredAppointments` 实现
5. **实现取消功能**：添加取消确认对话框，调用 `cancelAppointment`
6. **实现空状态**：使用 `a-empty` 组件
7. **配置路由**：在 `src/router/index.ts` 添加路由（可放在 TASK-008 中统一处理）
8. **验证**：运行 TypeScript 类型检查和构建

### 3.3 技术注意事项

- 使用 `computed` 计算属性实现状态筛选，避免重复过滤逻辑
- 取消成功后，使用 `message.success` 显示提示
- 日期格式化：`dayjs(date).format('YYYY-MM-DD')`
- 时段显示转换：morning → 上午，afternoon → 下午，evening → 晚上

### 3.4 项目上下文引用

- `.asdm/contexts/standard-coding-style.md` — Vue 组件规范
- `.asdm/contexts/standard-project-structure.md` — 页面文件规范
- `src/views/Consultation.vue` — 页面风格参考
- `src/views/Doctors.vue` — 页面风格参考

---

## 4. 验收标准

### 4.1 核心标准

- **AC-001**：页面可正常访问
  - 验证工具：访问 `/appointments` 路由
  - 期望结果：页面正常渲染，无 404 或错误

- **AC-002**：Tabs 切换功能正确
  - 验证工具：点击不同 Tab，检查列表内容变化
  - 期望结果：每个 Tab 显示对应状态的预约

- **AC-003**：预约卡片信息完整
  - 验证工具：查看卡片显示内容
  - 期望结果：包含医生姓名、科室、日期、时段、状态

- **AC-004**：取消预约功能正确
  - 验证工具：点击取消按钮，确认后检查列表
  - 期望结果：预约从列表消失（进入「已取消」Tab），名额释放

- **AC-005**：已完成/已取消不可取消
  - 验证工具：查看卡片，不应显示取消按钮
  - 期望结果：取消按钮仅在「待就诊」状态下显示

### 4.2 边界情况

- **BC-001**：患者未验证身份 → 显示提示，引导去验证
- **BC-002**：网络延迟 → 显示 loading 状态
- **BC-003**：取消失败 → 显示错误提示，不关闭对话框

### 4.3 负面测试

- **NC-001**：无预约时 → 显示空状态，不崩溃
- **NC-002**：快速连续取消 → 防止重复提交

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
- `src/views/PatientAppointments.vue` 文件创建

---

## 6. 预估工作量

- **预估工时**：20 分钟
- **复杂度**：中
- **风险**：低

### 6.1 影响工时的因素

- 需要与项目现有 UI 风格保持一致，可能需要参考现有页面
- 取消确认对话框的交互逻辑需要设计

---

## 7. 测试策略

### 7.1 自动化验证（必需）

- **类型检查**：`tsc --noEmit`
  - 验证组件中所有类型正确
  - 退出码 0 表示成功
- **项目构建**：`npm run build`
  - 验证页面可正常构建
  - 退出码 0 表示成功

### 7.2 手动测试

- 打开 `/appointments` 页面，检查预约列表是否显示
- 切换 Tab，检查筛选是否正确
- 点击取消，确认后检查预约状态变化
- 检查名额是否正确释放（TASK-002 验证）

---

## 8. 实施笔记

### 8.1 实施指导

参考 `Consultation.vue` 中的组件使用方式：

```vue
<template>
  <div class="patient-appointments">
    <h1>我的预约</h1>
    <a-tabs v-model:activeKey="activeTab">
      <a-tab-pane key="all" tab="全部" />
      <a-tab-pane key="scheduled" tab="待就诊" />
      <a-tab-pane key="completed" tab="已完成" />
      <a-tab-pane key="cancelled" tab="已取消" />
    </a-tabs>
    
    <div v-if="filteredAppointments.length === 0">
      <a-empty description="暂无预约记录" />
    </div>
    
    <div v-else class="appointment-list">
      <AppointmentCard
        v-for="apt in filteredAppointments"
        :key="apt.id"
        :appointment="apt"
        @cancel="handleCancel"
      />
    </div>
  </div>
</template>
```

### 8.2 状态标签颜色

| 状态 | 颜色 | Ant Design Tag 属性 |
|------|------|-------------------|
| scheduled（待就诊）| 蓝色 | color="blue" |
| completed（已完成）| 绿色 | color="green" |
| cancelled（已取消）| 灰色 | color="default" |
| no-show（未到诊）| 红色 | color="red" |

### 8.3 时段显示转换函数

```typescript
const timeSlotMap = {
  morning: '上午',
  afternoon: '下午',
  evening: '晚上',
};

function formatTimeSlot(slot: TimeSlot): string {
  return timeSlotMap[slot] || slot;
}
```

---

## 9. 风险与应对

### 风险 1：患者身份验证缺失

- **描述**：患者未验证时访问页面可能导致数据显示问题
- **影响**：中
- **应对**：在页面顶部添加验证检查，未验证时显示提示并引导

---

## 10. 交付物

- `src/views/PatientAppointments.vue` — 患者预约记录页面组件

### 必需交付物：验证结果

- **编译输出**：运行 `tsc --noEmit` 无错误
- **构建输出**：运行 `npm run build` 成功，退出码 0

---

**Task ID**: TASK-004
**Status**: TODO
**Updated**: 2026-04-29
