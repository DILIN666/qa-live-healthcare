# Action: Presentation Planning

**action-id**: asdm-presentation-planning
**action-name**: Presentation Planning
**version**: 0.0.1

---

## Purpose

Analyze a topic, outline, or existing document and generate a structured presentation plan with slide-by-slide content breakdown. The plan serves as the blueprint for creating a `.pptx` presentation file.

## Language Detection

1. Read the user's input language
2. If the user writes in Chinese, set output language to `zh-CN`
3. If the user writes in English, set output language to `en-US`
4. Default to `zh-CN` if ambiguous

## Context Injection

Before starting, load the following context if available:

1. **Project Context**: Read `.asdm/contexts/index.md` if it exists, then load relevant context files (architecture, data-models, api, etc.)
2. **Existing Presentations**: Read `.asdm/workspace/presentations/index.md` to check for existing presentations and avoid ID conflicts

## Steps

### Step 1: Parse Input

Analyze the user's input to determine the type:

- **Topic**: A short phrase or sentence (e.g., "AI在医疗领域的应用")
- **Outline**: A numbered or bulleted list of sections
- **Document reference**: A file path to analyze (e.g., a PRD, report, or markdown file)
- **Existing feature**: A feature ID (e.g., `FEAT-001`) referencing `.asdm/workspace/features/`

If a document reference or feature ID is provided, read the corresponding file first.

### Step 2: Determine Presentation Scope

Based on the input, determine:

1. **Purpose**: What is this presentation for? (pitch, report, training, overview, etc.)
2. **Audience**: Who will view this? (executives, technical team, clients, general public)
3. **Duration**: Estimated presentation length (default: 15-20 minutes / 10-15 slides)
4. **Tone**: Professional, casual, academic, or persuasive

### Step 3: Generate Presentation Plan

Using the `presentation-structure-spec.md` and `slide-type-spec.md` specs as templates, generate a structured plan:

1. Determine the total number of slides (typically 8-20)
2. Assign slide types to each slide (title, agenda, content, comparison, chart, summary, etc.)
3. Write slide titles and key bullet points for each slide
4. Add speaker notes for each slide
5. Suggest visual elements (images, charts, diagrams)
6. Define the overall theme/color scheme suggestion

### Step 4: Save Presentation Plan

1. Generate a unique presentation ID: `PRES-XXX` (increment from existing IDs)
2. Create directory: `.asdm/workspace/presentations/PRES-XXX/`
3. Save the plan to: `.asdm/workspace/presentations/PRES-XXX/presentation-plan.md`
4. Update the presentations index: `.asdm/workspace/presentations/index.md`

### Step 5: Present Plan to User

Display the generated plan summary including:
- Presentation ID
- Total slides
- Slide outline (titles only)
- Suggested theme

Ask the user to review and optionally modify the plan before proceeding to creation.

## Plan File Format

The plan file should follow this structure (refer to `presentation-structure-spec.md` for details):

```markdown
# Presentation Plan: <Presentation Title>

**Presentation ID**: PRES-XXX
**Created Date**: YYYY-MM-DD
**Status**: PLANNED
**Language**: zh-CN

## Presentation Info

- **Purpose**: <purpose>
- **Audience**: <audience>
- **Estimated Duration**: <duration> minutes
- **Total Slides**: <count>
- **Theme Suggestion**: <theme>

## Slides

### Slide 1: <Title>
- **Type**: title
- **Content**: 
  - Main title
  - Subtitle
  - Author/date
- **Speaker Notes**: <notes>
- **Visual Suggestion**: <visual>

### Slide 2: <Title>
- **Type**: agenda
- **Content**:
  - Item 1
  - Item 2
  - ...
- **Speaker Notes**: <notes>
- **Visual Suggestion**: <visual>

... (continue for all slides)
```

## Input

- **Required**: A topic, outline, document path, or feature ID
- **Optional**: 
  - Target audience (default: inferred from content)
  - Number of slides (default: 10-15)
  - Presentation purpose (default: inferred from content)

## Output

- A presentation plan file saved to `.asdm/workspace/presentations/PRES-XXX/presentation-plan.md`
- Updated presentations index at `.asdm/workspace/presentations/index.md`
- Summary displayed to user

## Error Handling

- If input is empty or ambiguous, ask the user for clarification
- If a referenced document doesn't exist, inform the user and suggest alternatives
- If the workspace directory doesn't exist, create it automatically

## Related Specifications

- `.asdm/toolsets/presentation-builder/specs/presentation-structure-spec.md`
- `.asdm/toolsets/presentation-builder/specs/slide-type-spec.md`
