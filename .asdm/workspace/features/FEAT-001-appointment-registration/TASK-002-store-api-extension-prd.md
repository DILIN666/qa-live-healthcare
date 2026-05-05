# Task PRD: Store API 扩展

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号
**Task ID**: TASK-002
**Created Date**: 2026-05-05
**Status**: TODO
**Language**: 简体中文

## 1. Task Overview

### 1.1 Task Summary

扩展 `src/store/index.ts` 中的 Store，添加排班和预约相关的响应式状态和方法，为前端组件提供数据操作接口。

### 1.2 Task Objectives

- 目标 1：在 Store 中初始化 `schedules` 和 `appointments` 响应式状态
- 目标 2：实现排班相关查询方法（按医生获取排班、获取可用时段等）
- 目标 3：实现预约 CRUD 方法（创建预约、取消预约、更新预约状态等）
- 目标 4：确保预约名额在创建/取消时正确更新

### 1.3 Related Feature Requirements

- 功能需求 REQ-001：医生排班管理 — 排班数据存储和查询
- 功能需求 REQ-002：预约挂号 — 预约创建和名额管理
- 功能需求 REQ-003：预约记录查询 — 按患者/医生查询预约
- 功能需求 REQ-004：取消预约 — 预约取消和名额释放
- 功能需求 REQ-005：预约状态管理 — 预约状态更新

## 2. Detailed Requirements

### 2.1 Functional Requirements

- 需求 1：添加排班查询方法 `getSchedulesByDoctor(doctorId: string): Schedule[]`
- 需求 2：添加可用时段查询方法 `getAvailableSchedules(doctorId: string): Schedule[]`（返回 bookedSlots < totalSlots 且日期 >= 今天的排班）
- 需求 3：添加创建预约方法 `createAppointment(data): Appointment`，同时更新对应排班的 bookedSlots +1
- 需求 4：添加取消预约方法 `cancelAppointment(appointmentId: string): void`，更新预约状态为 cancelled，同时更新对应排班的 bookedSlots -1
- 需求 5：添加按患者查询预约方法 `getAppointmentsByPatient(patientId: string): Appointment[]`
- 需求 6：添加按医生查询预约方法 `getAppointmentsByDoctor(doctorId: string): Appointment[]`
- 需求 7：添加更新预约状态方法 `updateAppointmentStatus(appointmentId: string, status: AppointmentStatus): void`
- 需求 8：添加获取排班剩余名额方法 `getAvailableSlots(scheduleId: string): number`

### 2.2 Technical Requirements

- 需求 1：所有方法使用 Vue 3 `reactive` 的响应式特性，状态变更自动触发 UI 更新
- 需求 2：预约创建需验证排班是否有剩余名额（bookedSlots < totalSlots）
- 需求 3：取消预约需验证预约状态是否为 pending（非 pending 状态不可取消）
- 需求 4：方法风格与现有 Store API 一致（参考 `addQuestion`、`answerQuestion` 等）

### 2.3 Constraints and Limitations

- 约束 1：数据存储在内存中（reactive 对象），刷新后数据丢失
- 约束 2：当前无真实后端，所有方法在客户端同步执行
- 约束 3：暂不处理并发预约问题，使用简单的先到先得逻辑

## 3. Implementation Approach

### 3.1 Recommended Methodology

- 方法 1：在 `src/store/index.ts` 的 `useStore` 返回对象中添加新方法
- 方法 2：排班和预约数据从 JSON 文件加载初始值（TASK-003 提供）
- 方法 3：操作方法内部包含数据校验和状态更新逻辑

### 3.2 Implementation Steps

1. 在 `state` 初始化中导入排班和预约的初始数据
2. 实现 `getSchedulesByDoctor` 方法
3. 实现 `getAvailableSchedules` 方法
4. 实现 `createAppointment` 方法（含名额检查和 bookedSlots 更新）
5. 实现 `cancelAppointment` 方法（含状态检查和 bookedSlots 回退）
6. 实现 `getAppointmentsByPatient` 和 `getAppointmentsByDoctor` 方法
7. 实现 `updateAppointmentStatus` 方法
8. 实现 `getAvailableSlots` 方法
9. 在 `useStore` 返回对象中导出所有新方法

