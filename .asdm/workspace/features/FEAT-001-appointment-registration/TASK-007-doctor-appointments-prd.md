# Task PRD: 医生预约列表页

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号
**Task ID**: TASK-007
**Created Date**: 2026-05-05
**Status**: TODO
**Language**: 简体中文

## 1. Task Overview

### 1.1 Task Summary

创建 `DoctorAppointments.vue` 页面组件，供医生查看自己的预约列表，支持按日期筛选、标记到诊/未到诊。

### 1.2 Task Objectives

- 目标 1：展示当前登录医生的预约列表
- 目标 2：支持按日期筛选预约
- 目标 3：支持标记患者到诊/未到诊状态
- 目标 4：预约信息展示清晰（患者姓名、预约时段、状态等）

### 1.3 Related Feature Requirements

- 功能需求 REQ-003：预约记录查询 — 医生查看自己的预约列表
- 功能需求 REQ-005：预约状态管理 — 医生标记到诊/未到诊
- 关联用户故事：故事 3（医生查看预约）

## 2. Detailed Requirements

### 2.1 Functional Requirements

- 需求 1：页面顶部提供日期选择器（DatePicker），默认选中今天
- 需求 2：预约列表按时段排序（上午→下午→晚上）
- 需求 3：每条预约显示：患者姓名、联系电话、预约时段、就诊备注、预约状态
- 需求 4：pending 状态的预约显示操作按钮：「已到诊」和「未到诊」
- 需求 5：点击「已到诊」将预约状态更新为 completed
- 需求 6：点击「未到诊」将预约状态更新为 no_show
- 需求 7：无预约时显示空状态提示
- 需求 8：页面需验证医生已登录

### 2.2 Technical Requirements

- 需求 1：使用 Ant Design Vue 的 `DatePicker`、`Table`、`Tag`、`Button`、`Empty` 组件
- 需求 2：日期选择使用 Day.js 处理
- 需求 3：使用 `a-table` 展示预约列表，支持列排序
- 需求 4：使用 Composition API（`<script setup lang="ts">`）

### 2.3 Constraints and Limitations

- 约束 1：仅展示当前登录医生的预约
- 约束 2：已标记为 completed 或 no_show 的预约不可再次修改状态

## 3. Implementation Approach

### 3.1 Recommended Methodology

- 方法 1：使用 `a-table` 组件展示预约列表
- 方法 2：日期选择器使用 `a-date-picker`
- 方法 3：操作按钮放在表格的操作列中

### 3.2 Implementation Steps

1. 创建 `src/components/DoctorAppointments.vue`
2. 实现医生登录检查
3. 添加日期选择器（默认今天）
4. 使用 Store 的 `getAppointmentsByDoctor` 获取数据
5. 实现按日期筛选（computed）
6. 渲染预约表格
7. 实现「已到诊」和「未到诊」操作
8. 实现空状态提示

### 3.3 Technical Considerations

- 考虑 1：日期筛选使用 Day.js 的 `isSame` 方法比较日期
- 考虑 2：表格列定义：患者姓名、联系电话、时段、备注、状态、操作
- 考虑 3：操作按钮仅在 pending 状态时显示

### 3.4 Reference to Project Context

- `.asdm/contexts/architecture.md`：组件架构
- `.asdm/contexts/standard-coding-style.md`：编码规范

## 4. Acceptance Criteria

### 4.1 Primary Criteria

- **标准 1**：正确展示当前医生的预约列表
  - 测试方法：医生登录后查看列表
  - **验证工具**：`npm run build`
- **标准 2**：日期筛选功能正常
  - 测试方法：切换日期查看筛选结果
  - **验证工具**：`npm run build`
- **标准 3**：标记到诊/未到诊功能正常
  - 测试方法：点击按钮验证状态更新
  - **验证工具**：`npm run build`
- **标准 4**：未登录医生无法访问
  - 测试方法：未登录时访问页面
  - **验证工具**：`npm run build`

### 4.2 Edge Cases

- 边界情况 1：选中日期无预约
- 边界情况 2：所有预约都已标记状态

### 4.3 Negative Tests

- 负面测试 1：已完成的预约不显示操作按钮

## 5. Dependencies

### 5.1 Task Dependencies

- **依赖于**: TASK-002（Store API — 需要 getAppointmentsByDoctor 和 updateAppointmentStatus）
- **阻塞**: TASK-008（路由和导航配置）

### 5.2 External Dependencies

- 库：Ant Design Vue（已在项目中）
- 库：Day.js（已在项目中）

### 5.3 Prerequisites

- 前提 1：TASK-002 Store API 已实现

## 6. Estimated Effort

### 6.1 Effort Estimate

- **预估工时**：15 min
- **复杂度**：中
- **风险**：低

### 6.2 Effort Factors

- 因素 1：表格和日期筛选逻辑较简单
- 因素 2：需与医生诊室页面集成

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

- **构建验证**：`npm run build` — 编译成功且无错误
- **类型检查**：`npx vue-tsc --noEmit` — 类型检查通过
- **退出标准**：所有验证命令退出码为 0

### 7.2 Unit Testing

- 手动测试筛选和状态更新

### 7.3 Integration Testing

- 与医生诊室页面集成测试

### 7.4 Manual Testing

- 在浏览器中验证预约列表和交互

## 8. Implementation Notes

- 注意 1：此组件可作为 `DoctorRoom.vue` 的子标签页集成
- 注意 2：时段排序：morning→afternoon→evening
- 注意 3：表格列宽建议：姓名 15%、电话 15%、时段 15%、备注 30%、状态 10%、操作 15%

## 9. Risks and Mitigations

### 风险 1

- **描述**：与 DoctorRoom.vue 集成方式不确定
- **影响**：低
- **缓解**：先作为独立页面实现，后续在 TASK-008 中集成

## 10. Deliverables

- 交付物 1：`src/components/DoctorAppointments.vue` 页面组件

**强制交付物**：验证结果
- **构建输出**：`npm run build` 成功，退出码 0
- **类型检查输出**：`npx vue-tsc --noEmit` 成功，退出码 0

---

**Feature ID**: FEAT-001
**Task ID**: TASK-007
**Status**: TODO
**Created**: 2026-05-05
**Updated**: 2026-05-05
