# Task PRD: 预约页面开发

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号
**Task ID**: TASK-004
**Created Date**: 2026-05-05
**Status**: TODO
**Language**: 简体中文

## 1. Task Overview

### 1.1 Task Summary

创建 `PatientAppointments.vue` 页面组件，供患者查看自己的预约记录列表，支持按状态筛选和取消预约操作。

### 1.2 Task Objectives

- 目标 1：展示当前患者的所有预约记录，按时间倒序排列
- 目标 2：支持按预约状态筛选（全部、待就诊、已完成、已取消）
- 目标 3：提供取消预约操作入口
- 目标 4：空状态和无数据提示

### 1.3 Related Feature Requirements

- 功能需求 REQ-003：预约记录查询 — 患者查看自己的预约记录
- 功能需求 REQ-004：取消预约 — 患者取消待就诊的预约
- 关联用户故事：故事 2（患者管理预约）

## 2. Detailed Requirements

### 2.1 Functional Requirements

- 需求 1：页面顶部显示筛选标签（Tabs），选项为：全部、待就诊、已完成、已取消
- 需求 2：预约列表使用 Card 组件展示，每张卡片包含：医生姓名、科室、预约日期、时段、状态标签
- 需求 3：待就诊状态的预约卡片显示「取消预约」按钮
- 需求 4：点击取消预约后弹出确认对话框，确认后调用 Store 的 `cancelAppointment` 方法
- 需求 5：取消成功后刷新列表
- 需求 6：无预约记录时显示空状态提示
- 需求 7：页面需要验证患者已登录（currentPatient 不为 null）

### 2.2 Technical Requirements

- 需求 1：使用 Ant Design Vue 的 `Tabs`、`Card`、`Tag`、`Modal`、`Empty` 组件
- 需求 2：预约状态使用不同颜色标签：pending（蓝色）、completed（绿色）、cancelled（灰色）、no_show（红色）
- 需求 3：日期格式化使用 Day.js
- 需求 4：时段显示中文：morning→上午、afternoon→下午、evening→晚上

### 2.3 Constraints and Limitations

- 约束 1：患者未登录时应跳转到身份验证页面
- 约束 2：已完成和已取消的预约不可取消

## 3. Implementation Approach

### 3.1 Recommended Methodology

- 方法 1：参考现有 `Consultation.vue` 的页面结构和风格
- 方法 2：使用 Composition API（`<script setup lang="ts">`）
- 方法 3：使用 computed 属性实现筛选逻辑

### 3.2 Implementation Steps

1. 创建 `src/components/PatientAppointments.vue`
2. 实现患者登录检查逻辑
3. 使用 Store 的 `getAppointmentsByPatient` 获取数据
4. 实现 Tabs 筛选功能
5. 实现预约卡片列表渲染
6. 实现取消预约确认对话框
7. 实现空状态显示
8. 调整样式与项目风格一致

### 3.3 Technical Considerations

- 考虑 1：使用 `computed` 缓存筛选结果，避免重复计算
- 考虑 2：取消预约后列表自动更新（利用 Vue 响应式）
- 考虑 3：页面标题和面包屑导航

### 3.4 Reference to Project Context

- `.asdm/contexts/architecture.md`：组件架构和通信模式
- `.asdm/contexts/standard-coding-style.md`：编码规范

## 4. Acceptance Criteria

### 4.1 Primary Criteria

- **标准 1**：页面正确展示当前患者的预约记录
  - 测试方法：登录患者后访问页面，查看列表
  - **验证工具**：`npm run build`
- **标准 2**：筛选功能正确过滤预约记录
  - 测试方法：切换标签查看筛选结果
  - **验证工具**：`npm run build`
- **标准 3**：取消预约功能正常工作
  - 测试方法：点击取消按钮并确认，验证预约状态和排班名额更新
  - **验证工具**：`npm run build`
- **标准 4**：未登录患者被引导至验证页面
  - 测试方法：未登录时访问页面
  - **验证工具**：`npm run build`

### 4.2 Edge Cases

- 边界情况 1：患者无预约记录时显示空状态
- 边界情况 2：所有预约都是同一状态

### 4.3 Negative Tests

- 负面测试 1：已完成的预约不显示取消按钮

## 5. Dependencies

### 5.1 Task Dependencies

- **依赖于**: TASK-002（Store API 扩展 — 需要 getAppointmentsByPatient 和 cancelAppointment 方法）
- **阻塞**: TASK-008（路由和导航配置）

### 5.2 External Dependencies

- 库：Ant Design Vue（已在项目中）
- 库：Day.js（已在项目中）

### 5.3 Prerequisites

- 前提 1：TASK-002 Store API 已实现
- 前提 2：Store 中 currentPatient 状态可用

## 6. Estimated Effort

### 6.1 Effort Estimate

- **预估工时**：20 min
- **复杂度**：中
- **风险**：低

### 6.2 Effort Factors

- 因素 1：需要实现筛选和取消预约交互逻辑
- 因素 2：参考现有页面风格，工作量适中

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

- **构建验证**：`npm run build` — 编译成功且无错误
- **类型检查**：`npx vue-tsc --noEmit` — 类型检查通过
- **退出标准**：所有验证命令退出码为 0

### 7.2 Unit Testing

- 手动测试筛选和取消功能

### 7.3 Integration Testing

- 与 Store API 集成测试

### 7.4 Manual Testing

- 在浏览器中验证页面渲染和交互

## 8. Implementation Notes

- 注意 1：参考 `Consultation.vue` 的布局风格，保持一致性
- 注意 2：状态标签颜色：pending=blue、completed=green、cancelled=default、no_show=red
- 注意 3：时段映射：morning→上午、afternoon→下午、evening→晚上

## 9. Risks and Mitigations

### 风险 1

- **描述**：取消预约后的 UI 状态更新延迟
- **影响**：低
- **缓解**：利用 Vue 响应式特性，Store 更新后自动刷新

## 10. Deliverables

- 交付物 1：`src/components/PatientAppointments.vue` 页面组件

**强制交付物**：验证结果
- **构建输出**：`npm run build` 成功，退出码 0
- **类型检查输出**：`npx vue-tsc --noEmit` 成功，退出码 0

---

**Feature ID**: FEAT-001
**Task ID**: TASK-004
**Status**: TODO
**Created**: 2026-05-05
**Updated**: 2026-05-05
