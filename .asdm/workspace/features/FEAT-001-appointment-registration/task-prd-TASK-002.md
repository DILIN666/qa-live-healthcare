# Task PRD: Store API 扩展

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号
**Task ID**: TASK-002
**Created Date**: 2026-04-29
**Status**: TODO
**Language**: 简体中文

---

## 1. 任务概述

### 1.1 任务摘要

扩展 `src/store/index.ts`，添加排班和预约相关的响应式状态（schedules、appointments）以及完整的业务方法，包括创建预约、取消预约、查询排班等。

### 1.2 任务目标

- **目标 1**：新增 `schedules` 响应式状态存储排班列表
- **目标 2**：新增 `appointments` 响应式状态存储预约列表
- **目标 3**：实现排班查询方法（按医生、按日期）
- **目标 4**：实现预约业务方法（创建、取消、标记状态）
- **目标 5**：实现名额管理（创建时 +1，取消时 -1）

### 1.3 关联功能需求

- 功能需求：REQ-001（医生排班管理）、REQ-002（预约挂号）、REQ-003（预约记录查询）、REQ-004（取消预约）、REQ-005（预约状态管理）
- 关联故事：故事 1、故事 2、故事 3

---

## 2. 详细需求

### 2.1 功能需求

- **FR-001**：新增状态
  - `schedules: Schedule[]` — 排班列表，响应式
  - `appointments: Appointment[]` — 预约列表，响应式

- **FR-002**：排班查询方法
  - `getSchedulesByDoctor(doctorId: string): Schedule[]` — 获取指定医生的所有排班
  - `getAvailableSlots(doctorId: string, date: string): Schedule[]` — 获取指定医生指定日期的可预约时段（bookedSlots < totalSlots）
  - `getScheduleById(scheduleId: string): Schedule | undefined` — 通过 ID 获取排班

- **FR-003**：预约创建方法
  - `createAppointment(data: CreateAppointmentData): Appointment` — 创建预约
    - 校验该时段是否仍有空位（bookedSlots < totalSlots）
    - 校验同一患者是否在同一时段有重复预约
    - 创建成功后，schedule.bookedSlots +1
    - 返回新创建的 Appointment 或抛出错误

- **FR-004**：预约取消方法
  - `cancelAppointment(appointmentId: string): void` — 取消预约
    - 仅能取消 status 为 `scheduled` 的预约
    - 取消后 status 改为 `cancelled`，cancelledAt 设为当前时间
    - 释放名额，schedule.bookedSlots -1

- **FR-005**：预约查询方法
  - `getAppointmentsByPatient(patientId: string): Appointment[]` — 获取患者的所有预约
  - `getAppointmentsByDoctor(doctorId: string): Appointment[]` — 获取医生的所有预约

- **FR-006**：预约状态更新方法
  - `markAppointmentArrived(appointmentId: string): void` — 标记已到诊
  - `markAppointmentNoShow(appointmentId: string): void` — 标记未到诊

### 2.2 技术需求

- 文件路径：`src/store/index.ts`
- 导入 `Schedule` 和 `Appointment` 类型从 `src/types/appointment.ts`
- 初始化 `schedules` 和 `appointments` 从本地 JSON 数据文件（由 TASK-003 创建）
- 所有方法添加到 store 的方法导出中
- 遵循 `.asdm/contexts/standard-coding-style.md` 中的函数定义规范
- 参考 `.asdm/contexts/data-models.md` 中的 Store API 设计风格

### 2.3 约束与限制

- 不直接操作 DOM
- 不创建新的 Store 文件，在现有 `src/store/index.ts` 中扩展
- 预约创建失败时抛出明确错误信息（如"该时段已满"、"您已预约该时段"）

---

## 3. 实现方案

### 3.1 推荐方法

扩展现有的 `src/store/index.ts`（参考其中的 reactive 响应式状态模式和现有方法组织方式）。在文件末尾添加新状态和方法，保持与现有代码风格一致。

### 3.2 实现步骤

1. **导入类型**：在文件顶部导入 `Schedule`、`Appointment`、`AppointmentStatus`、`TimeSlot` 类型
2. **添加状态**：在 `state` 中添加 `schedules` 和 `appointments` 响应式状态
3. **初始化数据**：从 `../data/schedule-list.json` 和 `../data/appointment-list.json` 加载初始数据
4. **实现排班方法**：实现 FR-002 中的 3 个排班查询方法
5. **实现预约方法**：实现 FR-003（创建预约，含名额校验和更新）
6. **实现取消方法**：实现 FR-004（取消预约，释放名额）
7. **实现查询方法**：实现 FR-005 中的 2 个查询方法
8. **实现状态方法**：实现 FR-006 中的 2 个状态更新方法
9. **导出方法**：确保所有方法在返回对象中导出
10. **验证**：运行 TypeScript 类型检查和项目构建

### 3.3 技术注意事项

- **名额校验**：在 `createAppointment` 中，先检查 `schedule.bookedSlots < schedule.totalSlots`，否则抛出错误
- **重复预约校验**：检查 `appointments` 中是否存在 patientId 和 scheduleId 均相同且 status 为 `scheduled` 的记录
- **状态更新校验**：只有 `scheduled` 状态的预约才能被取消或标记
- **名额释放时机**：取消预约时，先更新 appointment.status，再执行 schedule.bookedSlots -1

### 3.4 项目上下文引用

- `.asdm/contexts/data-models.md` — Store API 设计参考
- `.asdm/contexts/standard-coding-style.md` — 函数定义规范
- `.asdm/workspace/features/FEAT-001-appointment-registration/task-prd-TASK-001.md` — 类型定义参考

