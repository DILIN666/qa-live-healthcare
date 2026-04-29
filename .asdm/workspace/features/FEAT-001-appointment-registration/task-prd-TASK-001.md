# Task PRD: 数据模型设计

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号
**Task ID**: TASK-001
**Created Date**: 2026-04-29
**Status**: TODO
**Language**: 简体中文

---

## 1. 任务概述

### 1.1 任务摘要

为预约挂号功能定义 `Schedule`（排班）和 `Appointment`（预约）的 TypeScript 接口类型，与项目现有的数据模型风格保持一致，并导出到独立类型文件中。

### 1.2 任务目标

- **目标 1**：定义完整的 `Schedule` 接口，包含排班所有必要字段
- **目标 2**：定义完整的 `Appointment` 接口，包含预约所有必要字段
- **目标 3**：定义预约状态枚举和时段枚举
- **目标 4**：创建 `src/types/appointment.ts` 类型文件

### 1.3 关联功能需求

- 功能需求：REQ-001（医生排班管理）
- 关联故事：故事 1、故事 3

---

## 2. 详细需求

### 2.1 功能需求

- **FR-001**：定义 `Schedule` 接口
  - `id`: 排班唯一标识，格式 `sch + 时间戳`
  - `doctorId`: 关联医生 ID
  - `date`: 出诊日期，格式 `YYYY-MM-DD`
  - `timeSlot`: 时段枚举值（morning/afternoon/evening）
  - `totalSlots`: 该时段总可预约名额（整数）
  - `bookedSlots`: 已预约人数（整数，初始为 0）

- **FR-002**：定义 `Appointment` 接口
  - `id`: 预约唯一标识，格式 `apt + 时间戳`
  - `patientId`: 患者 ID
  - `patientName`: 患者姓名（冗余存储）
  - `phone`: 联系电话
  - `doctorId`: 医生 ID
  - `doctorName`: 医生姓名（冗余存储）
  - `scheduleId`: 关联排班 ID
  - `notes`: 患者就诊备注（选填）
  - `status`: 预约状态枚举
  - `createdAt`: 创建时间，ISO 8601 格式
  - `cancelledAt`: 取消时间（未取消时为 null）

- **FR-003**：定义枚举类型
  - `AppointmentStatus`: 枚举值 scheduled | completed | cancelled | no-show
  - `TimeSlot`: 枚举值 morning | afternoon | evening

### 2.2 技术需求

- 类型定义文件路径：`src/types/appointment.ts`
- 必须使用 TypeScript 严格模式
- 遵循 `.asdm/contexts/standard-coding-style.md` 中的类型定义规范
- 所有接口字段需要有中文 JSDoc 注释
- 与 `data-models.md` 中已有的 `Appointment` 扩展建议保持一致

### 2.3 约束与限制

- 不实现业务逻辑，仅定义类型
- 暂不包含预约费用、支付状态等后续可能扩展的字段
- 不创建目录，`src/types/` 目录需预先存在（如果不存在则新建）

---

## 3. 实现方案

### 3.1 推荐方法

参考项目现有数据模型风格（见 `.asdm/contexts/data-models.md` 中的 Doctor、Patient、Question 接口定义），使用一致的注释风格和导出方式。

### 3.2 实现步骤

1. **检查目录**：确认 `src/types/` 目录存在，如不存在则创建
2. **定义枚举**：创建 `AppointmentStatus` 和 `TimeSlot` 枚举类型
3. **定义 Schedule 接口**：按照 FR-001 定义所有字段
4. **定义 Appointment 接口**：按照 FR-002 定义所有字段
5. **导出类型**：使用 `export` 导出所有类型
6. **验证**：运行 TypeScript 类型检查

### 3.3 技术注意事项

- 枚举值使用字符串字面量，便于调试和展示
- `bookedSlots` 初始值为 0，不计入 `totalSlots`
- `status` 字段默认值应为 `scheduled`
- `notes` 字段类型为 `string`，空字符串表示未填写

### 3.4 项目上下文引用

