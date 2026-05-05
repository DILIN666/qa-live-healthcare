# Task PRD: 预约表单组件

**Feature ID**: FEAT-001-appointment-registration
**Feature Name**: 预约挂号
**Task ID**: TASK-006
**Created Date**: 2026-05-05
**Status**: TODO
**Language**: zh-CN

## 1. Task Overview

### 1.1 Task Summary
创建预约表单组件（`AppointmentForm.vue`），患者在选择排班后填写症状描述并提交预约。

### 1.2 Task Objectives
- 显示选中排班的摘要信息（医生、日期、时段）
- 提供症状描述输入框（可选）
- 提交预约并显示结果反馈
- 提交成功后清空表单

### 1.3 Related Feature Requirements
- Feature REQ-004: 预约表单
- Related Stories: Story 2

## 2. Detailed Requirements

### 2.1 Functional Requirements
- 接收 `schedule`（Schedule 对象）和 `patient`（Patient 对象）作为 props
- 显示排班信息摘要：医生姓名、日期、时段、剩余号源
- 提供症状描述 TextArea（可选，最多 200 字）
- 提交按钮，点击后调用 `store.addAppointment`
- 提交成功显示成功提示并 emit `success` 事件
- 提交失败（号源不足）显示错误提示
- 取消按钮，emit `cancel` 事件

### 2.2 Technical Requirements
- 使用 `<script setup lang="ts">` 组合式 API
- Props: `schedule: Schedule | null`, `patient: Patient | null`
- Emits: `success(appointment: Appointment)`, `cancel()`
- 使用 Ant Design Vue 的 Form, Input, Button, Descriptions, message
- 使用 `store.addAppointment` 提交

### 2.3 Constraints and Limitations
- schedule 或 patient 为 null 时表单不显示
- 提交过程中按钮禁用，防止重复提交

## 3. Implementation Approach

### 3.1 Recommended Methodology
创建独立表单组件，接收已选排班和患者信息，提供简单的填写和提交流程。

### 3.2 Implementation Steps
1. 创建 `src/components/AppointmentForm.vue`
2. 定义 props 和 emits
3. 实现排班信息摘要展示
4. 实现症状描述输入
5. 实现提交逻辑
6. 实现取消逻辑
7. 添加表单验证和状态管理

### 3.3 Technical Considerations
- 使用 `message.success()` / `message.error()` 显示操作结果
- 提交时构造 Appointment 参数并调用 store.addAppointment
- 成功后重置症状描述字段

### 3.4 Reference to Project Context
- `.asdm/contexts/data-models.md`: Appointment 数据结构
- `.asdm/contexts/architecture.md`: 组件设计模式

## 4. Acceptance Criteria

### 4.1 Primary Criteria
- **Criterion 1**: 选中排班后表单正确显示排班摘要
  - Test method: 手动测试
  - **Validation tool**: `npm run build`
- **Criterion 2**: 提交预约成功后显示成功提示并触发 success 事件
  - Test method: 手动测试
  - **Validation tool**: `npm run build`
- **Criterion 3**: 号源不足时提交失败并显示错误提示
  - Test method: 手动测试
  - **Validation tool**: `npm run build`

### 4.2 Edge Cases
- 未选择排班时表单不显示
- 症状描述为空时允许提交（可选字段）

### 4.3 Negative Tests
- 重复提交防护

## 5. Dependencies

### 5.1 Task Dependencies
- **Depends on**: TASK-005 (排班选择组件)
- **Blocks**: 无

### 5.2 External Dependencies
- Ant Design Vue 组件

### 5.3 Prerequisites
- 排班选择组件可用

## 6. Estimated Effort

### 6.1 Effort Estimate
- **Estimated effort**: 15 min
- **Complexity**: Low
- **Risk**: Low

### 6.2 Effort Factors
- 表单逻辑简单，主要是展示和提交

## 7. Testing Strategy

### 7.1 Automated Validation (Required)
- **Build validation**: `npm run build` — 编译通过
- **Exit criteria**: exit code 0

### 7.2 Manual Testing
- 选择排班 → 查看表单 → 填写症状 → 提交 → 验证成功提示

## 8. Implementation Notes

- 表单布局建议：
  ```
  ┌──────────────────────────────┐
  │ 预约信息确认                  │
  │ 医生: 张伟医生                │
  │ 日期: 2026-05-10 上午         │
  │ 剩余号源: 15                  │
  ├──────────────────────────────┤
  │ 症状描述 (可选):              │
  │ ┌──────────────────────────┐ │
  │ │                          │ │
  │ └──────────────────────────┘ │
  │         [取消]  [确认预约]    │
  └──────────────────────────────┘
  ```

## 9. Risks and Mitigations

- 无明显风险

## 10. Deliverables

- `src/components/AppointmentForm.vue`
- **Validation Results**: `npm run build` 通过
