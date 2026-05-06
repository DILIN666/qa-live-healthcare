# ASDM Toolset - Presentation Builder

**toolset-id**: presentation-builder
**toolset-name**: Presentation Builder
**version**: 0.0.1
**updated-date**: 2026-05-05
**toolset-description**: AI-powered presentation planning, structuring, and generation toolset. Create professional slide decks from topics, outlines, or existing documents.

---

## Overview

Presentation Builder (toolset-id: presentation-builder) is an ASDM toolset that helps users create professional presentations through an AI-assisted workflow. It provides two main capabilities:

1. **Presentation Planning** — Analyze a topic, outline, or existing document and generate a structured presentation plan with slide-by-slide content breakdown.
2. **Presentation Creation** — Generate a `.pptx` file based on the planned structure, with professional layout, styling, and content.

The toolset integrates with the `pptx` skill for actual file generation, while providing the planning and structuring intelligence.

User can install this toolset into a workspace and run `INSTALL.md` document using `AI Guided Installation` to initialize the toolset for the workspace. Just simply copy and paste the following prompt into your `AI Coding` tool's chat window and hit enter:

```shell
Follow instructions in .asdm/toolsets/presentation-builder/INSTALL.md
```

## Features

### Common Features

- Provide user friendly shortcuts `actions` using provider's entry point to ease the process of planning and creating presentations for a workspace
- Provide standard `spec` for defining presentation structure, and allow user admin (Project Manager, Product Manager, Product Owner) to define their own process by customizing the templates (spec documents)

### Planning Phase

- **Topic-to-Presentation**: Provide a topic and get a full presentation plan
- **Outline-to-Presentation**: Convert an existing outline into a structured slide deck
- **Document-to-Presentation**: Extract key information from documents and create a presentation
- **Feature-to-Presentation**: Reference a feature ID (e.g., `FEAT-001`) from `.asdm/workspace/features/` to generate a presentation
- **Smart Structuring**: Automatically determine slide types (title, content, comparison, chart, summary, etc.)
- **Content Generation**: Generate slide titles, bullet points, speaker notes, and visual suggestions
- Save plans to `.asdm/workspace/presentations/<presentation-id>/presentation-plan.md`

### Creation Phase

- **Professional Styling**: Apply consistent design themes and layout rules
- Use the `pptx` skill to generate the `.pptx` file based on the plan
- Support 11 slide types with appropriate layouts
- Save output file to `.asdm/workspace/presentations/<presentation-id>/`

## Skill Execution

Presentation Builder uses the `pptx` skill for `.pptx` file generation. The skill is a dynamically loaded executable module from the runtime environment.

### Skill Dependencies

| Skill ID | Name | Purpose |
|----------|------|---------|
| pptx | PPTX File Generator | Create, modify, and save .pptx presentation files |

### Skill Invocation

In the `asdm-presentation-create` action, the system automatically invokes the `pptx` skill:

1. Load the `pptx` skill using the `use_skill` tool
2. Create slides with appropriate layouts based on slide types from the plan
3. Insert titles, content, and visual elements
4. Apply theme styling
5. Save as `.pptx` file

### Slide Type → Layout Mapping

| Slide Type | Layout | Description |
|------------|--------|-------------|
| title | Title Slide | Centered title with subtitle |
| agenda | Title and Content | Bulleted list of agenda items |
| content | Title and Content | Standard text content with bullets |
| two-column | Two Content | Side-by-side comparison or parallel content |
| comparison | Two Content | Before/after or pros/cons layout |
| image | Picture with Caption | Large image with caption text |
| chart | Title and Content | Chart placeholder with description |
| quote | Title Only | Large quote with attribution |
| section | Section Header | Section divider slide |
| summary | Title and Content | Key takeaways |
| thank-you | Title Slide | Closing slide |

## Toolset Installation Process

`INSTALL.md` will setup the toolset with the following steps:

- Create `.asdm/workspace/presentations` directory for Presentation Builder's workspace
- Detect the current `Agentic Engine` provider, e.g. Claude Code, GitHub Copilot, Tencent CodeBuddy etc.
- Create shortcuts commands for Presentation Builder in provider's entry point, e.g. `.claude/commands`, `.github/prompts`, `.codebuddy/commands` etc.

## Toolset Workflow

Once Presentation Builder is installed, user can use the following commands to plan and create presentations for the current workspace:

### Step 1: Plan the Presentation
```shell
/asdm-presentation-planning <topic-or-outline>
```
This will:
1. Analyze the input (topic, outline, or document)
2. Determine the target audience and presentation purpose
3. Generate a structured plan with slide types and content outline
4. Save the plan to `.asdm/workspace/presentations/`

### Step 2: Create the Presentation File
```shell
/asdm-presentation-create <presentation-id-or-plan-file>
```
This will:
1. Load the presentation plan
2. Use the `pptx` skill to generate the `.pptx` file
3. Apply professional styling and layout
4. Save the output file to the workspace

## Toolset Structure

The Presentation Builder toolset has the following structure:

```
.asdm/
└── toolsets/
    └── presentation-builder/                        ## Presentation Builder toolset
        ├── INSTALL.md                               ## Installation instructions for the toolset
        ├── README.md                                ## English documentation
        ├── README.zh.md                             ## Chinese documentation
        ├── manifest.json                            ## Toolset metadata and command registry
        └── actions/                                 ## Presentation Builder instructions
            ├── asdm-presentation-planning.md        ## Instruction for planning presentation structure
            └── asdm-presentation-create.md          ## Instruction for creating .pptx file from plan
        └── specs/                                   ## Spec documents for Presentation Builder
            ├── presentation-structure-spec.md        ## Standard presentation structure rules
            ├── slide-type-spec.md                   ## Slide type definitions and templates
            ├── presentation-plan-spec.md             ## Presentation plan output format specification
            ├── presentation-index-spec.md            ## Presentation index format specification
            └── theme-style-spec.md                  ## Theme and style specification
        └── tools/                                   ## Tool scripts
            └── README.md                             ## Tools documentation
```

## Toolset Workspace

The Presentation Builder toolset has the following workspace structure:

```
.asdm/
└── workspace/                                       ## Workspace for ASDM
    └── presentations/                               ## Workspace for presentations
        ├── index.md                                 ## Presentation index/tracker
        └── <presentation-id>/                       ## Workspace for a presentation
            ├── presentation-plan.md                  ## Generated presentation plan
            └── <presentation-id>.pptx                ## Generated presentation file
```

## Integration with Other Toolsets

- **Context Builder**: Presentations can reference project context (data models, architecture) for technical presentations
- **PRD Builder**: Feature PRDs can be converted into stakeholder presentations
- **Basic Tools**: Use git commit to save generated presentations

## Copyright & License

Copyright (c) 2026 LeansoftX.com & iSoftStone. All rights reserved.

Licensed under the PROPRIETARY SOFTWARE LICENSE. See [LICENSE](LICENSE) in the project root for license information.
