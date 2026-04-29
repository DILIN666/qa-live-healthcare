# API 接口文档 - 在线医疗咨询平台

## 文档信息

| 项目 | 内容 |
|------|------|
| 文档版本 | 1.0.0 |
| 更新时间 | 2026-04-29 |
| 接口前缀 | `/api/v1` |

---

## 1. 接口概述

### 1.1 基础信息

| 项目 | 内容 |
|------|------|
| 基础 URL | `http://localhost:3000/api/v1` |
| 数据格式 | JSON |
| 字符编码 | UTF-8 |
| 认证方式 | Bearer Token |

### 1.2 通用请求头

```http
Content-Type: application/json
Authorization: Bearer <token>
```

### 1.3 通用响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

### 1.4 响应状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未认证或 Token 无效 |
| 403 | 无权限访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 2. 认证模块

### 2.1 医生登录

**接口地址：** `POST /api/v1/auth/doctor/login`

**请求参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| username | string | 是 | 医生用户名 |
| password | string | 是 | 登录密码 |

**请求示例：**

```json
{
  "username": "zhang_san",
  "password": "password123"
}
```

**响应示例：**

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "doctor": {
      "id": "doc001",
      "username": "zhang_san",
      "name": "张伟医生",
      "title": "主任医师",
      "department": "心内科",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=zhang_san",
      "experience": "20年",
      "specialties": ["高血压", "冠心病", "心律失常"],
      "isActive": true
    }
  }
}
```

---

### 2.2 医生登出

**接口地址：** `POST /api/v1/auth/doctor/logout`

**请求头：**

```http
Authorization: Bearer <token>
```

**响应示例：**

```json
{
  "code": 200,
  "message": "登出成功",
  "data": null
}
```

---

### 2.3 患者身份验证

**接口地址：** `POST /api/v1/auth/patient/verify`

**请求参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| name | string | 是 | 患者姓名 |
| birthday | string | 是 | 出生日期（YYYY-MM-DD） |

**请求示例：**

```json
{
  "name": "赵明",
  "birthday": "1985-03-15"
}
```

**响应示例：**

```json
{
  "code": 200,
  "message": "验证成功",
  "data": {
    "patient": {
      "id": "patient001",
      "name": "赵明",
      "birthday": "1985-03-15",
      "phone": "138****1234",
      "gender": "男"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2.4 患者登出

**接口地址：** `POST /api/v1/auth/patient/logout`

**请求头：**

```http
Authorization: Bearer <token>
```

**响应示例：**

```json
{
  "code": 200,
  "message": "登出成功",
  "data": null
}
```

---

## 3. 医生模块

### 3.1 获取医生列表

**接口地址：** `GET /api/v1/doctors`

**请求参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| department | string | 否 | 科室筛选 |
| isActive | boolean | 否 | 在线状态筛选 |
| page | number | 否 | 页码（默认 1） |
| pageSize | number | 否 | 每页数量（默认 10） |

**响应示例：**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "doc001",
        "username": "zhang_san",
        "name": "张伟医生",
        "title": "主任医师",
        "department": "心内科",
        "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=zhang_san",
        "experience": "20年",
        "specialties": ["高血压", "冠心病", "心律失常"],
        "isActive": true
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 5
    }
  }
}
```

---

### 3.2 获取在线医生列表

**接口地址：** `GET /api/v1/doctors/online`

**响应示例：**

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "doc001",
      "username": "zhang_san",
      "name": "张伟医生",
      "title": "主任医师",
      "department": "心内科",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=zhang_san",
      "specialties": ["高血压", "冠心病", "心律失常"],
      "isActive": true
    }
  ]
}
```

---

### 3.3 获取医生详情

**接口地址：** `GET /api/v1/doctors/:username`

**路径参数：**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| username | string | 医生用户名 |

**响应示例：**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "doc001",
    "username": "zhang_san",
    "name": "张伟医生",
    "title": "主任医师",
    "department": "心内科",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=zhang_san",
    "experience": "20年",
    "specialties": ["高血压", "冠心病", "心律失常"],
    "bio": "从事心血管内科临床工作20年，擅长高血压、冠心病等疾病的诊断与治疗。",
    "isActive": true
  }
}
```

---

## 4. 患者模块

### 4.1 获取患者信息

**接口地址：** `GET /api/v1/patients/:id`

**路径参数：**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | string | 患者 ID |

**响应示例：**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "patient001",
    "name": "赵明",
    "birthday": "1985-03-15",
    "phone": "138****1234",
    "gender": "男"
  }
}
```

