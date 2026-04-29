# Task PRD: 排班选择组件

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号
**Task ID**: TASK-005
**Created Date**: 2026-04-29
**Status**: TODO
**Language**: 简体中文

---

## 1. 任务概述

### 1.1 任务摘要

创建 `SchedulePicker.vue` 排班选择器组件，让患者可以查看医生未来 7 天的门诊排班，并以日历视图选择可用的预约时段。

### 1.2 任务目标

- **目标 1**：以日历/卡片视图展示医生未来 7 天的排班
- **目标 2**：区分可用/不可用时段（满员、已过期）
- **目标 3**：支持选择时段并 emit selected 事件
- **目标 4**：展示剩余可预约名额

### 1.3 关联功能需求

- 功能需求：REQ-001（医生排班管理）、REQ-002（预约挂号）
- 关联故事：故事 1

---

## 2. 详细需求

### 2.1 功能需求

- **FR-001**：组件 Props
  - `doctorId: string`（必填）— 要查看排班的医生 ID

- **FR-002**：排班展示
  - 显示未来 7 天的排班（从今天开始）
  - 每个日期显示 3 个时段：上午（morning）、下午（afternoon）、晚上（evening）
  - 每个时段显示：时段名称、剩余名额（格式：3/5 表示 3/5 人）
  - 日期格式化显示：如「5月1日 周一」

- **FR-003**：时段可用性
  - `bookedSlots < totalSlots` → 可预约，正常显示
  - `bookedSlots >= totalSlots` → 已满，灰色禁用，显示「已满」
  - 日期已过 → 灰色禁用，显示「已过期」

- **FR-004**：选中状态
  - 选中某个可用时段时高亮显示
  - 选中后 `emit('selected', scheduleId)` 传递选中的 scheduleId
  - 再次点击已选中的时段 → 取消选中

- **FR-005**：组件 Events
  - `selected(scheduleId: string)` — 选中某个时段时触发

### 2.2 技术需求

- 组件路径：`src/components/SchedulePicker.vue`
- 使用 Ant Design Vue 组件（`a-calendar` 或卡片布局）
- 使用 Day.js 格式化日期
- 调用 `src/store/index.ts` 中的 `getSchedulesByDoctor` 和 `getAvailableSlots` 方法
- 遵循 `.asdm/contexts/standard-coding-style.md` 中的 Vue 组件规范

### 2.3 约束与限制

- 不直接创建预约，仅提供时段选择功能
- 组件为纯展示+交互，不处理业务逻辑
- 最小化外部依赖，仅依赖 Store 数据

---

## 3. 实现方案

### 3.1 推荐方法

使用卡片式布局展示每天的排班，每天一个卡片，内含 3 个时段按钮。参考项目中现有组件的结构和风格。

### 3.2 实现步骤

1. **创建组件**：在 `src/components/` 下创建 `SchedulePicker.vue`
2. **定义 Props**：定义 `doctorId` prop，类型为 string
3. **定义 Events**：定义 `selected` 事件
4. **获取排班数据**：在 `watch` 或 `onMounted` 中调用 `getSchedulesByDoctor(doctorId)`
5. **数据处理**：按日期分组排班数据，过滤已过期数据
6. **实现视图**：7 列日期卡片布局
7. **实现选择逻辑**：点击可用时段时更新选中状态并 emit
8. **验证**：运行 TypeScript 类型检查和构建

### 3.3 技术注意事项

- 使用 `computed` 按日期分组排班：`{ [date]: Schedule[] }`
- 日期过滤：`schedule.date >= dayjs().format('YYYY-MM-DD')`
- 使用 `a-button` 或自定义按钮展示时段
- `a-tooltip` 显示时段详情（总名额、已预约）

### 3.4 项目上下文引用

- `.asdm/contexts/standard-coding-style.md` — Vue 组件规范
- `.asdm/workspace/features/FEAT-001-appointment-registration/task-prd-TASK-002.md` — Store API 参考
- `src/components/` 目录下的现有组件作为风格参考

---

## 4. 验收标准

### 4.1 核心标准

- **AC-001**：组件可正常渲染
  - 验证工具：传入 doctorId，组件正常显示 7 天排班
  - 期望结果：日历视图正常展示

