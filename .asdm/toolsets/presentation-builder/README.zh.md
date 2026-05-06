# ASDM 工具集 - 演示文稿构建器

toolset-id: presentation-builder
toolset-name: 演示文稿构建器
版本: 0.0.1
更新日期: 2026-05-05
工具集描述: AI 驱动的演示文稿规划、结构化和生成工具集。从主题、大纲或现有文档创建专业幻灯片。

## 概述

演示文稿构建器（toolset-id: presentation-builder）是一个 ASDM 工具集，用于通过 AI 辅助工作流创建专业演示文稿。它提供两个主要功能：

1. **演示文稿规划** — 分析主题、大纲或现有文档，生成结构化的演示文稿计划，包含逐页幻灯片内容分解。
2. **演示文稿创建** — 根据规划结构生成 `.pptx` 文件，具有专业的布局、样式和内容。

该工具集集成 `pptx` 技能（Skill）进行实际文件生成，同时提供规划和结构化智能。

用户可以将此工具集安装到工作区，并使用「AI 引导安装」运行 `INSTALL.md` 文档来初始化工具集。只需将以下提示复制到「AI Coding」工具的聊天窗口中并按回车即可：

```shell
Follow instructions in .asdm/toolsets/presentation-builder/INSTALL.md
```

## 功能

### 通用功能

- 提供友好的快捷命令 `actions`，使用提供商的入口点来简化演示文稿的规划和创建过程
- 提供标准的 `spec` 用于定义演示文稿结构，并允许用户管理员通过自定义模板（spec 文档）来定义自己的流程

### 规划阶段

- **主题转演示文稿**：提供主题，获取完整的演示文稿计划
- **大纲转演示文稿**：将现有大纲转换为结构化的幻灯片
- **文档转演示文稿**：从文档中提取关键信息并创建演示文稿
- **功能转演示文稿**：根据功能 ID（如 `FEAT-001`）引用 `.asdm/workspace/features/` 生成演示文稿
- 自动确定幻灯片类型（标题、内容、对比、图表、摘要等）
- 生成幻灯片标题、要点、演讲者备注和视觉建议
- 保存计划到 `.asdm/workspace/presentations/<presentation-id>/presentation-plan.md`

### 创建阶段

- 使用 `pptx` 技能根据计划生成 `.pptx` 文件
- 应用一致的设计主题和布局规则
- 支持专业样式和排版
- 保存输出文件到 `.asdm/workspace/presentations/<presentation-id>/`

## 技能执行

演示文稿构建器使用 `pptx` 技能进行 `.pptx` 文件生成。该技能是从运行时环境中动态加载的可执行模块。

### 技能依赖

| 技能 ID | 名称 | 用途 |
|---------|------|------|
| pptx | PPTX 文件生成器 | 创建、修改和保存 .pptx 演示文稿文件 |

### 技能调用方式

在 `asdm-presentation-create` action 中，系统会自动调用 `pptx` 技能：

1. 使用 `use_skill` 工具加载 `pptx` 技能
2. 根据计划中的幻灯片类型创建对应布局的幻灯片
3. 插入标题、内容和视觉元素
4. 应用主题样式
5. 保存为 `.pptx` 文件

### 幻灯片类型 → 布局映射

| 幻灯片类型 | 布局 | 描述 |
|------------|------|------|
| title | Title Slide | 居中标题和副标题 |
| agenda | Title and Content | 项目符号列表 |
| content | Title and Content | 标准文本内容 |
| two-column | Two Content | 并排对比或平行内容 |
| comparison | Two Content | 前后对比或优劣势 |
| image | Picture with Caption | 大图配说明文字 |
| chart | Title and Content | 图表占位符配描述 |
| quote | Title Only | 大段引言配署名 |
| section | Section Header | 章节分隔页 |
| summary | Title and Content | 关键要点总结 |
| thank-you | Title Slide | 结束页 |

## 工具集安装流程

`INSTALL.md` 将通过以下步骤设置工具集：

- 创建演示文稿构建器工作区的 `.asdm/workspace/presentations` 目录
- 检测当前的「Agentic Engine」提供商，例如 Claude Code、GitHub Copilot、腾讯 CodeBuddy 等
- 在提供商的入口点创建演示文稿构建器的快捷命令，例如 `.claude/commands`、`.github/prompts`、`.codebuddy/commands` 等

## 工具集工作流

安装演示文稿构建器后，用户可以使用以下命令：

### 第一步：规划演示文稿
```shell
/asdm-presentation-planning <主题或大纲>
```
这将：
1. 分析输入（主题、大纲或文档）
2. 确定目标受众和演示目的
3. 生成结构化计划，包含幻灯片类型和内容大纲
4. 保存计划到 `.asdm/workspace/presentations/`

### 第二步：创建演示文稿文件
```shell
/asdm-presentation-create <演示文稿ID或计划文件路径>
```
这将：
1. 加载演示文稿计划
2. 使用 `pptx` 技能生成 `.pptx` 文件
3. 应用专业样式和布局
4. 保存输出文件到工作区

## 工具集结构

演示文稿构建器工具集具有以下结构：

```
.asdm/
└── toolsets/
    └── presentation-builder/                        ## 演示文稿构建器工具集
        ├── INSTALL.md                               ## 工具集安装说明
        ├── README.md                                ## 英文文档
        ├── README.zh.md                             ## 中文文档
        ├── manifest.json                            ## 工具集元数据
        └── actions/                                 ## 演示文稿构建器指令
            ├── asdm-presentation-planning.md        ## 规划演示文稿结构指令
            └── asdm-presentation-create.md          ## 创建 .pptx 文件指令
        └── specs/                                   ## 规范文档
            ├── presentation-structure-spec.md        ## 演示文稿标准结构规范
            ├── slide-type-spec.md                   ## 幻灯片类型定义规范
            ├── presentation-plan-spec.md             ## 演示计划输出格式规范
            ├── presentation-index-spec.md            ## 演示索引格式规范
            └── theme-style-spec.md                  ## 主题与样式规范
        └── tools/                                   ## 工具脚本
            └── README.md                             ## 工具说明文档
```

## 工具集工作区

演示文稿构建器工具集具有以下工作区结构：

```
.asdm/
└── workspace/                                       ## ASDM 工作区
    └── presentations/                               ## 演示文稿工作区
        ├── index.md                                 ## 演示文稿索引/跟踪文档
        └── <presentation-id>/                       ## 演示文稿工作区
            ├── presentation-plan.md                  ## 生成的演示计划
            └── <presentation-id>.pptx                ## 生成的演示文稿文件
```

## 与其他工具集的集成

- **Context Builder**：演示文稿可以引用项目上下文（数据模型、架构）用于技术演示
- **PRD Builder**：功能 PRD 可以转换为利益相关者演示文稿
- **Basic Tools**：使用 git commit 保存生成的演示文稿

## 版权与许可

版权所有 (c) 2026 LeansoftX.com & iSoftStone。保留所有权利。

根据专有软件许可证授权。请参阅项目根目录中的 [LICENSE](LICENSE) 获取许可信息。
