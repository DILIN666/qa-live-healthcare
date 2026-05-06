# Action: Presentation Create

**action-id**: asdm-presentation-create
**action-name**: Presentation Create
**version**: 0.0.1

---

## Purpose

Generate a `.pptx` presentation file from an existing presentation plan. This action reads the plan file, invokes the `pptx` skill to create the actual presentation, and saves the output to the workspace.

## Language Detection

1. Read the presentation plan's language setting
2. Use the same language for any user interaction
3. Default to `zh-CN` if not specified

## Context Injection

Before starting, load the following context:

1. **Presentation Plan**: Read the specified plan file from `.asdm/workspace/presentations/`
2. **Project Context**: Read `.asdm/contexts/index.md` if available (for additional context in technical presentations)

## Steps

### Step 1: Locate Presentation Plan

The user provides either:
- A presentation ID (e.g., `PRES-001`)
- A direct file path (e.g., `.asdm/workspace/presentations/PRES-001/presentation-plan.md`)

If a presentation ID is given, construct the path:
```
.asdm/workspace/presentations/PRES-001/presentation-plan.md
```

Read and parse the plan file.

### Step 2: Validate Plan

Verify the plan contains:
- Presentation title
- At least one slide definition
- Slide types are valid (per `slide-type-spec.md`)
- Each slide has content defined

If validation fails, report the issues and suggest running `/asdm-presentation-planning` first.

### Step 3: Load the `pptx` Skill

Invoke the `pptx` skill by calling `use_skill` with command `pptx`. This skill provides the capability to create, modify, and save `.pptx` files.

### Step 4: Generate Presentation

Using the `pptx` skill, create the presentation file:

1. Create a new presentation with the specified theme
2. For each slide in the plan:
   a. Determine the slide layout based on the slide type
   b. Add the slide with appropriate layout
   c. Insert title, content, and any visual elements
   d. Add speaker notes if specified
3. Apply consistent styling throughout
4. Save the presentation

#### Slide Type → Layout Mapping

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

### Step 5: Save Output

1. Save the `.pptx` file to: `.asdm/workspace/presentations/PRES-XXX/PRES-XXX.pptx`
2. Also copy to the workspace root or a user-specified location for easy access
3. Update the presentation plan status from `PLANNED` to `CREATED`
4. Update the presentations index with the output file path

### Step 6: Report Results

Display to the user:
- Output file path
- Total slides generated
- File size
- Any warnings or notes

## Input

- **Required**: Presentation ID (e.g., `PRES-001`) or plan file path
- **Optional**:
  - Output file name (default: `PRES-XXX.pptx`)
  - Output directory (default: `.asdm/workspace/presentations/PRES-XXX/`)
  - Theme override

## Output

- A `.pptx` file saved to the specified location
- Updated presentation plan with `CREATED` status
- Updated presentations index
- Summary displayed to user

## Error Handling

- If the plan file is not found, inform the user and suggest available presentation IDs
- If the `pptx` skill is not available, inform the user and provide manual creation guidance
- If slide content is missing, use placeholder text and flag for user review
- If the output file cannot be saved, suggest alternative paths

## Related Specifications

- `.asdm/toolsets/presentation-builder/specs/presentation-structure-spec.md`
- `.asdm/toolsets/presentation-builder/specs/slide-type-spec.md`