---

### 4.2 更新患者信息

**接口地址：** `PUT /api/v1/patients/:id`

**路径参数：**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | string | 患者 ID |

**请求参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| phone | string | 否 | 手机号 |
| gender | string | 否 | 性别 |

**请求示例：**

```json
{
  "phone": "13812345678",
  "gender": "男"
}
```

**响应示例：**

```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": "patient001",
    "name": "赵明",
    "birthday": "1985-03-15",
    "phone": "13812345678",
    "gender": "男"
  }
}
```

---

## 5. 问题咨询模块

### 5.1 提交咨询问题

**接口地址：** `POST /api/v1/questions`

**请求头：**

```http
Authorization: Bearer <patient_token>
```

**请求参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| patientId | string | 是 | 患者 ID |
| patientName | string | 是 | 患者姓名 |
| doctorId | string | 是 | 医生 ID |
| doctorName | string | 是 | 医生姓名 |
| question | string | 是 | 咨询问题内容 |

**请求示例：**

```json
{
  "patientId": "patient001",
  "patientName": "赵明",
  "doctorId": "doc001",
  "doctorName": "张伟医生",
  "question": "最近总是感觉胸闷气短,特别是爬楼梯的时候,这是什么原因?"
}
```

**响应示例：**

```json
{
  "code": 200,
  "message": "问题提交成功",
  "data": {
    "id": "q008",
    "patientId": "patient001",
    "patientName": "赵明",
    "doctorId": "doc001",
    "doctorName": "张伟医生",
    "question": "最近总是感觉胸闷气短,特别是爬楼梯的时候,这是什么原因?",
    "submitTime": "2026-04-29T20:20:00",
    "status": "pending",
    "answer": null,
    "answerTime": null
  }
}
```

---

### 5.2 获取患者的问题列表

**接口地址：** `GET /api/v1/questions/patient/:patientId`

**路径参数：**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| patientId | string | 患者 ID |

**查询参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| status | string | 否 | 状态筛选（pending/answered） |

**响应示例：**

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "q001",
      "patientId": "patient001",
      "patientName": "赵明",
      "doctorId": "doc001",
      "doctorName": "张伟医生",
      "question": "最近总是感觉胸闷气短,特别是爬楼梯的时候,这是什么原因?",
      "submitTime": "2025-11-02T09:30:00",
      "status": "answered",
      "answer": "根据您的描述,可能是心脏功能问题。建议您做个心电图和心脏彩超检查。",
      "answerTime": "2025-11-02T09:45:00"
    }
  ]
}
```

---

### 5.3 获取医生的问题列表

**接口地址：** `GET /api/v1/questions/doctor/:doctorId`

**路径参数：**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| doctorId | string | 医生 ID |

**查询参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| status | string | 否 | 状态筛选（pending/answered） |

**响应示例：**

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "q002",
      "patientId": "patient002",
      "patientName": "孙丽",
      "doctorId": "doc002",
      "doctorName": "李娜医生",
      "question": "孩子5岁,最近总是咳嗽,晚上更严重,需要吃什么药?",
      "submitTime": "2025-11-02T10:15:00",
      "status": "pending",
      "answer": null,
      "answerTime": null
    }
  ]
}
```

---

### 5.4 获取问题详情

**接口地址：** `GET /api/v1/questions/:id`

**路径参数：**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | string | 问题 ID |

