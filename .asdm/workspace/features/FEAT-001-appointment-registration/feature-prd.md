# Feature PRD: 预约挂号

**Feature ID**: FEAT-001-appointment-registration
**Created Date**: 2026-05-05
**Status**: PLANNED
**Language**: zh-CN

## 1. Overview

### 1.1 Feature Summary

在现有医疗问诊平台中新增"预约挂号"功能，让患者可以预约医生的线下门诊。当前平台仅支持在线文字问诊，缺少线下门诊预约能力。本功能将补齐"线下门诊"场景，使患者能够查看医生排班、选择就诊时段并提交预约，医生可以管理排班和查看预约列表。

### 1.2 Objectives

- **Objective 1**: 为患者提供查看医生排班并预约线下门诊的能力
- **Objective 2**: 为医生提供管理排班和查看预约列表的能力
- **Objective 3**: 复用现有技术栈（Vue 3 + TypeScript + Ant Design Vue + reactive Store），保持架构一致性
- **Objective 4**: 遵循现有数据模型和 Store 方法模式，最小化侵入性改动

## 2. User Stories

### Story 1: 患者查看医生排班

**As a** 患者
**I want to** 查看医生的门诊排班信息
**So that** 我可以了解医生何时有线下门诊，选择合适的时间就诊

**Acceptance Criteria**:
- 在医生详情/问诊页面可查看该医生的排班日历
- 排班信息包含：日期、时段（上午/下午）、剩余号源
- 仅有排班的日期和时段才显示为可预约状态

### Story 2: 患者预约挂号

**As a** 患者
**I want to** 选择排班时段并提交预约挂号
**So that** 我可以预约医生的线下门诊

**Acceptance Criteria**:
- 已验证身份的患者可以选择排班时段提交预约
- 预约需填写症状描述（可选）
- 提交后生成预约记录，状态为"已预约"
- 同一排班号源用完后不可再预约

### Story 3: 患者查看我的预约

**As a** 患者
**I want to** 查看我的所有预约挂号记录
**So that** 我可以管理自己的就诊安排

**Acceptance Criteria**:
- 问诊页面展示当前患者的预约列表
- 显示预约医生、日期、时段、状态
- 支持"取消预约"操作

### Story 4: 医生管理排班

**As a** 医生
**I want to** 设置我的门诊排班
**So that** 患者可以按排班预约我的门诊

**Acceptance Criteria**:
- 医生在诊室页面可以添加排班
- 排班包含：日期、时段（上午/下午）、号源数量
- 可以删除排班（已有预约的排班不可删除）

### Story 5: 医生查看预约列表

**As a** 医生
**I want to** 查看患者对我的预约挂号列表
**So that** 我可以了解门诊就诊安排

**Acceptance Criteria**:
- 医生诊室页面展示预约列表
- 按日期和时段分组显示
- 可以标记预约为"已完成"或"未到"

## 3. Functional Requirements

### Requirement 1
- **ID**: REQ-001
- **Description**: 新增 Schedule（排班）数据模型，包含医生ID、日期、时段、号源总数、已预约数量
- **Priority**: High
- **Related Stories**: Story 1, Story 4

### Requirement 2
- **ID**: REQ-002
- **Description**: 新增 Appointment（预约）数据模型，包含患者ID、医生ID、排班ID、预约时间、状态、症状描述
- **Priority**: High
- **Related Stories**: Story 2, Story 3, Story 5

### Requirement 3
- **ID**: REQ-003
- **Description**: 扩展 Store，新增排班和预约的 CRUD 方法（约 8 个方法）
- **Priority**: High
- **Related Stories**: Story 1, Story 2, Story 3, Story 4, Story 5

### Requirement 4
- **ID**: REQ-004
- **Description**: 患者端：在问诊页面添加"预约挂号"Tab，展示排班日历和预约表单
- **Priority**: High
- **Related Stories**: Story 1, Story 2, Story 3

### Requirement 5
- **ID**: REQ-005
- **Description**: 医生端：在诊室页面添加"排班管理"和"预约列表"Tab
- **Priority**: High
- **Related Stories**: Story 4, Story 5

### Requirement 6
- **ID**: REQ-006
- **Description**: 创建排班和预约的模拟 JSON 数据
- **Priority**: Medium
- **Related Stories**: Story 1, Story 4

### Requirement 7
- **ID**: REQ-007
- **Description**: 新增路由和导航入口，连接预约挂号页面
- **Priority**: Medium
- **Related Stories**: Story 1, Story 2, Story 4

## 4. Non-Functional Requirements

