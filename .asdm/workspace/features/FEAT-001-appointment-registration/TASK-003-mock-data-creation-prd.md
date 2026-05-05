# Task PRD: Mock 数据创建

**Feature ID**: FEAT-001-appointment-registration
**Feature Name**: 预约挂号
**Task ID**: TASK-003
**Created Date**: 2026-05-05
**Status**: TODO
**Language**: zh-CN

## 1. Task Overview

### 1.1 Task Summary
创建排班和预约的模拟 JSON 数据文件，并在 Store 中导入初始化，为开发和演示提供测试数据。

### 1.2 Task Objectives
- 创建 `src/data/schedule-list.json` 排班数据
- 创建 `src/data/appointment-list.json` 预约数据
- 在 Store 中导入并初始化这两个数据源

### 1.3 Related Feature Requirements
- Feature REQ-006: 创建排班和预约的模拟 JSON 数据
- Related Stories: Story 1, Story 4

## 2. Detailed Requirements

### 2.1 Functional Requirements
- 创建 8-10 条排班数据，覆盖多名医生、多天、上午/下午时段
- 创建 4-5 条预约数据，覆盖不同状态（booked/completed/cancelled）
- 排班数据中 bookedCount 与预约数据保持一致
- 在 `src/store/index.ts` 中导入 JSON 文件并初始化到 state

### 2.2 Technical Requirements
- JSON 数据格式与 Schedule/Appointment 接口完全匹配
- 使用现有的医生 ID（doc001-doc005）和患者 ID（patient001-patient005）
- 日期使用未来日期（相对于当前时间），确保排班数据有效
- Store 初始化模式与现有 doctorData/patientData/questionData 一致

### 2.3 Constraints and Limitations
- bookedCount 必须与 appointments 中对应状态的记录数一致
- 日期格式统一为 YYYY-MM-DD

## 3. Implementation Approach

### 3.1 Recommended Methodology
参考现有 JSON 数据文件格式，创建新的数据文件，然后在 Store 中导入。

### 3.2 Implementation Steps
1. 创建 `src/data/schedule-list.json`，包含 8-10 条排班记录
2. 创建 `src/data/appointment-list.json`，包含 4-5 条预约记录
3. 在 `src/store/index.ts` 顶部导入两个 JSON 文件
4. 在 state 初始化中使用导入的数据

### 3.3 Technical Considerations
- 导入语句：`import scheduleData from './data/schedule-list.json'`
- state 初始化：`schedules: scheduleData as Schedule[]`
- 确保 TypeScript 的 `resolveJsonModule` 已启用（应在 tsconfig 中已有）

### 3.4 Reference to Project Context
- `.asdm/contexts/data-models.md`: 现有数据格式和预置数据
- `.asdm/contexts/standard-project-structure.md`: 文件组织规范

## 4. Acceptance Criteria

### 4.1 Primary Criteria
- **Criterion 1**: schedule-list.json 包含 8-10 条排班数据，格式与 Schedule 接口匹配
  - Test method: JSON 格式验证
  - **Validation tool**: `npm run build`
- **Criterion 2**: appointment-list.json 包含 4-5 条预约数据，格式与 Appointment 接口匹配
  - Test method: JSON 格式验证
  - **Validation tool**: `npm run build`
- **Criterion 3**: Store 初始化后 schedules 和 appointments 有数据
  - Test method: 浏览器控制台验证
  - **Validation tool**: `npm run build`

### 4.2 Edge Cases
- bookedCount 与实际预约数的一致性

### 4.3 Negative Tests
- 确保不破坏现有 JSON 数据加载

## 5. Dependencies

### 5.1 Task Dependencies
- **Depends on**: TASK-001 (数据模型设计)
- **Blocks**: TASK-004, TASK-005, TASK-007

### 5.2 External Dependencies
- 无

### 5.3 Prerequisites
- TASK-001 完成，Schedule 和 Appointment 接口已定义

## 6. Estimated Effort

### 6.1 Effort Estimate
- **Estimated effort**: 10 min
- **Complexity**: Low
- **Risk**: Low

### 6.2 Effort Factors
- 纯数据文件创建，逻辑简单

## 7. Testing Strategy

### 7.1 Automated Validation (Required)
- **Build validation**: `npm run build` — 编译通过
- **Exit criteria**: exit code 0

### 7.2 Unit Testing
- 无需单独测试

### 7.3 Integration Testing
- 在后续 UI 任务中验证数据显示正确

### 7.4 Manual Testing
- 浏览器控制台检查 `store.state.schedules.length` 和 `store.state.appointments.length`

## 8. Implementation Notes

- 排班数据示例：
  ```json
  {
    "id": "sch001",
    "doctorId": "doc001",
    "doctorName": "张伟医生",
    "date": "2026-05-10",
    "timeSlot": "morning",
    "totalSlots": 20,
    "bookedCount": 5
  }
  ```
- 预约数据示例：
  ```json
  {
    "id": "appt001",
    "scheduleId": "sch001",
    "patientId": "patient001",
    "patientName": "赵明",
    "doctorId": "doc001",
    "doctorName": "张伟医生",
    "date": "2026-05-10",
    "timeSlot": "morning",
    "status": "booked",
    "symptoms": "最近胸闷，想做检查",
    "createTime": "2026-05-05T10:00:00.000Z",
    "updateTime": "2026-05-05T10:00:00.000Z"
  }
  ```
- 日期建议使用 2026-05-10 到 2026-05-16 范围

## 9. Risks and Mitigations

### Risk 1
- **Description**: bookedCount 与实际预约记录不一致
- **Impact**: Low
- **Mitigation**: 仔细计算每个排班的预约数，确保一致

## 10. Deliverables

- `src/data/schedule-list.json`
- `src/data/appointment-list.json`
- 更新后的 `src/store/index.ts`（导入和初始化数据）
- **Validation Results**: `npm run build` 通过