- `.asdm/contexts/standard-coding-style.md` — TypeScript 类型定义规范
- `.asdm/contexts/data-models.md` — 现有数据模型风格参考
- `.asdm/contexts/standard-project-structure.md` — 目录结构规范

---

## 4. 验收标准

### 4.1 核心标准

- **AC-001**：`Schedule` 接口包含所有必需字段且类型正确
  - 验证工具：`tsc --noEmit src/types/appointment.ts`
  - 期望结果：TypeScript 编译无错误

- **AC-002**：`Appointment` 接口包含所有必需字段且类型正确
  - 验证工具：`tsc --noEmit src/types/appointment.ts`
  - 期望结果：TypeScript 编译无错误

- **AC-003**：枚举类型定义完整且可导出
  - 验证工具：检查文件中 `export enum` 存在
  - 期望结果：两个枚举均可被其他模块导入

- **AC-004**：类型文件可被 store 正常导入使用
  - 验证工具：`tsc --noEmit`
  - 期望结果：整个项目类型检查通过

### 4.2 边界情况

- **BC-001**：字段为可选时（如 notes），类型必须为 `string | null`
- **BC-002**：bookedSlots 不得大于 totalSlots（此项在业务逻辑层保证，但类型上允许初始状态）

### 4.3 负面测试

- **NC-001**：类型文件缺少 export 时，其他模块无法导入 → 需确保所有类型均 export
- **NC-002**：使用未定义的字段 → TypeScript 编译报错

---

## 5. 依赖关系

### 5.1 任务依赖

- **前置依赖**：无
- **阻塞任务**：
  - TASK-002（Store API 扩展）依赖 TASK-001 的类型定义
  - TASK-003（Mock 数据创建）依赖 TASK-001 的类型定义

### 5.2 外部依赖

- TypeScript 5.5.3（项目已有）
- `src/types/` 目录（需创建）

### 5.3 前置条件

- 无

---

## 6. 预估工作量

- **预估工时**：10 分钟
- **复杂度**：低
- **风险**：低

### 6.1 影响工时的因素

- 目录创建可能需要额外操作（如 `src/types/` 不存在）
- 类型定义需要与项目现有风格保持一致，审阅时间计入工时

---

## 7. 测试策略

### 7.1 自动化验证（必需）

- **类型检查**：`tsc --noEmit`
  - 验证所有类型定义正确
  - 退出码 0 表示成功
- **项目编译**：`npm run build`
  - 验证类型文件集成到项目后无编译错误
  - 退出码 0 表示成功

### 7.2 单元测试

- 不适用（类型定义文件无需单元测试）

### 7.3 集成测试

- TASK-002 开始时导入并使用本任务定义类型，间接验证类型正确性

### 7.4 手动测试

- 审阅类型定义是否符合 `data-models.md` 中的设计规范

---

## 8. 实施笔记

### 8.1 实施指导

- 参考 `data-models.md` 中 `Doctor` 接口的注释风格（字段中文注释 + 字段说明）
- 类型文件以空行分隔不同类型定义
- 在文件顶部添加模块级 JSDoc 注释

### 8.2 参考实现

```
src/types/appointment.ts
├── AppointmentStatus 枚举
├── TimeSlot 枚举
├── Schedule 接口
└── Appointment 接口
```

### 8.3 命名约定

- 文件名： kebab-case，`appointment.ts`
- 接口名： PascalCase，`Schedule`、`Appointment`
- 枚举名： PascalCase，`AppointmentStatus`
- 枚举值： camelCase，`scheduled`、`completed`

---

## 9. 风险与应对

### 风险 1：类型与其他模块不一致

- **描述**：预约字段设计与后期待扩展的 API 模型不一致
- **影响**：低
- **应对**：参考 `data-models.md` 中的 Appointment 扩展建议，预留扩展字段

---

## 10. 交付物

- `src/types/appointment.ts` — 包含所有类型定义的文件

### 必需交付物：验证结果

- **编译输出**：运行 `tsc --noEmit` 无错误
- **构建输出**：运行 `npm run build` 成功，退出码 0

---

**Task ID**: TASK-001
**Status**: TODO
**Updated**: 2026-04-29