### 3.3 Technical Considerations

- 考虑 1：`createAppointment` 需要生成唯一 ID，格式为 `appt` + `Date.now()`
- 考虑 2：`getAvailableSchedules` 需要使用 Day.js 进行日期比较
- 考虑 3：预约数据冗余存储患者和医生姓名，避免查询时的关联操作

### 3.4 Reference to Project Context

- `.asdm/contexts/data-models.md`：Store API 现有方法签名和风格
- `.asdm/contexts/standard-coding-style.md`：编码规范

## 4. Acceptance Criteria

### 4.1 Primary Criteria

- **标准 1**：`createAppointment` 能正确创建预约并更新排班 bookedSlots
  - 测试方法：调用后检查 appointments 数组长度和 schedule.bookedSlots 值
  - **验证工具**：`npm run build`（编译通过）
- **标准 2**：`cancelAppointment` 能取消预约并回退 bookedSlots
  - 测试方法：取消后检查预约状态和排班名额
  - **验证工具**：`npm run build`
- **标准 3**：所有查询方法返回正确的筛选结果
  - 测试方法：传入已知参数验证返回数据
  - **验证工具**：`npm run build`
- **标准 4**：名额已满时 `createAppointment` 应抛出错误或返回 null
  - 测试方法：在 bookedSlots === totalSlots 时调用创建
  - **验证工具**：`npm run build`

### 4.2 Edge Cases

- 边界情况 1：取消已取消的预约应不产生副作用
- 边界情况 2：取消已完成的预约应被拒绝
- 边界情况 3：查询不存在的医生排班应返回空数组

### 4.3 Negative Tests

- 负面测试 1：在排班已满时创建预约应失败
- 负面测试 2：对非 pending 状态的预约调用取消应失败

## 5. Dependencies

### 5.1 Task Dependencies

- **依赖于**: TASK-001（数据模型设计 — 需要 Schedule 和 Appointment 接口定义）
- **阻塞**: TASK-004、TASK-005、TASK-006、TASK-007

### 5.2 External Dependencies

- 库：Day.js（已在项目中使用）

### 5.3 Prerequisites

- 前提 1：TASK-001 完成后 Schedule 和 Appointment 接口已定义
- 前提 2：TASK-003 的 Mock 数据文件已创建（可先使用空数组占位）

## 6. Estimated Effort

### 6.1 Effort Estimate

- **预估工时**：15 min
- **复杂度**：中
- **风险**：低

### 6.2 Effort Factors

- 因素 1：需要实现 8 个方法，但逻辑较简单
- 因素 2：需确保与现有 Store 风格一致

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

- **构建验证**：`npm run build` — 编译成功且无错误
- **类型检查**：`npx vue-tsc --noEmit` — 类型检查通过
- **退出标准**：所有验证命令退出码为 0

### 7.2 Unit Testing

- 通过在浏览器开发者工具中调用 Store 方法进行手动验证

### 7.3 Integration Testing

- 集成测试将在组件开发任务中验证

### 7.4 Manual Testing

- 在浏览器中测试预约创建和取消流程

## 8. Implementation Notes

- 注意 1：参考现有 `addQuestion` 方法的实现模式（ID 生成、数据推入数组、返回新对象）
- 注意 2：`createAppointment` 的参数应包含 scheduleId、patientId、patientName、patientPhone、doctorId、doctorName、notes
- 注意 3：从 schedule 中自动获取 date 和 timeSlot，无需重复传入

## 9. Risks and Mitigations

### 风险 1

- **描述**：预约创建和排班名额更新不是原子操作
- **影响**：中
- **缓解**：在方法内部先检查名额再创建预约，使用同步操作避免竞态

## 10. Deliverables

- 交付物 1：`src/store/index.ts` 中新增的排班和预约相关状态初始化
- 交付物 2：8 个新的 Store 方法实现

**强制交付物**：验证结果
- **构建输出**：`npm run build` 成功，退出码 0
- **类型检查输出**：`npx vue-tsc --noEmit` 成功，退出码 0

---

**Feature ID**: FEAT-001
**Task ID**: TASK-002
**Status**: TODO
**Created**: 2026-05-05
**Updated**: 2026-05-05
