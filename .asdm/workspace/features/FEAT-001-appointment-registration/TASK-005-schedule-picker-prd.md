# Task PRD: 排班选择组件

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号
**Task ID**: TASK-005
**Created Date**: 2026-05-05
**Status**: TODO
**Language**: 简体中文

## 1. Task Overview

### 1.1 Task Summary

创建 `SchedulePicker.vue` 组件，展示指定医生的排班信息，患者可选择可用时段进行预约。组件以日历形式展示未来 7 天的排班，每个时段显示剩余名额。

### 1.2 Task Objectives

- 目标 1：以日历/列表形式展示医生未来 7 天的门诊排班
- 目标 2：每个时段显示剩余可预约名额
- 目标 3：不可预约的时段（已满、已过）显示为禁用状态
- 目标 4：选择时段后触发事件通知父组件

### 1.3 Related Feature Requirements

- 功能需求 REQ-001：医生排班管理 — 展示排班信息
- 功能需求 REQ-002：预约挂号 — 选择可用时段
- 关联用户故事：故事 1（患者预约门诊）

## 2. Detailed Requirements

### 2.1 Functional Requirements

- 需求 1：接收 `doctorId` 作为 prop，从 Store 获取该医生的排班数据
- 需求 2：按日期分组展示排班，日期格式为「MM月DD日 周X」
- 需求 3：每个时段显示：时段名称（上午/下午/晚上）、剩余名额（如"3/10"）、状态指示
- 需求 4：可预约时段显示为可点击的卡片，点击后选中并 emit `select` 事件
- 需求 5：已满时段（bookedSlots === totalSlots）显示为灰色禁用状态
- 需求 6：已过时段（日期 < 今天）不显示
- 需求 7：无排班时显示"暂无排班信息"提示

### 2.2 Technical Requirements

- 需求 1：使用 Ant Design Vue 的 `Card`、`Tag`、`Empty`、`Radio` 组件
- 需求 2：日期处理使用 Day.js
- 需求 3：使用 computed 属性计算排班分组和可用状态
- 需求 4：选中状态使用 `a-radio-group` 或自定义高亮样式

### 2.3 Constraints and Limitations

- 约束 1：仅展示未来 7 天的排班
- 约束 2：当前为只读展示，不提供排班编辑功能

## 3. Implementation Approach

### 3.1 Recommended Methodology

- 方法 1：使用 `a-collapse` 或日期卡片+时段列表的布局
- 方法 2：使用 Composition API（`<script setup lang="ts">`）
- 方法 3：emit 事件传递选中的 scheduleId

### 3.2 Implementation Steps

1. 创建 `src/components/SchedulePicker.vue`
2. 定义 props（doctorId）和 emits（select）
3. 使用 Store 的 `getAvailableSchedules` 获取排班数据
4. 按日期分组处理排班数据（computed）
5. 渲染日期分组和时段列表
6. 实现时段选择交互逻辑
7. 实现禁用状态和无数据提示
8. 调整样式

### 3.3 Technical Considerations

- 考虑 1：排班数据需按日期排序（升序）
- 考虑 2：日期格式化使用 Day.js 的中文 locale
- 考虑 3：emit 的数据包含完整的 schedule 对象

### 3.4 Reference to Project Context

- `.asdm/contexts/architecture.md`：组件通信模式（Props / Emits）
- `.asdm/contexts/standard-coding-style.md`：编码规范

## 4. Acceptance Criteria

### 4.1 Primary Criteria

- **标准 1**：正确展示指定医生的排班信息
  - 测试方法：传入 doctorId，验证排班列表渲染
  - **验证工具**：`npm run build`
- **标准 2**：已满时段显示为禁用状态
  - 测试方法：查看 bookedSlots === totalSlots 的时段样式
  - **验证工具**：`npm run build`
- **标准 3**：选择时段后正确 emit select 事件
  - 测试方法：点击可预约时段，验证事件触发
  - **验证工具**：`npm run build`
- **标准 4**：无排班时显示空状态提示
  - 测试方法：传入无排班的医生 ID
  - **验证工具**：`npm run build`

### 4.2 Edge Cases

- 边界情况 1：医生当天无排班
- 边界情况 2：所有时段都已满

### 4.3 Negative Tests

- 负面测试 1：已满时段不可点击
- 负面测试 2：无效的 doctorId 应显示空状态

## 5. Dependencies

### 5.1 Task Dependencies

- **依赖于**: TASK-002（Store API 扩展 — 需要 getAvailableSchedules 方法）
- **阻塞**: TASK-006（预约表单组件需要排班选择结果）

### 5.2 External Dependencies

- 库：Ant Design Vue（已在项目中）
- 库：Day.js（已在项目中）

### 5.3 Prerequisites

- 前提 1：TASK-002 Store API 已实现

## 6. Estimated Effort

### 6.1 Effort Estimate

- **预估工时**：20 min
- **复杂度**：中
- **风险**：低

### 6.2 Effort Factors

- 因素 1：需要处理日期分组和状态样式逻辑
- 因素 2：排班展示 UI 需要精心设计

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

- **构建验证**：`npm run build` — 编译成功且无错误
- **类型检查**：`npx vue-tsc --noEmit` — 类型检查通过
- **退出标准**：所有验证命令退出码为 0

### 7.2 Unit Testing

- 手动测试排班展示和选择交互

### 7.3 Integration Testing

- 与预约表单组件集成测试

### 7.4 Manual Testing

- 在浏览器中验证排班展示和交互效果

## 8. Implementation Notes

- 注意 1：日期显示格式：`5月5日 周一`
- 注意 2：时段卡片设计：左侧时段名称，右侧剩余名额
- 注意 3：选中状态使用蓝色边框或背景高亮

## 9. Risks and Mitigations

### 风险 1

- **描述**：排班数据量大时页面渲染性能
- **影响**：低
- **缓解**：仅展示 7 天数据，性能可接受

## 10. Deliverables

- 交付物 1：`src/components/SchedulePicker.vue` 组件

**强制交付物**：验证结果
- **构建输出**：`npm run build` 成功，退出码 0
- **类型检查输出**：`npx vue-tsc --noEmit` 成功，退出码 0

---

**Feature ID**: FEAT-001
**Task ID**: TASK-005
**Status**: TODO
**Created**: 2026-05-05
**Updated**: 2026-05-05
