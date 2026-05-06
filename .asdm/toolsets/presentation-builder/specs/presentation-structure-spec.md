# Presentation Structure Specification

**Spec ID**: presentation-structure-spec
**Version**: 0.0.1
**Last Updated**: 2026-05-05

---

## Purpose

This specification defines the standard structure and rules for creating presentation plans within the Presentation Builder toolset. All generated presentation plans must conform to this specification.

## Standard Presentation Structure

A well-structured presentation follows a narrative arc:

```
Opening → Context → Core Content → Evidence → Conclusion
```

### Recommended Slide Sequence

| Section | Typical Slides | Purpose |
|---------|---------------|---------|
| **Opening** | 1-2 | Title slide, agenda/overview |
| **Context** | 1-3 | Background, problem statement, motivation |
| **Core Content** | 3-8 | Main points, features, arguments |
| **Evidence** | 1-3 | Data, charts, case studies, comparisons |
| **Conclusion** | 1-2 | Summary, next steps, Q&A |

### Slide Count Guidelines

| Presentation Type | Duration | Recommended Slides |
|-------------------|----------|-------------------|
| Lightning talk | 5 min | 5-7 |
| Short presentation | 10 min | 8-12 |
| Standard presentation | 20 min | 12-18 |
| Keynote | 45 min | 20-30 |
| Workshop | 60+ min | 25-40 |

## Plan File Format

### File Naming

- Directory: `.asdm/workspace/presentations/PRES-XXX/`
- File: `presentation-plan.md`
- ID format: `PRES-NNN` (zero-padded, e.g., PRES-001, PRES-012)

### Markdown Structure

```markdown
# Presentation Plan: <Title>

**Presentation ID**: PRES-XXX
**Created Date**: YYYY-MM-DD
**Status**: PLANNED | CREATED
**Language**: zh-CN | en-US

## Presentation Info

- **Purpose**: <purpose description>
- **Audience**: <audience description>
- **Estimated Duration**: <minutes> minutes
- **Total Slides**: <count>
- **Theme Suggestion**: <theme name>
- **Color Scheme**: <primary>, <secondary>, <accent>

## Slides

### Slide N: <Slide Title>
- **Type**: <slide-type>
- **Content**:
  - <bullet point 1>
  - <bullet point 2>
  - ...
- **Speaker Notes**: <detailed notes for the speaker>
- **Visual Suggestion**: <description of recommended visual>
- **Layout Notes**: <any special layout instructions>
```

## Content Rules

### Title Slides
- Must be the first slide
- Include: main title, subtitle, presenter name/organization, date
- No more than one title slide per presentation

### Agenda Slides
- Should follow the title slide
- List 3-7 main topics
- Match the order of subsequent slides

### Content Slides
- Maximum 5-7 bullet points per slide
- Each bullet point: maximum 2 lines
- Use progressive disclosure for complex content
- Prefer parallel structure in bullet points

### Comparison Slides
- Use for: before/after, pros/cons, option A vs B
- Maximum 4 items per column
- Use consistent formatting for each side

### Chart/Data Slides
- Include a brief text summary of the key insight
- Label all axes and data points
- Use consistent color coding across charts

### Summary Slides
- Maximum 5 key takeaways
- Each takeaway should be actionable or memorable
- Include next steps or call to action

### Closing Slides
- Thank the audience
- Include contact information
- Optional: Q&A prompt

## Theme and Styling

### Recommended Themes

| Theme | Best For | Primary Color |
|-------|----------|--------------|
| Professional | Business, corporate | Navy Blue |
| Academic | Research, education | Dark Teal |
| Creative | Design, marketing | Vibrant Purple |
| Technical | Engineering, IT | Steel Blue |
| Medical | Healthcare, life sciences | Forest Green |

### Font Guidelines

- **Headings**: Sans-serif, 28-36pt
- **Body**: Sans-serif, 18-24pt
- **Notes**: Sans-serif, 14pt
- Maximum 2 font families per presentation

### Color Rules

- Use a consistent palette (3-5 colors)
- Ensure sufficient contrast (WCAG AA minimum)
- Use color purposefully (not decoratively)
- Keep background simple and non-distracting

## Validation Rules

A presentation plan must pass these checks:

1. ✅ Has a unique Presentation ID
2. ✅ Contains at least 5 slides
3. ✅ First slide is type `title`
4. ✅ No more than 2 consecutive content slides without a visual
5. ✅ Includes a summary or conclusion slide
6. ✅ Speaker notes provided for at least 80% of slides
7. ✅ Total slide count matches the declared count
8. ✅ No slide has more than 7 bullet points
9. ✅ All slide types are valid (per slide-type-spec.md)
