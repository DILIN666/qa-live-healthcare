# Presentation Builder Toolset Installation

**Toolset ID:** `presentation-builder`

## Overview

This document provides instructions for installing and setting up the Presentation Builder toolset in a workspace. Presentation Builder provides AI-powered presentation planning and creation capabilities.

## AI Guided Installation

To install this toolset using AI Guided Installation, copy and paste the following prompt into your AI Coding tool's chat window:

```shell
Follow instructions in .asdm/toolsets/presentation-builder/INSTALL.md
```

## Installation Steps

### 1. Create workspace directory for presentations

```bash
mkdir -p .asdm/workspace/presentations
```

Create the presentation index file if it doesn't exist:

```bash
cat > .asdm/workspace/presentations/index.md << 'EOF'
# Presentations Index

**Created Date**: 2026-05-05
**Last Updated**: 2026-05-05

## Summary

| | Total Presentations | Planned | Created | Status |
|---|---------------------|---------|---------|--------|
| | 0                   | 0       | 0       | -      |

## Presentation Registry

| | Presentation ID | Presentation Name | Status | Plan File | Output File | Created | Updated |
|---|----------------|-------------------|--------|-----------|-------------|---------|---------|
EOF
```

### 2. Detect the current `Agentic Engine` provider

Detect the current AI coding assistant provider (e.g., Claude Code, GitHub Copilot, Tencent CodeBuddy). Using the following guidelines to detect the provider:

- If `.claude` directory exists, use `Claude Code`
- If `.github` directory exists, use `GitHub Copilot`
- If `.codebuddy` directory exists, use `Tencent CodeBuddy`
- If no such folder is found in the current workspace, give user a prompt to select a provider manually

### 3. Create shortcuts commands for Presentation Builder (toolset ID: `presentation-builder`) in provider's entry point

Create shortcut commands in the appropriate location based on the detected provider:

#### For Claude Code (`.claude/commands/`):

```bash
mkdir -p .claude/commands/

# Presentation Planning command
cat > .claude/commands/asdm-presentation-planning.md << 'EOF'
---
description: "Plan a presentation structure from a topic, outline, or document"
argument-hint: "[topic or outline description]"
---

EOF
cat .asdm/toolsets/presentation-builder/actions/asdm-presentation-planning.md >> .claude/commands/asdm-presentation-planning.md

# Presentation Create command
cat > .claude/commands/asdm-presentation-create.md << 'EOF'
---
description: "Create a .pptx presentation file from a presentation plan"
argument-hint: "[presentation plan file path or presentation ID]"
---

EOF
cat .asdm/toolsets/presentation-builder/actions/asdm-presentation-create.md >> .claude/commands/asdm-presentation-create.md
```

#### For GitHub Copilot (`.github/prompts/`):

```bash
mkdir -p .github/prompts/

# Presentation Planning prompt
cat > .github/prompts/asdm-presentation-planning.prompt.md << 'EOF'
---
agent: 'agent'
description: 'Plan a presentation structure from a topic, outline, or document'
argument-hint: 'Enter topic or outline description'
---

EOF
cat .asdm/toolsets/presentation-builder/actions/asdm-presentation-planning.md >> .github/prompts/asdm-presentation-planning.prompt.md

# Presentation Create prompt
cat > .github/prompts/asdm-presentation-create.prompt.md << 'EOF'
---
agent: 'agent'
description: 'Create a .pptx presentation file from a presentation plan'
argument-hint: 'Enter presentation plan file path or ID'
---

EOF
cat .asdm/toolsets/presentation-builder/actions/asdm-presentation-create.md >> .github/prompts/asdm-presentation-create.prompt.md
```

#### For Tencent CodeBuddy (`.codebuddy/commands/`):

CodeBuddy doesn't support frontmatter, so simply copy the instruction files as-is:

```bash
mkdir -p .codebuddy/commands/

# Copy instruction files directly (no frontmatter needed)
cp .asdm/toolsets/presentation-builder/actions/asdm-presentation-planning.md .codebuddy/commands/
cp .asdm/toolsets/presentation-builder/actions/asdm-presentation-create.md .codebuddy/commands/
```

### 4. Manual Usage for Other Providers

If your AI coding assistant provider is not detected by the automatic detection logic, you can still use the Presentation Builder manually:

1. Navigate to the instruction files:
   ```bash
   cd .asdm/toolsets/presentation-builder/actions/
   ```

2. Enter a prompt in your AI coding assistant:
   ```
   Follow the instructions in .asdm/toolsets/presentation-builder/actions/asdm-presentation-planning.md
   ```

## Initializing Presentation Builder

### Planning a Presentation

After installation, plan your first presentation:

```shell
/asdm-presentation-planning Your topic here
```

This will:
1. Analyze the topic and determine presentation scope
2. Generate a structured slide-by-slide plan
3. Save the plan to `.asdm/workspace/presentations/`

### Creating a Presentation File

After planning, generate the `.pptx` file:

```shell
/asdm-presentation-create <presentation-id>
```

This will:
1. Load the presentation plan
2. Use the `pptx` skill to generate the `.pptx` file
3. Apply professional styling and layout
4. Save the output to the workspace

### Available Commands

Once installed, you can use the following commands:

1. **`/asdm-presentation-planning`** - Plan a presentation structure
2. **`/asdm-presentation-create`** - Create a .pptx file from a plan

## Workspace Structure

