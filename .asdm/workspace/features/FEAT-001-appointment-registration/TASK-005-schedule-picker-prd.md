# Task PRD: 排班选择组件

**Feature ID**: FEAT-001-appointment-registration
**Feature Name**: 预约挂号
**Task ID**: TASK-005
**Created Date**: 2026-05-05
**Status**: TODO
**Language**: zh-CN

## 1. Task Overview

### 1.1 Task Summary
创建排班选择组件（`SchedulePicker.vue`），以卡片列表形式展示医生的排班信息，患者可选择排班时段进行预约。

### 1.2 Task Objectives
- 展示指定医生的排班列表（日期、时段、剩余号源）
- 支持选择排班，触发预约流程
- 无排班时显示空状态提示

### 1.3 Related Feature Requirements
- Feature REQ-004: 展示排班日历
- Related Stories: Story 1

## 2. Detailed Requirements

### 2.1 Functional Requirements
- 接收 `doctorId` 作为 prop，展示该医生的排班
- 每个排班显示：日期、时段（上午/下午）、剩余号源（totalSlots - bookedCount）
- 有剩余号源的排班可点击选择
- 号源为 0 的排班显示为"已满"且不可选择
- 选中排班后 emit `select` 事件，传递 schedule 对象
- 无排班数据时显示 "暂无排班信息" 空状态

### 2.2 Technical Requirements
- 使用 `<script setup lang="ts">` 组合式 API
- Props: `doctorId: string`
- Emits: `select(schedule: Schedule)`
- 使用 `store.getSchedulesByDoctor` 获取数据
- 使用 Ant Design Vue 的 Card、Tag、Empty 组件
- 使用 computed 计算剩余号源和排序

### 2.3 Constraints and Limitations
- 排班按日期升序排列
- 日期格式化使用 dayjs

## 3. Implementation Approach

### 3.1 Recommended Methodology
创建独立的子组件，通过 props 接收医生 ID，内部获取排班数据并展示。

### 3.2 Implementation Steps
1. 创建 `src/components/SchedulePicker.vue`
2. 定义 props（doctorId）和 emits（select）
3. 使用 computed 获取并排序排班数据
4. 实现排班卡片列表 UI
5. 实现选择逻辑和 emit
6. 实现空状态展示

### 3.3 Technical Considerations
- 过滤掉过去日期的排班
- 时段排序：同一天 morning 排在 afternoon 前面
- 剩余号源颜色：>0 绿色，=0 红色

### 3.4 Reference to Project Context
- `.asdm/contexts/data-models.md`: Schedule 数据结构
- `.asdm/contexts/architecture.md`: 组件设计模式

## 4. Acceptance Criteria

### 4.1 Primary Criteria
- **Criterion 1**: 输入 doctorId 后展示该医生的排班列表
  - Test method: 手动测试
  - **Validation tool**: `npm run build`
- **Criterion 2**: 点击有号源的排班触发 select 事件
  - Test method: 手动测试
  - **Validation tool**: `npm run build`
- **Criterion 3**: 号源为 0 的排班不可选择，显示"已满"
  - Test method: 手动测试
  - **Validation tool**: `npm run build`

### 4.2 Edge Cases
- 医生无排班时显示空状态
- 所有排班已满时的展示

### 4.3 Negative Tests
- 不存在的 doctorId 应显示空状态

## 5. Dependencies

### 5.1 Task Dependencies
- **Depends on**: TASK-002 (Store API), TASK-003 (Mock 数据)
- **Blocks**: TASK-006 (预约表单组件)

### 5.2 External Dependencies
- Ant Design Vue 组件

### 5.3 Prerequisites
- Store 方法可用

## 6. Estimated Effort

### 6.1 Effort Estimate
- **Estimated effort**: 20 min
- **Complexity**: Medium
- **Risk**: Low

### 6.2 Effort Factors
- UI 交互逻辑相对简单，但需注意展示细节

## 7. Testing Strategy

### 7.1 Automated Validation (Required)
- **Build validation**: `npm run build` — 编译通过
- **Exit criteria**: exit code 0

### 7.2 Manual Testing
- 选择不同医生查看排班展示
- 点击排班验证 select 事件
- 测试已满排班的交互

## 8. Implementation Notes

- 排班卡片布局建议：
  ```
  ┌──────────────────────────────┐
  │ 📅 2026-05-10  上午          │
  │ 剩余号源: 15/20              │
  │ [选择]                       │
  └──────────────────────────────┘
  ```
- 或使用列表模式：
  ```
  | 日期       | 时段 | 号源     | 操作   |
  |------------|------|----------|--------|
  | 2026-05-10 | 上午 | 15/20    | [选择] |
  | 2026-05-10 | 下午 | 0/15 已满 | -     |
  ```

## 9. Risks and Mitigations

### Risk 1
- **Description**: 排班数据量大时列表过长
- **Impact**: Low
- **Mitigation**: 只显示未来 7 天的排班，使用分页或虚拟滚动

## 10. Deliverables

- `src/components/SchedulePicker.vue`
- **Validation Results**: `npm run build` 通过
