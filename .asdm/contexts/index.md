# 工作区上下文索引

## 概述
本文档作为 AI 模型理解和使用本工作区的索引和指南，提供工作区内容的结构化概览，引导 AI 模型查找相关上下文。

## 工作区信息

### 基本信息
- **工作区名称**: QA Live Healthcare
- **描述**: 专业的在线医疗问诊平台，连接医生与患者，提供便捷、高效的医疗咨询服务
- **创建日期**: 2026年
- **最后更新**: 2026年5月4日

### 技术栈
- **主要语言**: TypeScript
- **框架**: Vue 3（Composition API + `<script setup>`）
- **UI 组件库**: Ant Design Vue 4.x
- **路由**: Vue Router 4.x
- **构建工具**: Vite 5.x
- **日期处理**: Day.js
- **类型检查**: vue-tsc
- **状态管理**: 自定义响应式 Store（基于 Vue `reactive`）
- **数据库**: 无后端数据库，使用 JSON 文件作为模拟数据源
- **部署平台**: 前端 SPA，可部署至任意静态托管服务

### 业务上下文
- **业务领域**: 在线医疗问诊
- **核心业务流程**:
  1. 患者通过姓名+生日验证身份（首次自动创建账户）
  2. 患者选择在线医生并提交问诊问题
  3. 医生通过用户名+密码登录诊室
  4. 医生查看待响应问题并文字回复或标记已解答
  5. 患者查看医生的回复
- **业务规则**:
  - 患者身份验证基于姓名和生日组合
  - 医生需账号密码登录
  - 问题状态：`pending`（待解答）/ `answered`（已解答）
  - 仅在线（`isActive`）医生可接受问诊
  - 医生可复制诊室链接分享给患者

## 工作区结构

### 文件树
```
qa-live-healthcare/
├── .asdm/                              # ASDM 配置和工具集
│   ├── contexts/                       # 上下文文件（本目录）
│   └── toolsets/                       # 已安装工具集
│       ├── basic-tools/
│       ├── context-builder/
│       ├── prd-builder/
│       ├── prototype-builder/
│       └── sample-toolset/
├── .codebuddy/                         # CodeBuddy 配置
│   └── commands/                       # ASDM 快捷命令
│       ├── asdm-context-build.md
│       └── asdm-context-update.md
├── public/                             # 静态资源
│   └── vite.svg
├── src/                                # 源代码目录
│   ├── assets/                         # 静态资源
│   │   └── vue.svg
│   ├── components/                     # 公共组件
│   │   ├── AppHeader.vue               # 应用顶部导航栏
│   │   ├── AppFooter.vue               # 应用底部页脚
│   │   └── HelloWorld.vue              # 示例组件（未使用）
│   ├── data/                           # 模拟数据（JSON）
│   │   ├── doctor-user-list.json       # 医生用户列表
│   │   ├── patient-user.json           # 患者用户列表
│   │   └── question-list.json          # 问诊问题列表
│   ├── router/                         # 路由配置
│   │   └── index.ts                    # 路由定义
│   ├── store/                          # 状态管理
│   │   └── index.ts                    # 响应式 Store + 接口定义
│   ├── views/                          # 页面视图
│   │   ├── Home.vue                    # 首页（平台介绍+开放诊室）
│   │   ├── Consultation.vue            # 患者问诊页（身份验证+提问+查看回复）
│   │   ├── Doctors.vue                 # 医生团队列表
│   │   ├── DoctorLogin.vue             # 医生登录页
│   │   ├── DoctorRoom.vue              # 医生诊室（查看/回复问题）
│   │   └── About.vue                   # 关于我们
│   ├── App.vue                         # 应用根组件
│   ├── main.ts                         # 应用入口
│   ├── style.css                       # 全局样式
│   └── vite-env.d.ts                   # Vite 类型声明
├── index.html                          # HTML 入口
├── package.json                        # 项目配置和依赖
├── tsconfig.json                       # TypeScript 配置
├── tsconfig.app.json                   # 应用 TS 配置
├── tsconfig.node.json                  # Node TS 配置
├── vite.config.ts                      # Vite 构建配置
└── README.md                           # 项目说明
```

### 关键目录说明
- **`src/store/`**: 核心状态管理，包含 `Doctor`、`Patient`、`Question` 接口定义和所有业务逻辑方法
- **`src/views/`**: 页面组件，每个 Vue 文件对应一个路由页面
- **`src/data/`**: JSON 模拟数据，Store 初始化时加载
- **`src/components/`**: 公共组件（Header/Footer）
- **`src/router/`**: 路由配置，7 条路由规则

### 路由结构
| 路径 | 名称 | 组件 | 说明 |
|------|------|------|------|
| `/` | Home | Home.vue | 首页 |
| `/consultation` | Consultation | Consultation.vue | 患者问诊（无指定医生） |
| `/consultation/:doctorUsername` | ConsultationRoom | Consultation.vue | 患者问诊（指定医生） |
| `/doctors` | Doctors | Doctors.vue | 医生列表 |
| `/about` | About | About.vue | 关于我们 |
| `/doctor/login` | DoctorLogin | DoctorLogin.vue | 医生登录 |
| `/doctor/room/:username` | DoctorRoom | DoctorRoom.vue | 医生诊室 |

## 开发指南

### 构建和编译
```bash
# 安装依赖
npm install

# 开发服务器
npm run dev

# 生产构建
npm run build

# 预览生产构建
npm run preview
```

### 代码质量
- **类型检查**: `vue-tsc -b`（包含在 build 命令中）
- **构建工具**: Vite 5.x
- **代码风格**: Vue 3 `<script setup>` SFC + TypeScript

## 上下文文件参考

本工作区在 `.asdm/contexts/` 中提供以下上下文文件：

1. **[standard-project-structure.md](./standard-project-structure.md)** - 标准项目结构和组织
2. **[standard-coding-style.md](./standard-coding-style.md)** - 编码标准和风格指南
3. **[data-models.md](./data-models.md)** - 数据模型、关系和图表
4. **[deployment.md](./deployment.md)** - 部署配置和流程
5. **[api.md](./api.md)** - API 定义、端点和文档
6. **[architecture.md](./architecture.md)** - 系统架构和设计决策

## AI 模型指南

### 如何使用本上下文
1. **从本索引开始** 了解工作区整体结构
2. **根据任务参考具体上下文文件**
3. **遵循开发指南** 进行构建、测试和部署
4. **保持一致性** 遵循现有模式和约定

### 常见任务
- **添加新页面**: 在 `src/views/` 创建 Vue 组件，在 `src/router/index.ts` 添加路由
- **修改数据模型**: 更新 `src/store/index.ts` 中的接口定义和数据
- **添加模拟数据**: 在 `src/data/` 中修改对应的 JSON 文件
- **修改业务逻辑**: 更新 `src/store/index.ts` 中的 Store 方法
- **样式调整**: 全局样式在 `src/style.css`，组件样式使用 `<style scoped>`

### 注意事项
- 本项目是纯前端应用，无后端 API，所有数据存储在内存中（刷新后丢失）
- Store 使用 Vue `reactive` 实现简单状态管理，未使用 Vuex/Pinia
- Ant Design Vue 组件已全局注册，可直接在模板中使用 `a-*` 前缀组件
- 图标使用 `@ant-design/icons-vue`，需按需导入

## 版本历史
| 版本 | 日期 | 变更 | 作者 |
|------|------|------|------|
| 1.0.0 | 2026-05-04 | 初始上下文创建 | ASDM Context Builder |

---

*本上下文文件由 Context Builder 工具集维护。当工作区发生变更时，使用 `/asdm-context-update` 更新。*