The toolset will create the following structure in `.asdm/workspace/presentations/`:

```
.asdm/workspace/presentations/
├── index.md                            ## Presentation index/tracker
└── <presentation-id>/                  ## Workspace for a presentation
    ├── presentation-plan.md             ## Generated presentation plan
    └── <presentation-id>.pptx           ## Generated presentation file
```

## Spec Documents

The toolset uses the following spec documents as templates:

1. **`presentation-structure-spec.md`** - Standard presentation structure rules, slide sequence, and content rules
2. **`slide-type-spec.md`** - Definitions for 11 slide types with layout templates and selection guidelines
3. **`presentation-plan-spec.md`** - Template for presentation plan output format, field definitions, and validation rules
4. **`presentation-index-spec.md`** - Template for presentation index format, ID generation rules, and update rules
5. **`theme-style-spec.md`** - 6 preset themes, font rules, color specifications, layout spacing, and image guidelines

## Verification

After installation, verify that:

1. The `.asdm/workspace/presentations/` directory exists with `index.md`
2. Shortcut commands for Presentation Builder (toolset ID: `presentation-builder`) are created in the appropriate provider directory (if using Claude Code, GitHub Copilot, or Tencent CodeBuddy)
3. The Presentation Builder toolset files are located in `.asdm/toolsets/presentation-builder/` (toolset ID: `presentation-builder`)

**For other providers**: Verify that you can access the instruction files at:
- `.asdm/toolsets/presentation-builder/actions/asdm-presentation-planning.md`
- `.asdm/toolsets/presentation-builder/actions/asdm-presentation-create.md`

## Usage Examples

```shell
# Plan a presentation about a topic
/asdm-presentation-planning AI在医疗领域的应用

# Plan a presentation from an outline
/asdm-presentation-planning 1.项目背景 2.技术方案 3.实施计划 4.预期成果

# Plan a presentation from an existing feature
/asdm-presentation-planning FEAT-001

# Create a presentation from the plan
/asdm-presentation-create PRES-001

# Or reference the plan file directly
/asdm-presentation-create .asdm/workspace/presentations/PRES-001/presentation-plan.md
```

## Usage

### For Supported Providers (Claude Code, GitHub Copilot, Tencent CodeBuddy)

Once installed, you can use the following commands:

- `/asdm-presentation-planning {topic or outline}`: Plan a presentation structure from a topic, outline, or document
- `/asdm-presentation-create {presentation ID or plan file path}`: Create a .pptx file from a presentation plan

### For Other Providers (Manual Usage)

If your provider is not automatically detected, you can manually use the instructions by following the steps in the "Manual Usage for Other Providers" section above.

## Integration with Other Toolsets

- **Context Builder**: Reference project context for technical presentations
- **PRD Builder**: Convert feature PRDs into stakeholder presentations
- **Basic Tools**: Git commit generated presentations

## Uninstallation

To uninstall the Presentation Builder toolset:

### Remove toolset directory
```bash
rm -rf .asdm/toolsets/presentation-builder
```

### Remove workspace data (optional, preserves existing presentations)
```bash
# To remove all presentation data
rm -rf .asdm/workspace/presentations

# To keep existing presentations, only remove the toolset
```

### Remove shortcut commands

**For Claude Code:**
```bash
rm -f .claude/commands/asdm-presentation-planning.md
rm -f .claude/commands/asdm-presentation-create.md
```

**For GitHub Copilot:**
```bash
rm -f .github/prompts/asdm-presentation-planning.prompt.md
rm -f .github/prompts/asdm-presentation-create.prompt.md
```

**For Tencent CodeBuddy:**
```bash
rm -f .codebuddy/commands/asdm-presentation-planning.md
rm -f .codebuddy/commands/asdm-presentation-create.md
```

## Notes

- This installation process assumes you have the necessary permissions to create directories and files
- The actual implementation of the commands will be handled by the AI model using the templates and instructions provided in Presentation Builder (toolset ID: `presentation-builder`)
- Make sure to customize the provider-specific setup based on your actual AI coding assistant
- The toolset ID `presentation-builder` should be used consistently when referring to Presentation Builder in commands and documentation
- **pptx skill dependency**: This toolset requires the `pptx` skill to be available for `.pptx` file generation. If the skill is not available, the planning step will still work, but the creation step will fail. Check your environment for skill availability.
- **For providers not in the detection logic**: Users can manually use the instruction files by copying their relative paths and entering prompts like "Follow the instructions in .asdm/toolsets/presentation-builder/actions/asdm-presentation-planning.md"
- The planning step is independent of the creation step; you can review and edit the plan before generating the file
- Plans are saved as Markdown files for easy review and version control
- Presentation statuses: PLANNED, CREATED
- The toolset automatically updates the presentations index when new presentations are generated

### Getting Help

For issues with Presentation Builder toolset, refer to:
- [ASDM Documentation](https://asdm.ai/docs)
- Toolset README: `.asdm/toolsets/presentation-builder/README.md`
- Spec documents in `.asdm/toolsets/presentation-builder/specs/`

## License

Copyright (c) 2026 LeansoftX.com & iSoftStone. All rights reserved.

Licensed under the PROPRIETARY SOFTWARE LICENSE. See [LICENSE](LICENSE) in the project root for license information.

---

*This installation document is part of the Presentation Builder toolset. Use the actions to plan and create professional presentations.*
