# Task PRD: 数据模型设计

**Feature ID**: FEAT-001-appointment-registration
**Feature Name**: 预约挂号
**Task ID**: TASK-001
**Created Date**: 2026-05-05
**Status**: TODO
**Language**: zh-CN

## 1. Task Overview

### 1.1 Task Summary
在 `src/store/index.ts` 中新增 `Schedule`（排班）和 `Appointment`（预约）接口定义，并扩展 `State` 接口。这是整个功能的基础任务，后续所有任务都依赖此数据模型。

### 1.2 Task Objectives
- 定义 `Schedule` 接口，包含排班的核心字段
- 定义 `Appointment` 接口，包含预约的核心字段和状态枚举
- 扩展 `State` 接口，新增 `schedules` 和 `appointments` 数组

### 1.3 Related Feature Requirements
- Feature REQ-001: 新增 Schedule 数据模型
- Feature REQ-002: 新增 Appointment 数据模型
- Related Stories: Story 1, Story 2, Story 3, Story 4, Story 5

## 2. Detailed Requirements

### 2.1 Functional Requirements
- 定义 `TimeSlot` 类型：`'morning' | 'afternoon'`
- 定义 `AppointmentStatus` 类型：`'booked' | 'completed' | 'no_show' | 'cancelled'`
- 定义 `Schedule` 接口，字段包括：id, doctorId, doctorName, date, timeSlot, totalSlots, bookedCount
- 定义 `Appointment` 接口，字段包括：id, scheduleId, patientId, patientName, doctorId, doctorName, date, timeSlot, status, symptoms, createTime, updateTime
- 扩展 `State` 接口，新增 `schedules: Schedule[]` 和 `appointments: Appointment[]`

### 2.2 Technical Requirements
- 接口定义放在 `src/store/index.ts` 顶部，与现有 Doctor/Patient/Question 接口并列
- 遵循现有命名约定和代码风格
- ID 格式沿用 `Date.now()` 前缀模式：`schedule${Date.now()}`、`appt${Date.now()}`

### 2.3 Constraints and Limitations
- 不引入新的外部依赖
- 保持与现有接口定义风格一致（冗余存储 doctorName/patientName）

## 3. Implementation Approach

### 3.1 Recommended Methodology
直接在 `src/store/index.ts` 中添加类型定义和接口，与现有代码保持一致。

### 3.2 Implementation Steps
1. 在 `src/store/index.ts` 顶部现有接口定义之后添加 `TimeSlot` 和 `AppointmentStatus` 类型
2. 添加 `Schedule` 接口定义
3. 添加 `Appointment` 接口定义
4. 修改 `State` 接口，新增 `schedules` 和 `appointments` 字段
5. 在 `state` 初始化中添加 `schedules: []` 和 `appointments: []`

### 3.3 Technical Considerations
- `Schedule.bookedCount` 不存储在 JSON 中，而是从 appointments 动态计算（但为简化演示，仍作为字段存储）
- `Appointment` 中冗余存储 `doctorName`、`patientName`、`date`、`timeSlot`，遵循现有反规范化模式

### 3.4 Reference to Project Context
- `.asdm/contexts/data-models.md`: 现有数据模型和接口定义模式
- `.asdm/contexts/architecture.md`: Reactive Store 模式

## 4. Acceptance Criteria

### 4.1 Primary Criteria
- **Criterion 1**: `Schedule` 和 `Appointment` 接口在 `src/store/index.ts` 中定义完整
  - Test method: TypeScript 编译无错误
  - **Validation tool**: `npx vue-tsc --noEmit`
- **Criterion 2**: `State` 接口包含 `schedules` 和 `appointments` 字段
  - Test method: TypeScript 编译无错误
  - **Validation tool**: `npx vue-tsc --noEmit`
- **Criterion 3**: `state` 初始化包含空数组
  - Test method: 应用启动无运行时错误
  - **Validation tool**: `npm run build`

### 4.2 Edge Cases
- 无特殊边界情况（纯类型定义）

### 4.3 Negative Tests
- 确保不影响现有 Doctor/Patient/Question 接口
- 确保 `npm run build` 仍然通过

## 5. Dependencies

### 5.1 Task Dependencies
- **Depends on**: NONE
- **Blocks**: TASK-002, TASK-003

### 5.2 External Dependencies
- 无

### 5.3 Prerequisites
- 现有 Store 代码正常工作

## 6. Estimated Effort

### 6.1 Effort Estimate
- **Estimated effort**: 10 min
- **Complexity**: Low
- **Risk**: Low

### 6.2 Effort Factors
- 仅添加类型定义，改动范围小且明确

## 7. Testing Strategy

### 7.1 Automated Validation (Required)
- **Build validation**: `npm run build` — 确保编译通过
- **Type checking**: `npx vue-tsc --noEmit` — 确保类型正确
- **Exit criteria**: 所有命令 exit code 0

### 7.2 Unit Testing
- 本任务为类型定义，无需单独单元测试

### 7.3 Integration Testing
- 在后续任务中通过 Store 方法使用验证

### 7.4 Manual Testing
- 在浏览器控制台检查 `store.state.schedules` 和 `store.state.appointments` 为空数组

## 8. Implementation Notes

- Schedule 接口参考：
  ```typescript
  interface Schedule {
    id: string;
    doctorId: string;
    doctorName: string;
    date: string;           // YYYY-MM-DD
    timeSlot: TimeSlot;     // 'morning' | 'afternoon'
    totalSlots: number;     // 号源总数
    bookedCount: number;    // 已预约数
  }
  ```
- Appointment 接口参考：
  ```typescript
  interface Appointment {
    id: string;
    scheduleId: string;
    patientId: string;
    patientName: string;
    doctorId: string;
    doctorName: string;
    date: string;
    timeSlot: TimeSlot;
    status: AppointmentStatus;
    symptoms: string;       // 症状描述（可选）
    createTime: string;
    updateTime: string;
  }
  ```

## 9. Risks and Mitigations

### Risk 1
- **Description**: 类型定义可能与后续 Store 方法需求不完全匹配
- **Impact**: Low
- **Mitigation**: 参考 Feature PRD 中的详细字段设计，与现有模式保持一致

## 10. Deliverables

- 更新后的 `src/store/index.ts`，包含 Schedule、Appointment 接口和扩展的 State 接口
- **Validation Results**: `npm run build` 和 `npx vue-tsc --noEmit` 通过
