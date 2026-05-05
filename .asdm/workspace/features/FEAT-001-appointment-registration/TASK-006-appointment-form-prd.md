# Task PRD: 预约表单组件

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号
**Task ID**: TASK-006
**Created Date**: 2026-05-05
**Status**: TODO
**Language**: 简体中文

## 1. Task Overview

### 1.1 Task Summary

创建 `AppointmentForm.vue` 组件，包含排班选择器和预约信息表单，患者选择时段后填写个人信息并提交预约。

### 1.2 Task Objectives

- 目标 1：集成 SchedulePicker 组件供患者选择排班时段
- 目标 2：提供预约信息表单（姓名、联系方式、就诊备注）
- 目标 3：表单验证和提交逻辑
- 目标 4：预约成功后显示确认信息

### 1.3 Related Feature Requirements

- 功能需求 REQ-002：预约挂号 — 预约表单和提交
- 关联用户故事：故事 1（患者预约门诊）

## 2. Detailed Requirements

### 2.1 Functional Requirements

- 需求 1：接收 `doctorId` 作为 prop
- 需求 2：集成 SchedulePicker 组件，患者选择时段后显示预约表单
- 需求 3：表单包含字段：患者姓名（必填）、联系电话（必填）、就诊备注（选填）
- 需求 4：已登录患者自动填充姓名，未登录患者需先验证身份
- 需求 5：表单验证：姓名非空、电话格式正确（11位手机号）
- 需求 6：提交后调用 Store 的 `createAppointment` 方法
- 需求 7：预约成功显示确认信息（预约编号、时间、医生信息）
- 需求 8：预约失败（名额已满）显示错误提示

### 2.2 Technical Requirements

- 需求 1：使用 Ant Design Vue 的 `Form`、`Input`、`Button`、`Result` 组件
- 需求 2：表单验证使用 `a-form` 的 rules 属性
- 需求 3：使用 Composition API（`<script setup lang="ts">`）

### 2.3 Constraints and Limitations

- 约束 1：当前无患者注册系统，姓名和电话从表单获取
- 约束 2：预约成功后不跳转，停留在当前页面显示确认

## 3. Implementation Approach

### 3.1 Recommended Methodology

- 方法 1：页面分为两步：选择时段 → 填写信息
- 方法 2：使用 `a-steps` 组件展示步骤进度
- 方法 3：预约成功后使用 `a-result` 组件展示确认信息

### 3.2 Implementation Steps

1. 创建 `src/components/AppointmentForm.vue`
2. 定义 props（doctorId）和 emits（success）
3. 集成 SchedulePicker 组件
4. 实现预约信息表单
5. 实现表单验证规则
6. 实现提交逻辑（调用 Store 的 createAppointment）
7. 实现成功/失败状态展示
8. 实现重置和返回功能

### 3.3 Technical Considerations

- 考虑 1：已登录患者从 currentPatient 获取姓名
- 考虑 2：提交时需传入 scheduleId、patientId、patientName、patientPhone、doctorId、doctorName、notes
- 考虑 3：createAppointment 可能因名额已满失败，需处理异常

### 3.4 Reference to Project Context

- `.asdm/contexts/architecture.md`：组件通信模式
- `.asdm/contexts/standard-coding-style.md`：编码规范

## 4. Acceptance Criteria

### 4.1 Primary Criteria

- **标准 1**：选择时段后正确显示预约表单
  - 测试方法：点击排班时段，验证表单显示
  - **验证工具**：`npm run build`
- **标准 2**：表单验证正确工作
  - 测试方法：提交空表单，验证错误提示
  - **验证工具**：`npm run build`
- **标准 3**：预约提交成功后显示确认信息
  - 测试方法：填写有效信息提交，验证结果页面
  - **验证工具**：`npm run build`
- **标准 4**：名额已满时显示错误提示
  - 测试方法：选择已满时段提交（模拟场景）
  - **验证工具**：`npm run build`

### 4.2 Edge Cases

- 边界情况 1：患者已登录时自动填充姓名
- 边界情况 2：电话号码格式验证

### 4.3 Negative Tests

- 负面测试 1：未选择时段时表单不可提交
- 负面测试 2：必填字段为空时提交被阻止

## 5. Dependencies

### 5.1 Task Dependencies

- **依赖于**: TASK-002（Store API）、TASK-005（SchedulePicker 组件）
- **阻塞**: 无

### 5.2 External Dependencies

- 库：Ant Design Vue（已在项目中）

### 5.3 Prerequisites

- 前提 1：TASK-002 Store API 已实现
- 前提 2：TASK-005 SchedulePicker 组件已实现

## 6. Estimated Effort

### 6.1 Effort Estimate

- **预估工时**：15 min
- **复杂度**：中
- **风险**：低

### 6.2 Effort Factors

- 因素 1：需要集成 SchedulePicker 和实现表单逻辑
- 因素 2：步骤式交互增加复杂度

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

- **构建验证**：`npm run build` — 编译成功且无错误
- **类型检查**：`npx vue-tsc --noEmit` — 类型检查通过
- **退出标准**：所有验证命令退出码为 0

### 7.2 Unit Testing

- 手动测试表单验证和提交流程

### 7.3 Integration Testing

- 与 SchedulePicker 和 Store 集成测试

### 7.4 Manual Testing

- 在浏览器中验证完整的预约流程

## 8. Implementation Notes

- 注意 1：两步流程：Step 1 选择时段 → Step 2 填写信息
- 注意 2：预约成功使用 `a-result` 组件显示，包含预约编号和时间
- 注意 3：表单字段映射：姓名→patientName、电话→patientPhone、备注→notes

## 9. Risks and Mitigations

### 风险 1

- **描述**：提交时排班名额可能已被其他请求占满
- **影响**：中
- **缓解**：createAppointment 方法内检查名额，失败时返回错误信息

## 10. Deliverables

- 交付物 1：`src/components/AppointmentForm.vue` 组件

**强制交付物**：验证结果
- **构建输出**：`npm run build` 成功，退出码 0
- **类型检查输出**：`npx vue-tsc --noEmit` 成功，退出码 0

---

**Feature ID**: FEAT-001
**Task ID**: TASK-006
**Status**: TODO
**Created**: 2026-05-05
**Updated**: 2026-05-05
