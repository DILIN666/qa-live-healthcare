# Task PRD: 医生预约管理页面

**Feature ID**: FEAT-001-appointment-registration
**Feature Name**: 预约挂号
**Task ID**: TASK-007
**Created Date**: 2026-05-05
**Status**: TODO
**Language**: zh-CN

## 1. Task Overview

### 1.1 Task Summary
在现有 `DoctorRoom.vue` 医生诊室页面中新增"排班管理"和"预约列表"功能 Tab，让医生可以管理排班和查看预约。

### 1.2 Task Objectives
- 在医生诊室页面添加 Tabs 导航（问诊/排班管理/预约列表）
- 实现排班管理：添加排班、删除排班、查看排班列表
- 实现预约列表：查看预约、标记完成/未到

### 1.3 Related Feature Requirements
- Feature REQ-005: 医生端添加排班管理和预约列表 Tab
- Related Stories: Story 4, Story 5

## 2. Detailed Requirements

### 2.1 Functional Requirements
- 使用 Tabs 组件将诊室页面分为三个 Tab：问诊、排班管理、预约列表
- **排班管理 Tab**：
  - 显示当前医生的排班列表（日期、时段、号源使用情况）
  - "添加排班"按钮 → 弹出表单（日期、时段、号源数量）
  - "删除"按钮 → 确认后删除（有预约的不可删除，提示错误）
- **预约列表 Tab**：
  - 显示当前医生的预约列表，按日期降序排列
  - 每条显示：患者姓名、日期、时段、状态、症状描述
  - booked 状态的预约可操作："已完成"和"未到"按钮
  - 状态颜色区分：booked=蓝, completed=绿, no_show=橙, cancelled=红

### 2.2 Technical Requirements
- 修改 `src/views/DoctorRoom.vue`，使用 Ant Design Vue 的 Tabs 组件
- 排班管理使用 Form + Table 组件
- 预约列表使用 Table 组件
- 使用 `store.getSchedulesByDoctor`、`store.addSchedule`、`store.deleteSchedule`
- 使用 `store.getAppointmentsByDoctor`、`store.updateAppointmentStatus`
- 使用 dayjs 格式化日期

### 2.3 Constraints and Limitations
- 保持现有问诊功能不变
- 添加排班的日期不能是过去日期
- 同一医生同一天同一时段不能重复排班

## 3. Implementation Approach

### 3.1 Recommended Methodology
在现有 DoctorRoom.vue 中添加 Tabs 包裹现有内容，新增两个 Tab 面板。

### 3.2 Implementation Steps
1. 修改 `DoctorRoom.vue`，将现有问诊内容包裹在第一个 Tab 中
2. 添加"排班管理"Tab 面板
3. 实现排班列表展示
4. 实现添加排班表单（Modal 弹出）
5. 实现删除排班逻辑
6. 添加"预约列表"Tab 面板
7. 实现预约列表展示
8. 实现预约状态更新操作

### 3.3 Technical Considerations
- 添加排班时校验：同天同时段不重复
- 使用 `Modal.confirm` 确认删除操作
- 排班列表按日期升序，预约列表按日期降序
- 使用 `DatePicker` 选择排班日期（disabledDate 禁用过去日期）

### 3.4 Reference to Project Context
- `.asdm/contexts/architecture.md`: DoctorRoom.vue 页面结构
- `.asdm/contexts/data-models.md`: Store 方法

## 4. Acceptance Criteria

### 4.1 Primary Criteria
- **Criterion 1**: 诊室页面显示三个 Tab，现有问诊功能正常
  - Test method: 手动测试
  - **Validation tool**: `npm run build`
- **Criterion 2**: 排班管理 Tab 可添加和删除排班
  - Test method: 手动测试
  - **Validation tool**: `npm run build`
- **Criterion 3**: 预约列表 Tab 正确显示并可更新状态
  - Test method: 手动测试
  - **Validation tool**: `npm run build`

### 4.2 Edge Cases
- 添加重复排班（同天同时段）应提示错误
- 有预约的排班删除时应提示不可删除

### 4.3 Negative Tests
- 未登录时页面不可访问（现有守卫应继续生效）

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
- 在现有页面上修改，需确保不破坏现有功能

## 7. Testing Strategy

### 7.1 Automated Validation (Required)
- **Build validation**: `npm run build` — 编译通过
- **Exit criteria**: exit code 0

### 7.2 Manual Testing
- 登录医生 → 切换 Tab → 添加排班 → 查看预约 → 更新状态

## 8. Implementation Notes

- 页面结构：
  ```
  ┌──────────────────────────────────┐
  │ [问诊] [排班管理] [预约列表]     │
  ├──────────────────────────────────┤
  │ Tab 1: 现有问诊功能              │
  │ Tab 2:                          │
  │  [+ 添加排班]                   │
  │  | 日期       | 时段 | 号源 | 操作| │
  │  | 2026-05-10 | 上午 | 15/20| 删除| │
  │ Tab 3:                          │
  │  | 患者 | 日期 | 时段 | 状态 | 操作| │
  │  | 赵明 | 5/10 | 上午 | 已预约| ✓ ✗| │
  └──────────────────────────────────┘
  ```

## 9. Risks and Mitigations

### Risk 1
- **Description**: 修改 DoctorRoom.vue 可能影响现有问诊功能
- **Impact**: Medium
- **Mitigation**: 仅在外层添加 Tabs 包裹，不修改现有问诊逻辑

## 10. Deliverables

- 更新后的 `src/views/DoctorRoom.vue`
- **Validation Results**: `npm run build` 通过