- **AC-002**：时段状态显示正确
  - 验证工具：检查不同状态时段的样式
  - 期望结果：可用→蓝色/绿色，已满→灰色，已过期→灰色

- **AC-003**：选中后 emit 正确
  - 验证工具：点击可用时段，监听 selected 事件
  - 期望结果：事件携带正确的 scheduleId

- **AC-004**：名额显示正确
  - 验证工具：检查每个时段显示的名额信息
  - 期望结果：格式为「剩余/总数」或「已满」

### 4.2 边界情况

- **BC-001**：医生无排班数据 → 显示「该医生暂无排班」
- **BC-002**：所有时段均已满 → 显示友好提示
- **BC-003**：doctorId 变化 → 组件自动重新加载排班数据

### 4.3 负面测试

- **NC-001**：传入无效 doctorId → 显示空状态，不报错
- **NC-002**：快速连续点击 → 防止重复 emit

---

## 5. 依赖关系

### 5.1 任务依赖

- **前置依赖**：TASK-002（Store API 扩展）、TASK-003（Mock 数据创建）
- **阻塞任务**：无直接阻塞，但 TASK-008（路由配置）可能涉及

### 5.2 外部依赖

- `src/store/index.ts`（TASK-002 输出）
- `src/data/schedule-list.json`（TASK-003 输出）
- Ant Design Vue（项目已有）
- Day.js（项目已有）

### 5.3 前置条件

- TASK-002 和 TASK-003 完成
- `src/components/SchedulePicker.vue` 文件创建

---

## 6. 预估工作量

- **预估工时**：20 分钟
- **复杂度**：中
- **风险**：低

### 6.1 影响工时的因素

- 日历视图的布局设计可能需要调整
- 日期分组和过滤逻辑需要仔细实现

---

## 7. 测试策略

### 7.1 自动化验证（必需）

- **类型检查**：`tsc --noEmit`
  - 验证组件类型正确
  - 退出码 0 表示成功
- **项目构建**：`npm run build`
  - 验证组件可正常构建
  - 退出码 0 表示成功

### 7.2 手动测试

- 传入有效 doctorId，检查排班是否正常显示
- 点击已满时段，验证是否不可选
- 点击可用时段，验证是否高亮并 emit 正确
- 切换 doctorId，验证数据是否刷新

---

## 8. 实施笔记

### 8.1 实施指导

组件结构示例：

```vue
<template>
  <div class="schedule-picker">
    <div class="schedule-header">
      <h3>选择预约时间</h3>
      <span class="doctor-name">{{ doctorName }}</span>
    </div>
    
    <div class="schedule-calendar">
      <div
        v-for="day in scheduleDays"
        :key="day.date"
        class="day-card"
      >
        <div class="day-header">{{ formatDayHeader(day.date) }}</div>
        
        <div
          v-for="slot in day.slots"
          :key="slot.id"
          class="time-slot"
          :class="getSlotClass(slot)"
          @click="handleSelect(slot)"
        >
          <span class="slot-name">{{ getSlotName(slot.timeSlot) }}</span>
          <span class="slot-count">{{ getSlotCount(slot) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
```

### 8.2 时段样式

| 状态 | 样式 | 说明 |
|------|------|------|
| 可用（有余量）| 蓝色边框，白底 | 可点击选中 |
| 已满 | 灰色背景 | 不可点击 |
| 已过期 | 灰色文字 | 不可点击 |
| 选中 | 蓝色填充 | 高亮显示 |

### 8.3 日期格式化

```typescript
function formatDayHeader(date: string): string {
  return dayjs(date).format('M月D日 ddd'); // 5月1日 周一
}
```

---

## 9. 风险与应对

### 风险 1：排班数据缺失

- **描述**：某些医生的排班数据可能不完整
- **影响**：低
- **应对**：添加空状态友好提示

---

## 10. 交付物

- `src/components/SchedulePicker.vue` — 排班选择器组件

### 必需交付物：验证结果

- **编译输出**：运行 `tsc --noEmit` 无错误
- **构建输出**：运行 `npm run build` 成功，退出码 0

---

**Task ID**: TASK-005
**Status**: TODO
**Updated**: 2026-04-29
