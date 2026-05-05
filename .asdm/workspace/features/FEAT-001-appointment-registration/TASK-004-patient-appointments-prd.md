# Task PRD: 患者预约页面

**Feature ID**: FEAT-001-appointment-registration
**Feature Name**: 预约挂号
**Task ID**: TASK-004
**Created Date**: 2026-05-05
**Status**: TODO
**Language**: zh-CN

## 1. Task Overview

### 1.1 Task Summary
创建患者预约挂号页面（`AppointmentRegistration.vue`），患者验证身份后可查看医生排班、提交预约、查看我的预约列表。

### 1.2 Task Objectives
- 创建独立的预约挂号页面
- 实现患者身份验证（复用现有 verifyPatient）
- 展示"我的预约"列表，支持取消操作
- 集成排班选择和预约表单组件

### 1.3 Related Feature Requirements
- Feature REQ-004: 患者端添加预约挂号 Tab
- Related Stories: Story 1, Story 2, Story 3

## 2. Detailed Requirements

### 2.1 Functional Requirements
- 页面支持两种进入模式：通用入口（选择医生）和指定医生入口（路由参数）
- 未验证身份时显示验证表单
- 验证后展示页面内容：医生排班区 + 我的预约列表
- 我的预约列表显示：医生姓名、日期、时段、状态、症状描述
- 支持"取消预约"操作（仅 booked 状态）
- 选择医生后展示该医生的排班列表

### 2.2 Technical Requirements
- 使用 `<script setup lang="ts">` 组合式 API
- 使用 Ant Design Vue 组件：Card, Table, Button, Tag, Modal
- 复用 `store.verifyPatient`、`store.logoutPatient`
- 使用 `store.getSchedulesByDoctor`、`store.getAppointmentsByPatient`
- 使用 `store.addAppointment`、`store.cancelAppointment`
- 使用 dayjs 格式化日期

### 2.3 Constraints and Limitations
- 页面布局风格与现有 Consultation.vue 保持一致
- 预约状态使用 Tag 组件不同颜色区分

## 3. Implementation Approach

### 3.1 Recommended Methodology
参考 `Consultation.vue` 的页面结构（身份验证 + 内容展示），创建类似的预约挂号页面。

### 3.2 Implementation Steps
1. 创建 `src/views/AppointmentRegistration.vue`
2. 实现身份验证区域（与 Consultation.vue 类似）
3. 实现医生选择区域（Select 组件）
4. 实现排班展示区域（集成 TASK-005 的排班选择组件）
5. 实现预约表单区域（集成 TASK-006 的预约表单组件）
6. 实现"我的预约"列表区域
7. 实现取消预约功能

### 3.3 Technical Considerations
- 预约状态颜色映射：booked=blue, completed=green, no_show=orange, cancelled=red
- 取消预约前使用 Modal.confirm 确认
- 时段显示：morning → "上午 08:00-12:00", afternoon → "下午 14:00-17:00"

### 3.4 Reference to Project Context
- `.asdm/contexts/architecture.md`: 页面组件设计模式
- `.asdm/contexts/standard-coding-style.md`: 编码规范

## 4. Acceptance Criteria

### 4.1 Primary Criteria
- **Criterion 1**: 页面可通过路由访问，身份验证流程正常
  - Test method: 浏览器访问验证
  - **Validation tool**: `npm run build`
- **Criterion 2**: 我的预约列表正确显示，取消预约功能正常
  - Test method: 手动测试
  - **Validation tool**: `npm run build`
- **Criterion 3**: 选择医生后排班数据正确展示
  - Test method: 手动测试
  - **Validation tool**: `npm run build`

### 4.2 Edge Cases
- 无排班的医生显示空状态
- 无预约记录时显示空状态

### 4.3 Negative Tests
- 未验证身份时不应显示预约内容
- 号源不足时提交预约应提示错误

## 5. Dependencies

### 5.1 Task Dependencies
- **Depends on**: TASK-002 (Store API), TASK-003 (Mock 数据)
- **Blocks**: TASK-008 (路由配置)

### 5.2 External Dependencies
- Ant Design Vue 组件

### 5.3 Prerequisites
- Store 方法可用
- Mock 数据已加载

## 6. Estimated Effort

### 6.1 Effort Estimate
- **Estimated effort**: 20 min
- **Complexity**: Medium
- **Risk**: Low

### 6.2 Effort Factors
- 需要集成排班选择和预约表单子组件

## 7. Testing Strategy

### 7.1 Automated Validation (Required)
- **Build validation**: `npm run build` — 编译通过
- **Exit criteria**: exit code 0

### 7.2 Manual Testing
- 验证身份 → 选择医生 → 查看排班 → 提交预约 → 查看预约列表 → 取消预约

## 8. Implementation Notes

- 页面布局参考：
  ```
  ┌─────────────────────────────────┐
  │ 身份验证区域 (若未验证)          │
  ├─────────────────────────────────┤
  │ 选择医生 (Select)               │
  ├─────────────────────────────────┤
  │ 排班列表 (SchedulePicker)       │
  │ ┌─────┐ ┌─────┐ ┌─────┐        │
  │ │5/10 │ │5/11 │ │5/12 │ ...    │
  │ │上午 │ │下午 │ │上午 │        │
  │ │余15 │ │余10 │ │余20 │        │
  │ └─────┘ └─────┘ └─────┘        │
  ├─────────────────────────────────┤
  │ 我的预约 (Table)                │
  │ | 医生 | 日期 | 时段 | 状态 |  │
  └─────────────────────────────────┘
  ```

## 9. Risks and Mitigations

### Risk 1
- **Description**: 页面内容较多，布局可能不够紧凑
- **Impact**: Low
- **Mitigation**: 使用 Tabs 组件将"预约挂号"和"我的预约"分为两个 Tab

## 10. Deliverables

- `src/views/AppointmentRegistration.vue`
- **Validation Results**: `npm run build` 通过
