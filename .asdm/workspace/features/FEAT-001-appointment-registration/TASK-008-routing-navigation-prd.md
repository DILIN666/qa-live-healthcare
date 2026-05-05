# Task PRD: 路由和导航配置

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号
**Task ID**: TASK-008
**Created Date**: 2026-05-05
**Status**: TODO
**Language**: 简体中文

## 1. Task Overview

### 1.1 Task Summary

配置预约挂号相关的新路由，并在导航栏中添加入口，使患者和医生能够访问预约功能。

### 1.2 Task Objectives

- 目标 1：新增患者预约记录路由 `/appointments`
- 目标 2：新增预约挂号路由 `/appointment/:doctorUsername`
- 目标 3：在医生诊室中集成预约管理标签页
- 目标 4：在患者端导航栏添加「我的预约」入口
- 目标 5：在医生列表页添加「预约挂号」按钮

### 1.3 Related Feature Requirements

- 功能需求 REQ-002：预约挂号 — 提供预约入口
- 功能需求 REQ-003：预约记录查询 — 提供查询入口
- 功能需求 REQ-005：预约状态管理 — 医生端入口
- 关联验收标准 5：所有新增页面符合项目现有的 UI 风格

## 2. Detailed Requirements

### 2.1 Functional Requirements

- 需求 1：在 `src/router/index.ts` 中新增路由：
  - `/appointments` → PatientAppointments.vue（患者预约记录）
  - `/appointment/:doctorUsername` → AppointmentForm.vue（预约挂号）
- 需求 2：在 `AppHeader.vue` 患者端导航菜单中添加「我的预约」链接（仅患者登录后显示）
- 需求 3：在 `Doctors.vue` 医生列表中每个医生卡片添加「预约挂号」按钮
- 需求 4：在 `DoctorRoom.vue` 中添加「预约管理」标签页，集成 DoctorAppointments 组件
- 需求 5：路由懒加载，与现有路由风格一致

### 2.2 Technical Requirements

- 需求 1：路由配置使用 `component: () => import()` 懒加载
- 需求 2：`/appointments` 路由需检查患者登录状态
- 需求 3：导航菜单使用 `a-menu-item` 组件
- 需求 4：标签页使用 `a-tabs` 组件

### 2.3 Constraints and Limitations

- 约束 1：不修改现有路由的结构
- 约束 2：新增路由与现有路由风格一致

## 3. Implementation Approach

### 3.1 Recommended Methodology

- 方法 1：参考现有路由配置格式添加新路由
- 方法 2：在 AppHeader 中使用 `v-if="store.currentPatient"` 控制菜单显示
- 方法 3：DoctorRoom 使用 `a-tabs` 添加新标签页

### 3.2 Implementation Steps

1. 在 `src/router/index.ts` 中添加两条新路由
2. 修改 `AppHeader.vue`，添加「我的预约」菜单项
3. 修改 `Doctors.vue`，添加「预约挂号」按钮
4. 修改 `DoctorRoom.vue`，添加「预约管理」标签页
5. 验证所有路由和导航正常工作

### 3.3 Technical Considerations

- 考虑 1：`/appointment/:doctorUsername` 需要通过 username 查找 doctorId
- 考虑 2：DoctorRoom 的标签页需保持现有问题管理功能不变
- 考虑 3：医生卡片的「预约挂号」按钮需链接到 `/appointment/:username`

### 3.4 Reference to Project Context

- `.asdm/contexts/architecture.md`：路由设计
- `.asdm/contexts/standard-coding-style.md`：编码规范

## 4. Acceptance Criteria

### 4.1 Primary Criteria

- **标准 1**：新路由可正常访问
  - 测试方法：在浏览器中访问 `/appointments` 和 `/appointment/dr-zhang-wei`
  - **验证工具**：`npm run build`
- **标准 2**：导航菜单正确显示「我的预约」入口
  - 测试方法：患者登录后查看导航栏
  - **验证工具**：`npm run build`
- **标准 3**：医生列表页「预约挂号」按钮正确跳转
  - 测试方法：点击按钮验证跳转
  - **验证工具**：`npm run build`
- **标准 4**：医生诊室显示「预约管理」标签页
  - 测试方法：登录医生诊室查看标签页
  - **验证工具**：`npm run build`

### 4.2 Edge Cases

- 边界情况 1：未登录患者点击「我的预约」应跳转到验证页
- 边界情况 2：不存在的医生 username 访问预约页

### 4.3 Negative Tests

- 负面测试 1：无效的医生 username 不应导致页面崩溃

## 5. Dependencies

### 5.1 Task Dependencies

- **依赖于**: TASK-004（PatientAppointments 页面）、TASK-007（DoctorAppointments 页面）
- **阻塞**: 无

### 5.2 External Dependencies

- 无

### 5.3 Prerequisites

- 前提 1：TASK-004 和 TASK-007 的页面组件已创建
- 前提 2：TASK-006 的 AppointmentForm 组件已创建

## 6. Estimated Effort

### 6.1 Effort Estimate

- **预估工时**：10 min
- **复杂度**：低
- **风险**：低

### 6.2 Effort Factors

- 因素 1：主要是配置性工作，逻辑简单
- 因素 2：需修改多个文件但改动量小

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

- **构建验证**：`npm run build` — 编译成功且无错误
- **类型检查**：`npx vue-tsc --noEmit` — 类型检查通过
- **退出标准**：所有验证命令退出码为 0

### 7.2 Unit Testing

- 手动测试所有路由跳转

### 7.3 Integration Testing

- 完整的端到端流程测试

### 7.4 Manual Testing

- 在浏览器中验证所有导航入口和页面跳转

## 8. Implementation Notes

- 注意 1：路由定义参考现有格式：
  ```typescript
  {
    path: '/appointments',
    name: 'Appointments',
    component: () => import('../components/PatientAppointments.vue')
  }
  ```
- 注意 2：AppHeader 中「我的预约」菜单项的 key 使用 `appointments`
- 注意 3：Doctors.vue 中预约按钮使用 `a-button` type="primary" size="small"
- 注意 4：DoctorRoom 使用 `a-tab-pane` 添加预约管理标签

## 9. Risks and Mitigations

### 风险 1

- **描述**：修改 AppHeader 和 DoctorRoom 可能影响现有功能
- **影响**：中
- **缓解**：仅添加新内容，不修改现有代码逻辑

## 10. Deliverables

- 交付物 1：更新的 `src/router/index.ts`（新增 2 条路由）
- 交付物 2：更新的 `src/components/AppHeader.vue`（添加导航入口）
- 交付物 3：更新的 `src/components/Doctors.vue`（添加预约按钮）
- 交付物 4：更新的 `src/components/DoctorRoom.vue`（添加预约管理标签页）

**强制交付物**：验证结果
- **构建输出**：`npm run build` 成功，退出码 0
- **类型检查输出**：`npx vue-tsc --noEmit` 成功，退出码 0

---

**Feature ID**: FEAT-001
**Task ID**: TASK-008
**Status**: TODO
**Created**: 2026-05-05
**Updated**: 2026-05-05
