# Task PRD: Mock 数据创建

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号
**Task ID**: TASK-003
**Created Date**: 2026-05-05
**Status**: TODO
**Language**: 简体中文

## 1. Task Overview

### 1.1 Task Summary

创建排班和预约的示例 JSON 数据文件，为前端开发和测试提供模拟数据支撑。

### 1.2 Task Objectives

- 目标 1：创建排班示例数据 `src/data/schedule-list.json`
- 目标 2：创建预约示例数据 `src/data/appointment-list.json`
- 目标 3：数据覆盖所有医生，包含多种排班和预约状态

### 1.3 Related Feature Requirements

- 功能需求 REQ-001：医生排班管理 — 提供排班展示数据
- 功能需求 REQ-003：预约记录查询 — 提供预约查询数据
- 功能需求 REQ-005：预约状态管理 — 提供不同状态的预约数据

## 2. Detailed Requirements

### 2.1 Functional Requirements

- 需求 1：为每位在线医生（doc001-doc005，除 doc004）创建未来 7 天的排班数据，每位医生每天 1-3 个时段
- 需求 2：每个时段设置不同的可预约名额（5-20），部分时段已满
- 需求 3：创建至少 5 条预约记录，覆盖不同状态：pending、completed、cancelled、no_show
- 需求 4：已完成的预约对应排班的 bookedSlots 应正确反映

### 2.2 Technical Requirements

- 需求 1：数据结构严格匹配 TASK-001 定义的 `Schedule` 和 `Appointment` 接口
- 需求 2：排班日期使用相对于今天的日期（使用 Day.js 计算后硬编码）
- 需求 3：ID 格式遵循约定：schedule 使用 `sch001`，appointment 使用 `appt001`

### 2.3 Constraints and Limitations

- 约束 1：日期使用硬编码（如 `2026-05-05`），不使用动态生成
- 约束 2：数据量适中，足以覆盖测试场景即可

## 3. Implementation Approach

### 3.1 Recommended Methodology

- 方法 1：参考现有 `src/data/doctor-user-list.json` 和 `src/data/question-list.json` 的格式
- 方法 2：排班日期覆盖今天及未来 7 天
- 方法 3：预约数据使用现有患者（patient001-patient003）

### 3.2 Implementation Steps

1. 创建 `src/data/schedule-list.json`，包含约 20-30 条排班记录
2. 创建 `src/data/appointment-list.json`，包含 5-8 条预约记录
3. 验证 JSON 格式正确

### 3.3 Technical Considerations

- 考虑 1：排班中 doc004（刘敏医生）不应有排班（因为 isActive: false）
- 考虑 2：已满的时段（bookedSlots === totalSlots）用于测试不可选状态
- 考虑 3：过去的日期不应有可预约的排班

### 3.4 Reference to Project Context

- `.asdm/contexts/data-models.md`：现有医生和患者数据

## 4. Acceptance Criteria

### 4.1 Primary Criteria

- **标准 1**：`schedule-list.json` 包含至少 20 条排班记录
  - 测试方法：JSON 解析无误，记录数 >= 20
  - **验证工具**：`node -e "console.log(JSON.parse(require('fs').readFileSync('src/data/schedule-list.json','utf8')).length)"`
- **标准 2**：`appointment-list.json` 包含至少 5 条预约记录，覆盖 4 种状态
  - 测试方法：JSON 解析无误，状态覆盖完整
  - **验证工具**：`node -e "const d=JSON.parse(require('fs').readFileSync('src/data/appointment-list.json','utf8'));console.log(new Set(d.map(a=>a.status)).size)"`
- **标准 3**：JSON 数据与 TypeScript 接口类型兼容
  - 测试方法：Store 导入数据后编译无错误
  - **验证工具**：`npm run build`

### 4.2 Edge Cases

- 边界情况 1：排班日期全部为今天及以后的日期
- 边界情况 2：doc004 无排班数据

### 4.3 Negative Tests

- 负面测试 1：JSON 格式错误会导致应用无法启动

## 5. Dependencies

### 5.1 Task Dependencies

- **依赖于**: TASK-001（数据模型设计 — 需要知道接口字段定义）
- **阻塞**: TASK-002（Store API 需要导入初始数据）

### 5.2 External Dependencies

- 无

### 5.3 Prerequisites

- 前提 1：TASK-001 中接口定义已完成

## 6. Estimated Effort

### 6.1 Effort Estimate

- **预估工时**：10 min
- **复杂度**：低
- **风险**：低

### 6.2 Effort Factors

- 因素 1：纯数据文件创建，逻辑简单

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

- **构建验证**：`npm run build` — 编译成功且无错误
- **JSON 验证**：确保 JSON 文件格式正确
- **退出标准**：所有验证命令退出码为 0

### 7.2 Unit Testing

- 无需单独单元测试

### 7.3 Integration Testing

- 集成测试将在 Store API 扩展任务中验证数据导入

### 7.4 Manual Testing

- 在浏览器中检查数据是否正确显示

## 8. Implementation Notes

- 注意 1：排班日期建议使用 `2026-05-05` 至 `2026-05-12` 之间的日期
- 注意 2：每个时段的可预约名额建议 5-20 之间
- 注意 3：预约记录使用现有患者 ID（patient001、patient002、patient003）

## 9. Risks and Mitigations

### 风险 1

- **描述**：硬编码日期可能过期
- **影响**：低
- **缓解**：使用较新的日期范围；后续可改为动态生成

## 10. Deliverables

- 交付物 1：`src/data/schedule-list.json`
- 交付物 2：`src/data/appointment-list.json`

**强制交付物**：验证结果
- **构建输出**：`npm run build` 成功，退出码 0

---

**Feature ID**: FEAT-001
**Task ID**: TASK-003
**Status**: TODO
**Created**: 2026-05-05
**Updated**: 2026-05-05
