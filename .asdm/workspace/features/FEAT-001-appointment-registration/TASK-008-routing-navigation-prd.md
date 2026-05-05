# Task PRD: 路由与导航配置

**Feature ID**: FEAT-001-appointment-registration
**Feature Name**: 预约挂号
**Task ID**: TASK-008
**Created Date**: 2026-05-05
**Status**: TODO
**Language**: zh-CN

## 1. Task Overview

### 1.1 Task Summary
在路由配置中新增预约挂号页面路由，并在导航栏和首页添加入口链接，让用户可以访问预约挂号功能。

### 1.2 Task Objectives
- 新增预约挂号路由（通用入口 + 指定医生入口）
- 在 AppHeader 导航菜单中添加"预约挂号"入口
- 在首页添加"预约挂号"操作按钮

### 1.3 Related Feature Requirements
- Feature REQ-007: 新增路由和导航入口
- Related Stories: Story 1, Story 2, Story 4

## 2. Detailed Requirements

### 2.1 Functional Requirements
- 新增路由 `/appointments` — 预约挂号通用入口（需选择医生）
- 新增路由 `/appointments/:doctorUsername` — 指定医生的预约挂号
- AppHeader 导航菜单添加"预约挂号"菜单项
- 首页（Home.vue）的诊室卡片添加"预约挂号"按钮

### 2.2 Technical Requirements
- 路由定义在 `src/router/index.ts`
- 路由组件使用 `AppointmentRegistration.vue`
- AppHeader 修改 `src/components/AppHeader.vue`
- Home 修改 `src/views/Home.vue`
- 路由名称：`Appointments` 和 `AppointmentDoctor`

### 2.3 Constraints and Limitations
- 遵循现有路由命名和结构约定
- 保持与现有导航菜单风格一致

## 3. Implementation Approach

### 3.1 Recommended Methodology
参考现有 Consultation 路由的双模式设计（通用 + 指定医生），添加预约挂号路由。

### 3.2 Implementation Steps
1. 在 `src/router/index.ts` 添加两条路由
2. 在 `src/components/AppHeader.vue` 菜单中添加"预约挂号"项
3. 在 `src/views/Home.vue` 诊室卡片区域添加"预约挂号"按钮/链接

### 3.3 Technical Considerations
- 路由 path 命名与现有 `/consultation` 模式保持一致
- 导航菜单项顺序：首页 | 预约挂号 | 医生团队 | 关于我们
- 首页诊室卡片添加链接：`/appointments/${doctor.username}`

### 3.4 Reference to Project Context
- `.asdm/contexts/api.md`: 路由表结构
- `.asdm/contexts/architecture.md`: 路由配置模式

## 4. Acceptance Criteria

### 4.1 Primary Criteria
- **Criterion 1**: 访问 `/appointments` 显示预约挂号页面
  - Test method: 浏览器访问
  - **Validation tool**: `npm run build`
- **Criterion 2**: 访问 `/appointments/dr-zhang-wei` 显示指定医生的预约挂号
  - Test method: 浏览器访问
  - **Validation tool**: `npm run build`
- **Criterion 3**: AppHeader 显示"预约挂号"菜单项，点击跳转正确
  - Test method: 手动测试
  - **Validation tool**: `npm run build`
- **Criterion 4**: 首页诊室卡片有"预约挂号"链接
  - Test method: 手动测试
  - **Validation tool**: `npm run build`

### 4.2 Edge Cases
- 不存在的医生 username 应在页面中处理

### 4.3 Negative Tests
- 路由不匹配时显示 404（或现有兜底逻辑）

## 5. Dependencies

### 5.1 Task Dependencies
- **Depends on**: TASK-004 (患者预约页面), TASK-007 (医生预约管理页面)
- **Blocks**: 无

### 5.2 External Dependencies
- 无

### 5.3 Prerequisites
- 预约挂号页面组件已创建

## 6. Estimated Effort

### 6.1 Effort Estimate
- **Estimated effort**: 10 min
- **Complexity**: Low
- **Risk**: Low

### 6.2 Effort Factors
- 仅配置路由和添加导航入口，改动量小

## 7. Testing Strategy

### 7.1 Automated Validation (Required)
- **Build validation**: `npm run build` — 编译通过
- **Exit criteria**: exit code 0

### 7.2 Manual Testing
- 点击导航菜单 → 验证路由跳转
- 点击首页诊室卡片"预约挂号" → 验证跳转到指定医生页面

## 8. Implementation Notes

- 路由配置示例：
  ```typescript
  {
    path: '/appointments',
    name: 'Appointments',
    component: () => import('../views/AppointmentRegistration.vue')
  },
  {
    path: '/appointments/:doctorUsername',
    name: 'AppointmentDoctor',
    component: () => import('../views/AppointmentRegistration.vue')
  }
  ```
- AppHeader 菜单项：
  ```html
  <a-menu-item key="appointments">
    <router-link to="/appointments">预约挂号</router-link>
  </a-menu-item>
  ```

## 9. Risks and Mitigations

- 无明显风险

## 10. Deliverables

- 更新后的 `src/router/index.ts`
- 更新后的 `src/components/AppHeader.vue`
- 更新后的 `src/views/Home.vue`
- **Validation Results**: `npm run build` 通过