**响应示例：**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "q001",
    "patientId": "patient001",
    "patientName": "赵明",
    "doctorId": "doc001",
    "doctorName": "张伟医生",
    "question": "最近总是感觉胸闷气短,特别是爬楼梯的时候,这是什么原因?",
    "submitTime": "2025-11-02T09:30:00",
    "status": "answered",
    "answer": "根据您的描述,可能是心脏功能问题。建议您做个心电图和心脏彩超检查。",
    "answerTime": "2025-11-02T09:45:00"
  }
}
```

---

### 5.5 医生回答问题

**接口地址：** `POST /api/v1/questions/:id/answer`

**请求头：**

```http
Authorization: Bearer <doctor_token>
```

**路径参数：**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | string | 问题 ID |

**请求参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| answer | string | 是 | 回答内容 |

**请求示例：**

```json
{
  "answer": "根据您的描述,可能是心脏功能问题。建议您做个心电图和心脏彩超检查,同时注意休息,避免剧烈运动。"
}
```

**响应示例：**

```json
{
  "code": 200,
  "message": "回答成功",
  "data": {
    "id": "q001",
    "status": "answered",
    "answer": "根据您的描述,可能是心脏功能问题。建议您做个心电图和心脏彩超检查。",
    "answerTime": "2026-04-29T20:25:00"
  }
}
```

---

### 5.6 标记问题为已解答

**接口地址：** `PATCH /api/v1/questions/:id/resolve`

**请求头：**

```http
Authorization: Bearer <doctor_token>
```

**路径参数：**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | string | 问题 ID |

**响应示例：**

```json
{
  "code": 200,
  "message": "已标记为解答",
  "data": {
    "id": "q001",
    "status": "answered",
    "answer": "已口述解答",
    "answerTime": "2026-04-29T20:30:00"
  }
}
```

---

## 6. 统计模块

### 6.1 获取平台统计

**接口地址：** `GET /api/v1/statistics`

**响应示例：**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "totalDoctors": 5,
    "totalQuestions": 7,
    "activeSessions": 4,
    "totalSessions": 3
  }
}
```

---

### 6.2 获取医生统计

**接口地址：** `GET /api/v1/statistics/doctor/:doctorId`

**路径参数：**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| doctorId | string | 医生 ID |

**响应示例：**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "doctorId": "doc001",
    "totalQuestions": 3,
    "answeredCount": 1,
    "pendingCount": 2,
    "avgResponseTime": "15分钟"
  }
}
```

---

## 7. 错误码详情

| 错误码 | 错误信息 | 说明 |
|--------|----------|------|
| 1001 | 用户名或密码错误 | 医生登录失败 |
| 1002 | 账户已被禁用 | 医生账号被禁用 |
| 2001 | 患者信息验证失败 | 患者身份验证失败 |
| 2002 | 患者不存在 | 患者 ID 不存在 |
| 3001 | 问题不存在 | 问题 ID 不存在 |
| 3002 | 无权回答该问题 | 非该问题的负责医生 |
| 4001 | Token 已过期 | 请重新登录 |
| 4002 | Token 无效 | 认证失败 |

---

## 8. 接口调用示例

### 8.1 使用 fetch

```typescript
// 医生登录
async function loginDoctor(username: string, password: string) {
  const response = await fetch('/api/v1/auth/doctor/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const result = await response.json();
  if (result.code === 200) {
    localStorage.setItem('token', result.data.token);
    return result.data.doctor;
  }
  throw new Error(result.message);
}

// 获取医生列表
async function getDoctors() {
  const response = await fetch('/api/v1/doctors');
  const result = await response.json();
  return result.data.list;
}

// 提交问题
async function submitQuestion(data: {
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  question: string;
}) {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/v1/questions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response.json();
}
```

---

### 8.2 使用 axios（推荐）

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
});

// 请求拦截器
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器
api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API 方法
export const doctorApi = {
  login: (username: string, password: string) =>
    api.post('/auth/doctor/login', { username, password }),

  getList: (params?: { department?: string; isActive?: boolean }) =>
    api.get('/doctors', { params }),

  getByUsername: (username: string) =>
    api.get(`/doctors/${username}`),
};

export const questionApi = {
  submit: (data: {
    patientId: string;
    patientName: string;
    doctorId: string;
    doctorName: string;
    question: string;
  }) => api.post('/questions', data),

  answer: (id: string, answer: string) =>
    api.post(`/questions/${id}/answer`, { answer }),

  getByDoctor: (doctorId: string, status?: string) =>
    api.get(`/questions/doctor/${doctorId}`, { params: { status } }),
};
```

---

*最后更新：2026-04-29*
