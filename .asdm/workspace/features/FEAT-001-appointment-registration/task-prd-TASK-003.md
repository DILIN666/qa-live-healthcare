# Task PRD: Mock 数据创建

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号
**Task ID**: TASK-003
**Created Date**: 2026-04-29
**Status**: TODO
**Language**: 简体中文

---

## 1. 任务概述

### 1.1 任务摘要

为排班和预约功能创建示例数据 JSON 文件，包括 5 位医生未来 7 天的门诊排班数据，以及不同状态的预约记录示例。

### 1.2 任务目标

- **目标 1**：创建 `src/data/schedule-list.json`，包含 5 位医生未来 7 天的排班
- **目标 2**：创建 `src/data/appointment-list.json`，包含多条不同状态的预约记录
- **目标 3**：确保数据格式与 TASK-001 定义的数据模型完全一致
- **目标 4**：数据具有真实性和代表性

### 1.3 关联功能需求

- 功能需求：REQ-001（医生排班管理）、REQ-003（预约记录查询）
- 关联故事：故事 1、故事 2、故事 3

---

## 2. 详细需求

### 2.1 功能需求

- **FR-001**：排班数据文件 `schedule-list.json`
  - 包含所有 5 位医生的排班（doc001 - doc005）
  - 每个医生未来 7 天的排班数据
  - 每天包含 3 个时段（morning、afternoon、evening）
  - 部分时段设置不同的已预约人数（0 到 totalSlots 之间）
  - 排班日期从当前日期开始计算

- **FR-002**：预约数据文件 `appointment-list.json`
  - 包含至少 3 条预约记录
  - 覆盖不同状态：scheduled（待就诊）、completed（已完成）、cancelled（已取消）
  - 每条预约关联有效的 scheduleId
  - 数据具有合理的业务场景（如已完成的预约对应过去日期）

### 2.2 技术需求

- JSON 文件路径：`src/data/schedule-list.json` 和 `src/data/appointment-list.json`
- 数据格式必须与 `src/types/appointment.ts` 中的接口定义一致（由 TASK-001 定义）
- 参考 `.asdm/contexts/data-models.md` 中现有 JSON 数据文件的风格
- 字段使用中文注释说明

### 2.3 约束与限制

- 不创建目录，`src/data/` 目录已存在
- 不包含敏感信息（如真实手机号等）
- 预约日期和排班日期使用动态计算或合理的固定日期

---

## 3. 实现方案

### 3.1 推荐方法

参考项目中现有的 `doctor-user-list.json`、`patient-user.json`、`question-list.json` 的数据格式和风格，创建风格一致的新数据文件。

### 3.2 实现步骤

1. **生成排班数据**：为每位医生生成 7 天的排班，每天 3 个时段
2. **设置名额**：随机设置已预约人数，体现不同的满员程度
3. **生成预约数据**：创建 3 条不同状态的预约记录
4. **关联校验**：确保预约引用的 scheduleId 在排班数据中存在
5. **验证格式**：确保 JSON 格式正确，可被 TypeScript 正确解析

### 3.3 数据设计

**排班数据生成规则**：

| 医生 | 排班规则 |
|------|---------|
| doc001（张伟，心内科） | 每天 3 个时段全开 |
| doc002（李娜，儿科） | 每天 3 个时段全开 |
| doc003（王强，骨科） | 周一/三/五开诊 |
| doc004（刘敏，妇产科） | 周二/四/六开诊 |
| doc005（陈杰，消化内科） | 每天 3 个时段全开 |

**时段定义**：
- morning（上午）：08:00 - 12:00
- afternoon（下午）：14:00 - 18:00
- evening（晚上）：19:00 - 21:00

**名额设置**：
- 总名额：每个时段 5 人
- 已预约人数：0 ~ 4 随机分布，部分满员

**预约数据示例场景**：

| 状态 | 场景描述 |
|------|---------|
| scheduled | 患者 A 预约 doc001 明天上午 |
| completed | 患者 B 预约 doc002 昨天上午，已完成 |
| cancelled | 患者 C 预约 doc003 前天，已取消 |

### 3.4 项目上下文引用

- `.asdm/contexts/data-models.md` — 数据格式参考
- `.asdm/workspace/features/FEAT-001-appointment-registration/task-prd-TASK-001.md` — 类型定义参考
- 现有 JSON 文件：`src/data/doctor-user-list.json`、`src/data/patient-user.json`

