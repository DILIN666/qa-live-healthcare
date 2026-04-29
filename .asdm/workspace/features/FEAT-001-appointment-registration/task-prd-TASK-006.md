# Task PRD: 预约表单组件

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号
**Task ID**: TASK-006
**Created Date**: 2026-04-29
**Status**: TODO
**Language**: 简体中文

---

## 1. 任务概述

### 1.1 任务摘要

创建 `AppointmentForm.vue` 预约表单组件，患者在选择排班时段后填写预约信息（姓名、联系方式、备注），提交后完成预约创建。

### 1.2 任务目标

- **目标 1**：接收已选排班信息作为 Props
- **目标 2**：实现患者预约表单（含姓名、联系电话、备注）
- **目标 3**：实现表单验证（姓名非空、电话格式）
- **目标 4**：提交成功后显示预约确认信息
- **目标 5**：成功后 emit completed 事件

### 1.3 关联功能需求

- 功能需求：REQ-002（预约挂号）
- 关联故事：故事 1

---

## 2. 详细需求

### 2.1 功能需求

- **FR-001**：组件 Props
  - `selectedSchedule: Schedule`（必填）— 已选择的排班信息
  - `doctorName: string`（必填）— 医生姓名（用于显示）

- **FR-002**：表单字段
  - 患者姓名（必填）：`a-input`，placeholder: 请输入您的姓名
  - 联系电话（必填）：`a-input`，placeholder: 请输入联系电话
  - 就诊备注（选填）：`a-textarea`，placeholder: 请描述您的症状或需求

- **FR-003**：表单验证
  - 患者姓名：非空，长度 2-20 个字符
  - 联系电话：必填，中国大陆手机号格式（1 开头的 11 位数字）
  - 就诊备注：可选，最大 500 字符

- **FR-004**：提交逻辑
  - 点击提交后调用 `createAppointment`
  - 提交前显示 loading 状态
  - 成功后显示预约确认对话框
  - 失败后显示错误提示，不关闭表单

- **FR-005**：预约确认对话框
  - 显示预约编号（格式：APT-XXXXXX）
  - 显示预约时间（日期 + 时段）
  - 显示医生姓名
  - 关闭后 emit `completed` 事件

- **FR-006**：组件 Events
  - `completed(appointment: Appointment)` — 预约创建成功后触发

### 2.2 技术需求

- 组件路径：`src/components/AppointmentForm.vue`
- 使用 Ant Design Vue `a-form` 和验证规则
- 调用 `src/store/index.ts` 中的 `createAppointment` 方法
- 遵循 `.asdm/contexts/standard-coding-style.md` 中的 Vue 组件规范

### 2.3 约束与限制

- 不处理排班选择逻辑，仅接收已选择的排班
- 表单验证使用 Ant Design Vue 原生验证
- 不处理患者身份验证（假设由父组件保证）

---

## 3. 实现方案

### 3.1 推荐方法

参考 Ant Design Vue 的 Form 组件使用方式，结合项目现有表单页面的验证风格。

### 3.2 实现步骤

1. **创建组件**：在 `src/components/` 下创建 `AppointmentForm.vue`
2. **定义 Props 和 Events**：定义 `selectedSchedule`、`doctorName` props 和 `completed` 事件
3. **创建表单**：使用 `a-form` 创建三字段表单
4. **配置验证规则**：在 `rules` 中定义验证规则
5. **实现提交逻辑**：`handleSubmit` 方法调用 `createAppointment`
6. **实现成功对话框**：使用 `a-modal` 显示预约确认信息
7. **实现完成回调**：成功后 emit `completed` 事件
8. **验证**：运行 TypeScript 类型检查和构建

### 3.3 技术注意事项

- 使用 `useForm` 组合式 API 进行表单管理
- 提交前调用 `form.validate()` 进行验证
- `createAppointment` 需要的 patientId 可从 Store 的 `currentPatient` 获取
- 预约编号使用 `apt + 时间戳` 格式或自增 ID

### 3.4 项目上下文引用

- `.asdm/contexts/standard-coding-style.md` — Vue 组件规范
- `.asdm/workspace/features/FEAT-001-appointment-registration/task-prd-TASK-002.md` — Store API 参考
- Ant Design Vue Form 官方文档

---

## 4. 验收标准

### 4.1 核心标准

- **AC-001**：表单字段正确渲染
  - 验证工具：组件传入 props 后检查表单显示
  - 期望结果：三个字段正确显示，placeholder 正确