### 4.1 Performance
- 排班日历渲染时间 < 500ms（数据量小，内存操作即可满足）
- 预约提交响应时间 < 200ms

### 4.2 Security
- 仅已验证身份的患者可提交预约（复用现有 verifyPatient 机制）
- 仅已登录医生可管理排班（复用现有 loginDoctor 机制）
- 预约操作需校验患者身份和排班可用性

### 4.3 Scalability
- 当前为前端内存方案，排班和预约数据随页面刷新丢失（与现有模式一致）
- 后端化时应将排班和预约数据迁移至数据库

### 4.4 Reliability
- 号源不足时提示明确错误信息
- 预约操作需保证原子性：扣减号源和创建预约需同步完成

## 5. Technical Requirements

### 5.1 Architecture Considerations
- **数据模型扩展**：在 `src/store/index.ts` 中新增 `Schedule` 和 `Appointment` 接口
- **Store 状态扩展**：State 接口新增 `schedules` 和 `appointments` 数组
- **模拟数据**：在 `src/data/` 下新增 `schedule-list.json` 和 `appointment-list.json`
- **组件模式**：遵循现有 `<script setup lang="ts">` + Ant Design Vue 组件模式

### 5.2 Dependencies
- **内部依赖**：现有 Store 的 `verifyPatient`、`loginDoctor`、`getDoctorByUsername` 方法
- **外部依赖**：Ant Design Vue 的 Calendar/DatePicker、Tabs、Table 等组件；dayjs 日期处理

### 5.3 Constraints
- 纯前端实现，无后端 API，所有数据存储在内存中
- 遵循现有 reactive Store 模式，不引入 Pinia/Vuex
- ID 生成沿用 `Date.now()` 前缀模式

## 6. Success Criteria

- 患者可以查看任意医生的排班日历并成功提交预约
- 医生可以添加排班并查看预约列表
- 预约状态流转完整：已预约 → 已完成 / 未到 / 已取消
- 号源扣减逻辑正确，超出号源不可预约
- 新增代码风格与现有代码一致（TypeScript + `<script setup>`）
- 所有新页面可通过导航正常访问

## 7. Task Breakdown Principles

### 7.1 Granularity
- 每个任务限定为 AI 模型 5-10 分钟的工作量
- 任务应聚焦且可独立验证

### 7.2 Independence
- 数据模型和 Store 扩展为基础任务，UI 任务可并行开发
- 患者端和医生端页面相互独立

### 7.3 Testability
- 每个任务有明确的验收标准
- 数据层任务可通过控制台验证，UI 任务可通过视觉验证

### 7.4 Task Categories
- 分析和设计：数据模型设计
- 代码实现：Store 扩展、模拟数据、页面开发、路由配置

### 7.5 Task Count Limitation
- 目标任务数 ≤ 10，超出则分解为子功能

## 8. Implementation Notes

- 排班时段使用枚举值：`morning`（上午 08:00-12:00）、`afternoon`（下午 14:00-17:00）
- 预约状态枚举：`booked`（已预约）、`completed`（已完成）、`no_show`（未到）、`cancelled`（已取消）
- 排班日历优先使用 Ant Design Vue 的 Calendar 组件，展示有排班的日期标记
- 医生排班管理使用简单的表单 + 列表模式，无需复杂日历交互
- 预约列表在医生端使用 Table 组件按日期分组展示

## 9. Risks and Mitigations

### Risk 1
- **Description**: Ant Design Vue Calendar 组件定制性有限，排班日历展示可能不够直观
- **Impact**: Medium
- **Mitigation**: 优先使用简单列表/卡片展示排班，日历作为增强功能；若 Calendar 不满足需求，使用自定义日历组件

### Risk 2
- **Description**: 号源并发扣减在内存 Store 中可能存在竞态条件
- **Impact**: Low
- **Mitigation**: 当前为单用户前端应用，实际不存在并发；方法内做好可用性校验即可

### Risk 3
- **Description**: 功能范围扩展风险，如支付集成、短信提醒等
- **Impact**: Low
- **Mitigation**: 本期仅实现核心预约功能，支付和通知列为未来增强

## 10. Appendix

### 10.1 References
- 现有数据模型：`.asdm/contexts/data-models.md`
- 现有 API：`.asdm/contexts/api.md`
- 系统架构：`.asdm/contexts/architecture.md`

### 10.2 Glossary
- **排班（Schedule）**: 医生设置的门诊时间安排，包含日期、时段和号源数量
- **预约（Appointment）**: 患者提交的挂号记录，关联排班和患者
- **号源**: 某排班可预约的数量，用总数减去已预约数得到剩余号源
- **时段**: 门诊时间分段，当前支持上午和下午