---

## 4. 验收标准

### 4.1 核心标准

- **AC-001**：新增状态可正常初始化
  - 验证工具：`tsc --noEmit`
  - 期望结果：TypeScript 编译无错误，`schedules` 和 `appointments` 响应式

- **AC-002**：`createAppointment` 名额已满时抛出错误
  - 验证工具：手动测试，当 bookedSlots === totalSlots 时调用应抛出错误
  - 期望结果：抛出 "该时段已满" 错误

- **AC-003**：`createAppointment` 重复预约时抛出错误
  - 验证工具：手动测试，同一患者同一时段重复预约应抛出错误
  - 期望结果：抛出 "您已预约该时段" 错误

- **AC-004**：`cancelAppointment` 正确释放名额
  - 验证工具：手动测试，取消预约后对应 schedule 的 bookedSlots -1
  - 期望结果：bookedSlots 减少 1，appointment.status 变为 cancelled

- **AC-005**：所有新增方法类型正确
  - 验证工具：`tsc --noEmit`
  - 期望结果：TypeScript 编译无错误

### 4.2 边界情况

- **BC-001**：取消已取消的预约 → 抛出 "预约状态不可取消" 错误
- **BC-002**：标记已完成的预约 → 抛出 "只能标记待就诊的预约" 错误
- **BC-003**：查询无排班医生的日程 → 返回空数组，不报错
- **BC-004**：取消不存在的预约 → 抛出 "预约不存在" 错误

### 4.3 负面测试

- **NC-001**：创建预约时 scheduleId 不存在 → 抛出错误
- **NC-002**：传入空字符串 patientId → 校验应拒绝

---

## 5. 依赖关系

### 5.1 任务依赖

- **前置依赖**：TASK-001（数据模型设计）
- **阻塞任务**：
  - TASK-004（预约页面开发）依赖本任务
  - TASK-005（排班选择组件）依赖本任务
  - TASK-006（预约表单组件）依赖本任务
  - TASK-007（医生预约列表页）依赖本任务

### 5.2 外部依赖

- `src/types/appointment.ts`（TASK-001 输出）
- `src/data/schedule-list.json`（TASK-003 输出）
- `src/data/appointment-list.json`（TASK-003 输出）
- Day.js（已在项目中使用）

### 5.3 前置条件

- TASK-001 必须完成
- TASK-003 必须完成（或暂时使用空数组初始化，后续替换）

---

## 6. 预估工作量

- **预估工时**：15 分钟
- **复杂度**：中
- **风险**：中（名额并发校验逻辑较复杂）

### 6.1 影响工时的因素

- 与 TASK-003 的数据文件接口约定需要准确
- 名额校验和重复预约校验逻辑需要仔细设计
- 需要确保与现有 store 代码风格一致

---

## 7. 测试策略

### 7.1 自动化验证（必需）

- **类型检查**：`tsc --noEmit`
  - 验证所有新增代码类型正确
  - 退出码 0 表示成功
- **项目构建**：`npm run build`
  - 验证代码可正常构建
  - 退出码 0 表示成功

### 7.2 集成测试

- TASK-004 及后续任务开发时，会通过实际调用验证本任务的 Store API 正确性

### 7.3 手动测试

- 创建预约 → 检查 schedules 中 bookedSlots 是否 +1
- 取消预约 → 检查 schedules 中 bookedSlots 是否 -1，appointments 中 status 是否为 cancelled
- 名额已满时创建预约 → 验证是否抛出错误
- 重复预约 → 验证是否抛出错误

---

## 8. 实施笔记

### 8.1 实施指导

参考 `src/store/index.ts` 中现有的 `addQuestion` 和 `answerQuestion` 方法的组织风格：

```typescript
// 新增状态
schedules: [] as Schedule[],
appointments: [] as Appointment[],

// 新增方法示例结构
createAppointment(data: CreateAppointmentData): Appointment {
  // 1. 名额校验
  // 2. 重复预约校验
  // 3. 创建预约对象
  // 4. 更新 bookedSlots
  // 5. 返回结果
}
```

### 8.2 类型定义辅助

需要定义 `CreateAppointmentData` 输入类型：

```typescript
interface CreateAppointmentData {
  patientId: string;
  patientName: string;
  phone: string;
  doctorId: string;
  doctorName: string;
  scheduleId: string;
  notes?: string;
}
```

### 8.3 错误处理模式

```typescript
function throwError(message: string): never {
  throw new Error(message);
}
```

---

## 9. 风险与应对

### 风险 1：名额并发问题

- **描述**：多个用户同时预约同一时段，可能在检查时均有空位，但实际只能接受一人
- **影响**：高
- **应对**：在创建预约的方法内部，使用同步的检查-创建-更新原子操作，前端层面保证顺序执行；后续接入后端后由数据库事务保证

### 风险 2：数据初始化顺序问题

- **描述**：TASK-003 尚未完成时，store 初始化可能报错
- **影响**：中
- **应对**：使用 `try-catch` 包裹数据加载，或暂时用空数组初始化，待 TASK-003 完成后替换

---

## 10. 交付物

- 更新后的 `src/store/index.ts`（包含新增状态和方法）

### 必需交付物：验证结果

- **编译输出**：运行 `tsc --noEmit` 无错误
- **构建输出**：运行 `npm run build` 成功，退出码 0

---

**Task ID**: TASK-002
**Status**: TODO
**Updated**: 2026-04-29