- **AC-002**：表单验证生效
  - 验证工具：留空姓名提交，或输入错误电话
  - 期望结果：显示验证错误提示，不提交

- **AC-003**：预约创建成功
  - 验证工具：填写正确信息后提交
  - 期望结果：显示预约确认对话框，名额 -1

- **AC-004**：失败处理正确
  - 验证工具：名额已满时提交
  - 期望结果：显示错误提示，表单不关闭

- **AC-005**：completed 事件正确 emit
  - 验证工具：监听组件的 completed 事件
  - 期望结果：事件携带正确的 appointment 对象

### 4.2 边界情况

- **BC-001**：selectedSchedule 变化 → 表单重置
- **BC-002**：快速连续提交 → 防止重复提交（loading 状态）
- **BC-003**：patientId 不存在 → 提示「请先验证身份」

### 4.3 负面测试

- **NC-001**：姓名超长 → 验证拒绝，最大 20 字符
- **NC-002**：电话格式错误 → 验证拒绝，提示格式要求

---

## 5. 依赖关系

### 5.1 任务依赖

- **前置依赖**：TASK-002（Store API 扩展）、TASK-003（Mock 数据创建）
- **阻塞任务**：无直接阻塞，但可能被 TASK-004 集成使用

### 5.2 外部依赖

- `src/store/index.ts`（TASK-002 输出）
- `src/data/appointment-list.json`（TASK-003 输出）
- Ant Design Vue（项目已有）

### 5.3 前置条件

- TASK-002 和 TASK-003 完成

---

## 6. 预估工作量

- **预估工时**：15 分钟
- **复杂度**：低
- **风险**：低

### 6.1 影响工时的因素

- 表单验证规则需要仔细设计
- 成功对话框的文案和展示需要设计

---

## 7. 测试策略

### 7.1 自动化验证（必需）

- **类型检查**：`tsc --noEmit`
  - 验证组件类型正确
  - 退出码 0 表示成功
- **项目构建**：`npm run build`
  - 验证组件可正常构建
  - 退出码 0 表示成功

### 7.2 手动测试

- 填写正确信息，提交 → 检查预约是否创建
- 留空必填项 → 检查验证提示
- 电话输入错误格式 → 检查验证提示
- 名额已满时提交 → 检查错误提示

---

## 8. 实施笔记

### 8.1 实施指导

组件结构示例：

```vue
<template>
  <div class="appointment-form">
    <div class="schedule-info">
      <span>{{ doctorName }}</span>
      <span>{{ formatScheduleTime(selectedSchedule) }}</span>
    </div>
    
    <a-form :model="form" :rules="rules" ref="formRef">
      <a-form-item name="patientName" label="患者姓名">
        <a-input v-model:value="form.patientName" placeholder="请输入您的姓名" />
      </a-form-item>
      
      <a-form-item name="phone" label="联系电话">
        <a-input v-model:value="form.phone" placeholder="请输入联系电话" />
      </a-form-item>
      
      <a-form-item name="notes" label="就诊备注">
        <a-textarea v-model:value="form.notes" :rows="3" placeholder="请描述您的症状或需求" />
      </a-form-item>
      
      <a-form-item>
        <a-button type="primary" :loading="submitting" @click="handleSubmit">
          确认预约
        </a-button>
      </a-form-item>
    </a-form>
    
    <a-modal v-model:open="showSuccessModal" title="预约成功">
      <!-- 预约确认信息 -->
    </a-modal>
  </div>
</template>
```

### 8.2 表单验证规则

```typescript
const rules = {
  patientName: [
    { required: true, message: '请输入患者姓名' },
    { min: 2, max: 20, message: '姓名长度在 2-20 个字符' },
  ],
  phone: [
    { required: true, message: '请输入联系电话' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
  ],
  notes: [
    { max: 500, message: '备注最多 500 个字符' },
  ],
};
```

---

## 9. 风险与应对

### 风险 1：患者身份未验证

- **描述**：提交预约时 currentPatient 为空
- **影响**：中
- **应对**：在提交前检查 currentPatient，为空时提示先验证身份

---

## 10. 交付物

- `src/components/AppointmentForm.vue` — 预约表单组件

### 必需交付物：验证结果

- **编译输出**：运行 `tsc --noEmit` 无错误
- **构建输出**：运行 `npm run build` 成功，退出码 0

---

**Task ID**: TASK-006
**Status**: TODO
**Updated**: 2026-04-29
