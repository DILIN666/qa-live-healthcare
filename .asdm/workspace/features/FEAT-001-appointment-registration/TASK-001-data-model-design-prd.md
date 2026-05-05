# Task PRD: 数据模型设计

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号
**Task ID**: TASK-001
**Created Date**: 2026-05-05
**Status**: TODO
**Language**: 简体中文

## 1. Task Overview

### 1.1 Task Summary

定义预约挂号功能所需的 `Schedule`（排班）和 `Appointment`（预约）TypeScript 接口，为后续 Store API 扩展和组件开发提供类型基础。

### 1.2 Task Objectives

- 目标 1：定义 `Schedule` 接口，描述医生门诊排班信息
- 目标 2：定义 `Appointment` 接口，描述患者预约记录
- 目标 3：定义相关枚举类型（时段、预约状态等）
- 目标 4：在 `src/store/index.ts` 中添加接口声明

### 1.3 Related Feature Requirements

- 功能需求 REQ-001：医生排班管理 — 需要排班数据模型支撑
- 功能需求 REQ-002：预约挂号 — 需要预约数据模型支撑
- 功能需求 REQ-005：预约状态管理 — 需要预约状态枚举定义
- 关联用户故事：故事 1（患者预约门诊）、故事 3（医生查看预约）

## 2. Detailed Requirements

### 2.1 Functional Requirements

- 需求 1：定义 `Schedule` 接口，包含字段：id、doctorId、date、timeSlot（上午/下午/晚上）、totalSlots（可预约名额）、bookedSlots（已预约数）、isActive
- 需求 2：定义 `Appointment` 接口，包含字段：id、scheduleId、patientId、patientName、patientPhone、doctorId、doctorName、date、timeSlot、status、notes、createdAt、cancelledAt
- 需求 3：定义 `TimeSlot` 枚举类型：morning、afternoon、evening
- 需求 4：定义 `AppointmentStatus` 枚举类型：pending、completed、cancelled、no_show
- 需求 5：在 Store 的 State 接口中新增 `schedules` 和 `appointments` 状态声明

### 2.2 Technical Requirements

- 需求 1：TypeScript 接口定义遵循项目现有编码风格（参考 `Doctor`、`Patient`、`Question` 接口）
- 需求 2：字段命名使用 camelCase，与项目现有模型一致
- 需求 3：时间字段使用 ISO 8601 字符串格式
- 需求 4：ID 格式参考现有模型（schedule: `sch001`，appointment: `appt` + 时间戳）

### 2.3 Constraints and Limitations

- 约束 1：不修改现有 `Doctor`、`Patient`、`Question` 接口
- 约束 2：当前为前端模拟数据阶段，无需考虑后端数据库约束
- 约束 3：排班模型初期仅支持固定排班，暂不处理节假日等特殊情况

## 3. Implementation Approach

### 3.1 Recommended Methodology

- 方法 1：参考 `.asdm/contexts/data-models.md` 中的扩展模型建议进行设计
- 方法 2：在 `src/store/index.ts` 文件中现有接口定义之后添加新接口
- 方法 3：使用 TypeScript 的联合字面量类型代替枚举（与项目风格一致）

### 3.2 Implementation Steps

1. 在 `src/store/index.ts` 中，在 `Question` 接口之后添加 `TimeSlot` 类型定义
2. 添加 `AppointmentStatus` 类型定义
3. 添加 `Schedule` 接口定义
4. 添加 `Appointment` 接口定义
5. 更新 `State` 接口，添加 `schedules: Schedule[]` 和 `appointments: Appointment[]`
6. 在 `state` 初始化中添加空数组或导入初始数据

### 3.3 Technical Considerations

- 考虑 1：`Schedule.bookedSlots` 应在创建预约时自动递增，取消预约时自动递减
- 考虑 2：`Appointment` 冗余存储 `patientName` 和 `doctorName`，与 `Question` 模型设计一致
- 考虑 3：使用联合字面量类型 `'morning' | 'afternoon' | 'evening'` 代替 enum，与项目现有 `status: 'pending' | 'answered'` 风格一致

### 3.4 Reference to Project Context

- `.asdm/contexts/data-models.md`：现有数据模型定义和扩展建议
- `.asdm/contexts/standard-coding-style.md`：编码规范

## 4. Acceptance Criteria

### 4.1 Primary Criteria

- **标准 1**：`Schedule` 接口定义完整，包含所有必要字段
  - 测试方法：TypeScript 编译无错误
  - **验证工具**：`npx tsc --noEmit`
- **标准 2**：`Appointment` 接口定义完整，包含所有必要字段
  - 测试方法：TypeScript 编译无错误
  - **验证工具**：`npx tsc --noEmit`
- **标准 3**：`State` 接口正确包含 `schedules` 和 `appointments` 字段
  - 测试方法：TypeScript 编译无错误
  - **验证工具**：`npx tsc --noEmit`

### 4.2 Edge Cases

- 边界情况 1：`bookedSlots` 不应超过 `totalSlots`
- 边界情况 2：`Appointment` 的 `notes` 字段允许为空字符串

### 4.3 Negative Tests

- 负面测试 1：缺少必要字段的类型定义应导致 TypeScript 编译错误
- 负面测试 2：状态值不在联合类型范围内应导致编译错误

## 5. Dependencies

### 5.1 Task Dependencies

- **依赖于**: 无（此任务是所有其他任务的基础）
- **阻塞**: TASK-002（Store API 扩展）、TASK-003（Mock 数据创建）

### 5.2 External Dependencies

- 无外部依赖

### 5.3 Prerequisites

- 前提 1：项目已正确配置 TypeScript
- 前提 2：`src/store/index.ts` 文件存在

## 6. Estimated Effort

### 6.1 Effort Estimate

- **预估工时**：10 min
- **复杂度**：低
- **风险**：低

### 6.2 Effort Factors

- 因素 1：参考现有模型定义，复杂度低
- 因素 2：仅新增接口定义，不修改现有代码

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

- **构建验证**：`npm run build` — 编译成功且无错误
- **类型检查**：`npx vue-tsc --noEmit` — 类型检查通过
- **退出标准**：所有验证命令退出码为 0

### 7.2 Unit Testing

- 本任务为接口定义，无需单独的单元测试
- 类型安全性通过 TypeScript 编译器验证

### 7.3 Integration Testing

- 集成测试将在后续任务中通过 Store API 验证

### 7.4 Manual Testing

- 在 IDE 中检查新增接口的智能提示是否正确

## 8. Implementation Notes

- 注意 1：参考 `data-models.md` 第 7.2 节的扩展模型示例，但根据预约挂号场景进行调整
- 注意 2：`Appointment` 的 `status` 使用 `'pending' | 'completed' | 'cancelled' | 'no_show'`，注意 `pending` 表示"待就诊"
- 注意 3：`Schedule` 的 `timeSlot` 字段需要与 `Appointment` 的 `timeSlot` 类型一致

## 9. Risks and Mitigations

### 风险 1

- **描述**：接口设计与后续实现不匹配
- **影响**：低
- **缓解**：严格按照 Feature PRD 和现有数据模型风格设计

## 10. Deliverables

- 交付物 1：`src/store/index.ts` 中新增的 `Schedule` 和 `Appointment` 接口定义
- 交付物 2：更新的 `State` 接口

**强制交付物**：验证结果
- **构建输出**：`npm run build` 成功，退出码 0
- **类型检查输出**：`npx vue-tsc --noEmit` 成功，退出码 0

---

**Feature ID**: FEAT-001
**Task ID**: TASK-001
**Status**: TODO
**Created**: 2026-05-05
**Updated**: 2026-05-05