---

## 4. 验收标准

### 4.1 核心标准

- **AC-001**：排班数据完整
  - 验证工具：检查 `schedule-list.json` 中排班数量
  - 期望结果：5 位医生 × 7 天 × 3 时段 = 105 条记录（节假日规则外）

- **AC-002**：预约数据格式正确
  - 验证工具：JSON.parse 验证和 `tsc --noEmit`
  - 期望结果：JSON 格式正确，可被 TypeScript 正确解析

- **AC-003**：预约引用的 scheduleId 有效
  - 验证工具：手动检查每条 appointment 的 scheduleId 在 schedule-list.json 中存在
  - 期望结果：所有 scheduleId 均有对应排班记录

- **AC-004**：状态覆盖完整
  - 验证工具：检查 `appointment-list.json` 中包含 scheduled、completed、cancelled 三种状态
  - 期望结果：至少各 1 条

### 4.2 边界情况

- **BC-001**：排班数据量较大 → 使用脚本生成或手动合理简化
- **BC-002**：日期为动态计算 → 可使用固定日期（如 2026-05-01 起），避免日期问题

### 4.3 负面测试

- **NC-001**：JSON 格式错误 → JSON.parse 报错
- **NC-002**：引用的 scheduleId 不存在 → TASK-002 初始化时可能报错

---

## 5. 依赖关系

### 5.1 任务依赖

- **前置依赖**：TASK-001（数据模型设计）— 确保类型定义可用后再创建数据
- **阻塞任务**：TASK-002（Store API 扩展）依赖本任务的数据文件

### 5.2 外部依赖

- `src/types/appointment.ts`（TASK-001 输出）
- `src/data/doctor-user-list.json`（现有文件）

### 5.3 前置条件

- TASK-001 完成
- `src/data/` 目录存在

---

## 6. 预估工作量

- **预估工时**：10 分钟
- **复杂度**：低
- **风险**：低

### 6.1 影响工时的因素

- 排班数据量较大（100+ 条），手动编写耗时
- 可考虑简化为 2-3 天的排班数据，确保功能验证即可

---

## 7. 测试策略

### 7.1 自动化验证（必需）

- **JSON 格式验证**：尝试 JSON.parse 读取文件
  - 验证 JSON 格式正确
- **项目构建**：`npm run build`
  - 验证数据文件可被项目正确引用
  - 退出码 0 表示成功

### 7.2 手动测试

- 用浏览器或开发工具打开页面，检查预约列表是否有示例数据
- 检查排班选择器是否显示示例排班

---

## 8. 实施笔记

### 8.1 简化策略

由于排班数据量大，可采用以下简化策略：

1. **减少排班天数**：从 7 天减少到 3 天（今天、明天、后天）
2. **减少医生覆盖**：仅 doc001 和 doc002 提供完整排班，其他医生简化
3. **减少时段覆盖**：部分医生仅提供上午时段

但需保证至少有以下数据用于功能验证：
- doc001 的今天上午/下午/晚上各 1 个排班
- doc001 今天上午已预约人数 < 总名额
- doc001 今天下午已预约人数 = 总名额（满员场景）

### 8.2 日期处理

为避免硬编码日期问题，使用 Day.js 的日期计算逻辑生成排班：

```javascript
// 使用 Day.js 生成日期
import dayjs from 'dayjs';

const startDate = dayjs(); // 今天
const dates = [];
for (let i = 0; i < 7; i++) {
  dates.push(startDate.add(i, 'day').format('YYYY-MM-DD'));
}
```

### 8.3 文件结构

```
src/data/
├── schedule-list.json    # 排班数据
└── appointment-list.json # 预约数据
```

---

## 9. 风险与应对

### 风险 1：数据量过大

- **描述**：100+ 条排班数据手动编写容易出错
- **影响**：低
- **应对**：简化为 3 天排班，保留关键测试场景数据

---

## 10. 交付物

- `src/data/schedule-list.json` — 排班示例数据
- `src/data/appointment-list.json` — 预约示例数据

### 必需交付物：验证结果

- **JSON 验证**：文件可正常 JSON.parse
- **构建输出**：运行 `npm run build` 成功，退出码 0

---

**Task ID**: TASK-003
**Status**: TODO
**Updated**: 2026-04-29
