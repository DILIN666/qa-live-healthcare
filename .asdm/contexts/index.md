# 工作区索引 - 在线医疗咨询平台

## 项目概述

**项目名称：** qa-live-healthcare  
**项目类型：** 在线医疗咨询平台（Web 应用）  
**技术栈：** Vue 3 + TypeScript + Vite + Ant Design Vue

这是一个在线医疗咨询平台，支持患者与医生的在线问诊功能。

## 技术架构

### 核心技术

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue | 3.5.10 | 前端框架 |
| TypeScript | 5.5.3 | 类型系统 |
| Vite | 5.4.8 | 构建工具 |
| Ant Design Vue | 4.2.6 | UI 组件库 |
| Vue Router | 4.6.3 | 路由管理 |
| Day.js | 1.11.19 | 日期处理 |

### 项目结构

```
qa-live-healthcare/
├── public/                 # 静态资源
├── src/
│   ├── assets/             # 资源文件
│   ├── components/         # 公共组件
│   │   ├── AppFooter.vue   # 页脚组件
│   │   ├── AppHeader.vue   # 页头组件
│   │   └── HelloWorld.vue  # 示例组件
│   ├── data/               # 数据文件
│   ├── router/             # 路由配置
│   │   └── index.ts        # 路由定义
│   ├── store/              # 状态管理
│   ├── views/              # 页面视图
│   │   ├── Home.vue        # 首页
│   │   ├── Consultation.vue # 咨询页面
│   │   ├── DoctorLogin.vue  # 医生登录页
│   │   ├── DoctorRoom.vue   # 医生诊室页
│   │   ├── Doctors.vue      # 医生列表页
│   │   └── About.vue        # 关于页
│   ├── App.vue             # 根组件
│   ├── main.ts             # 入口文件
│   └── style.css           # 全局样式
├── index.html              # HTML 入口
├── vite.config.ts          # Vite 配置
├── tsconfig.json           # TypeScript 配置
└── package.json            # 依赖管理
```

## 路由结构

| 路径 | 名称 | 描述 |
|------|------|------|
| `/` | Home | 首页 |
| `/consultation` | Consultation | 咨询页面 |
| `/consultation/:doctorUsername` | ConsultationRoom | 指定医生的咨询房间 |
| `/doctors` | Doctors | 医生列表 |
| `/about` | About | 关于我们 |
| `/doctor/login` | DoctorLogin | 医生登录 |
| `/doctor/room/:username` | DoctorRoom | 医生诊室 |

## 核心功能模块

### 1. 患者端功能
- **首页**：平台概览和快速入口
- **医生列表**：浏览和搜索可用医生
- **在线咨询**：与医生进行实时问诊
- **关于页面**：平台介绍

### 2. 医生端功能
- **医生登录**：医生身份认证
- **医生诊室**：管理患者咨询

## 开发指南

### 常用命令

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run preview
```

### 开发环境要求
- Node.js 16+
- npm 8+

## 上下文文件导航

更多详细信息请参考以下上下文文件：

- [项目标准结构](./standard-project-structure.md) - 详细项目结构说明
- [编码规范](./standard-coding-style.md) - TypeScript 和 Vue 编码规范
- [数据模型](./data-models.md) - 数据结构和类型定义
- [部署配置](./deployment.md) - 部署和环境配置
- [API 文档](./api.md) - 接口定义
- [架构设计](./architecture.md) - 系统架构和设计决策

## 技术债务与注意事项

1. **README 待完善**：当前 README 为 Vue 模板默认内容，需要根据实际项目更新
2. **状态管理**：目前使用 Vue 3 Composition API，尚未引入 Vuex/Pinia
3. **API 层**：待根据实际后端接口完善 API 封装

---

*最后更新：2026-04-29*
