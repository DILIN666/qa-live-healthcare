# Task PRD: Store API 扩展

**Feature ID**: FEAT-001-appointment-registration
**Feature Name**: 预约挂号
**Task ID**: TASK-002
**Created Date**: 2026-05-05
**Status**: TODO
**Language**: zh-CN

## 1. Task Overview

### 1.1 Task Summary
在 `src/store/index.ts` 的 `store` 对象中新增排班和预约相关的 CRUD 方法，约 8 个方法，为 UI 层提供数据操作接口。

### 1.2 Task Objectives
- 实现排班查询、添加、删除方法
- 实现预约创建、取消、状态更新方法
- 实现预约列表查询方法
- 确保号源扣减的原子性

### 1.3 Related Feature Requirements
- Feature REQ-003: 扩展 Store，新增排班和预约的 CRUD 方法
- Related Stories: Story 1, Story 2, Story 3, Story 4, Story 5

## 2. Detailed Requirements

### 2.1 Functional Requirements
- `getSchedulesByDoctor(doctorId: string): Schedule[]` — 获取指定医生的排班列表
- `getSchedulesByDate(date: string): Schedule[]` — 获取指定日期的排班列表
- `addSchedule(schedule: Omit<Schedule, 'id' | 'bookedCount'>): Schedule` — 添加排班
- `deleteSchedule(scheduleId: string): boolean` — 删除排班（有预约时不可删除）
- `addAppointment(appt: Omit<Appointment, 'id' | 'status' | 'createTime' | 'updateTime'>): Appointment | null` — 创建预约（号源不足返回 null）
- `cancelAppointment(apptId: string): boolean` — 取消预约（释放号源）
- `updateAppointmentStatus(apptId: string, status: AppointmentStatus): boolean` — 更新预约状态
- `getAppointmentsByDoctor(doctorId: string): Appointment[]` — 获取医生的预约列表
- `getAppointmentsByPatient(patientId: string): Appointment[]` — 获取患者的预约列表

### 2.2 Technical Requirements
- 方法添加到 `store` 导出对象中，与现有方法并列
- `addAppointment` 需同时增加 `schedule.bookedCount`
- `cancelAppointment` 需同时减少 `schedule.bookedCount`，且仅 `booked` 状态可取消
- `deleteSchedule` 需检查是否有 `booked` 状态的预约
- ID 生成使用 `Date.now()` 前缀模式
- 时间字段使用 `new Date().toISOString()`

### 2.3 Constraints and Limitations
- 内存操作，无持久化
- 单用户场景，无需考虑并发

## 3. Implementation Approach

### 3.1 Recommended Methodology
参考现有 Store 方法模式（如 `addQuestion`、`answerQuestion`），在 `store` 对象中逐一添加新方法。

### 3.2 Implementation Steps
1. 在 `store` 对象中添加 `getSchedulesByDoctor` 方法
2. 添加 `getSchedulesByDate` 方法
3. 添加 `addSchedule` 方法（自动生成 id，bookedCount 初始为 0）
4. 添加 `deleteSchedule` 方法（检查关联预约）
5. 添加 `addAppointment` 方法（检查号源、扣减 bookedCount）
6. 添加 `cancelAppointment` 方法（释放号源、减少 bookedCount）
7. 添加 `updateAppointmentStatus` 方法
8. 添加 `getAppointmentsByDoctor` 方法
9. 添加 `getAppointmentsByPatient` 方法

### 3.3 Technical Considerations
- `addAppointment` 的原子性：先检查号源，再创建预约，再更新 bookedCount，三步在同步代码中完成
- `cancelAppointment` 仅允许 `booked` 状态取消，`completed`/`no_show` 不可取消
- `deleteSchedule` 需遍历 appointments 检查是否有 booked 状态的关联预约

### 3.4 Reference to Project Context
- `.asdm/contexts/data-models.md`: Store 方法参考
- `.asdm/contexts/api.md`: RESTful API 设计参考

## 4. Acceptance Criteria

### 4.1 Primary Criteria
- **Criterion 1**: 所有 9 个 Store 方法已定义且可通过 TypeScript 编译
  - Test method: `npx vue-tsc --noEmit`
  - **Validation tool**: `npx vue-tsc --noEmit`
- **Criterion 2**: `addAppointment` 号源不足时返回 null 且不创建预约
  - Test method: 浏览器控制台手动验证
  - **Validation tool**: `npm run build`
- **Criterion 3**: `cancelAppointment` 释放号源（bookedCount 减少）
  - Test method: 浏览器控制台验证
  - **Validation tool**: `npm run build`
- **Criterion 4**: `deleteSchedule` 有预约时返回 false
  - Test method: 浏览器控制台验证
  - **Validation tool**: `npm run build`

### 4.2 Edge Cases
- 号源刚好为 0 时不可再预约
- 取消已取消的预约应返回 false
- 删除不存在的排班应返回 false

### 4.3 Negative Tests
- 不存在的 scheduleId 创建预约应处理错误
- 不存在的 appointmentId 更新状态应处理错误

## 5. Dependencies

### 5.1 Task Dependencies
- **Depends on**: TASK-001 (数据模型设计)
- **Blocks**: TASK-004, TASK-005, TASK-007

### 5.2 External Dependencies
- 无

### 5.3 Prerequisites
- TASK-001 完成后 Schedule 和 Appointment 接口已定义

## 6. Estimated Effort

### 6.1 Effort Estimate
- **Estimated effort**: 15 min
- **Complexity**: Medium
- **Risk**: Low

### 6.2 Effort Factors
- 9 个方法，逻辑较直接，但需注意号源扣减的正确性

## 7. Testing Strategy

### 7.1 Automated Validation (Required)
- **Build validation**: `npm run build` — 编译通过
- **Type checking**: `npx vue-tsc --noEmit` — 类型正确
- **Exit criteria**: 所有命令 exit code 0

### 7.2 Unit Testing
- 无单独单元测试，通过浏览器控制台手动验证

### 7.3 Integration Testing
- 在后续 UI 任务中集成验证

### 7.4 Manual Testing
- 在浏览器控制台逐一调用 Store 方法验证返回值

## 8. Implementation Notes

- `addAppointment` 参考实现：
  ```typescript
  addAppointment(appt: Omit<Appointment, 'id' | 'status' | 'createTime' | 'updateTime'>): Appointment | null {
    const schedule = state.schedules.find(s => s.id === appt.scheduleId);
    if (!schedule || schedule.bookedCount >= schedule.totalSlots) return null;
    const newAppt: Appointment = {
      ...appt,
      id: `appt${Date.now()}`,
      status: 'booked',
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
    };
    schedule.bookedCount++;
    state.appointments.push(newAppt);
    return newAppt;
  }
  ```

## 9. Risks and Mitigations

### Risk 1
- **Description**: 号源扣减逻辑可能有边界错误
- **Impact**: Medium
- **Mitigation**: 仔细实现 bookedCount 的增减逻辑，添加充分的条件检查

## 10. Deliverables

- 更新后的 `src/store/index.ts`，包含 9 个新增 Store 方法
- **Validation Results**: `npm run build` 和 `npx vue-tsc --noEmit` 通过
