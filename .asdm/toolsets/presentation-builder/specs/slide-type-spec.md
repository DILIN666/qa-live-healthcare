# Slide Type Specification

**Spec ID**: slide-type-spec
**Version**: 0.0.1
**Last Updated**: 2026-05-05

---

## Purpose

This specification defines all available slide types, their layouts, content rules, and usage guidelines for the Presentation Builder toolset.

## Slide Types

### 1. `title` — Title Slide

**Usage**: First slide of every presentation. Introduces the topic and presenter.

**Layout**:
```
┌─────────────────────────────────────┐
│                                     │
│          <Main Title>               │
│          <Subtitle>                 │
│                                     │
│          <Presenter>                │
│          <Date>                     │
└─────────────────────────────────────┘
```

**Content Rules**:
- Main title: 1-2 lines, concise and compelling
- Subtitle: optional, 1 line, provides context
- Presenter: name and/or organization
- Date: presentation date
- No bullet points

**Slide count**: Exactly 1 per presentation (must be first slide)

---

### 2. `agenda` — Agenda/Overview Slide

**Usage**: Outlines the structure of the presentation. Should follow the title slide.

**Layout**:
```
┌─────────────────────────────────────┐
│  <Slide Title>                      │
│                                     │
│  • Topic One                        │
│  • Topic Two                        │
│  • Topic Three                      │
│  • Topic Four                       │
│  • Topic Five                       │
└─────────────────────────────────────┘
```

**Content Rules**:
- 3-7 agenda items
- Items should match subsequent slide sections
- Use parallel grammar structure
- Keep items brief (2-5 words each)

**Slide count**: 0-1 per presentation

---

### 3. `content` — Standard Content Slide

**Usage**: The workhorse slide. Presents information in bullet point format.

**Layout**:
```
┌─────────────────────────────────────┐
│  <Slide Title>                      │
│                                     │
│  • Main point one                   │
│    - Supporting detail              │
│  • Main point two                   │
│  • Main point three                 │
└─────────────────────────────────────┘
```

**Content Rules**:
- Maximum 7 bullet points
- Maximum 2 levels of indentation
- Each bullet: maximum 2 lines
- Prefer active voice
- Use parallel structure

**Slide count**: Unlimited (most common type)

---

### 4. `two-column` — Two Column Slide

**Usage**: Presents parallel information side by side.

**Layout**:
```
┌─────────────────────────────────────┐
│  <Slide Title>                      │
│                                     │
│  ┌──────────┐    ┌──────────┐      │
│  │ Column A │    │ Column B │      │
│  │ • Item 1 │    │ • Item 1 │      │
│  │ • Item 2 │    │ • Item 2 │      │
│  └──────────┘    └──────────┘      │
└─────────────────────────────────────┘
```

**Content Rules**:
- Both columns should have comparable content depth
- Maximum 5 items per column
- Include column headers
- Use consistent formatting between columns

**Slide count**: As needed

---

### 5. `comparison` — Comparison Slide

**Usage**: For before/after, pros/cons, or option comparisons.

**Layout**:
```
┌─────────────────────────────────────┐
│  <Slide Title>                      │
│                                     │
│  ┌──────────┐    ┌──────────┐      │
│  │ Option A │    │ Option B │      │
│  │ ✅ Pro   │    │ ✅ Pro   │      │
│  │ ❌ Con   │    │ ❌ Con   │      │
│  └──────────┘    └──────────┘      │
└─────────────────────────────────────┘
```

**Content Rules**:
- Clearly label each side
- Match items between sides for fair comparison
- Maximum 5 comparison points
- Consider using visual indicators (✅/❌, +/-)

**Slide count**: As needed

---

### 6. `image` — Image with Caption

**Usage**: Showcase a key visual (diagram, screenshot, photo).

**Layout**:
```
┌─────────────────────────────────────┐
│  <Slide Title>                      │
│                                     │
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │         <Image>             │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│  <Caption text>                    │
└─────────────────────────────────────┘
```

**Content Rules**:
- Image should occupy 60-80% of slide area
- Include descriptive caption
- Title should provide context
- Speaker notes should explain the visual

**Slide count**: As needed

---

### 7. `chart` — Data/Chart Slide

**Usage**: Present quantitative data or statistics.

**Layout**:
```
┌─────────────────────────────────────┐
│  <Slide Title>                      │
│                                     │
│  Key insight: <one-line summary>    │
│                                     │
│  ┌─────────────────────────────┐   │
│  │        <Chart Area>          │   │
│  └─────────────────────────────┘   │
│  Source: <data source>              │
└─────────────────────────────────────┘
```

**Content Rules**:
- Always include a key insight summary
- Label all data points
- Cite the data source
- Maximum 2 charts per slide
- Choose appropriate chart type (bar, line, pie, etc.)

**Slide count**: As needed

---

### 8. `quote` — Quote Slide

**Usage**: Highlight a key quote, insight, or call to action.

**Layout**:
```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│  "<Quote text>"                     │
│                                     │
│  — <Attribution>                    │
│                                     │
└─────────────────────────────────────┘
```

**Content Rules**:
- Quote: 1-3 sentences, impactful
- Always include attribution
- Large font size (32pt+)
- Minimal other text

**Slide count**: 0-2 per presentation

---

### 9. `section` — Section Divider

**Usage**: Separate major sections of the presentation. Provides visual breathing room.

**Layout**:
```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│          Section Title              │
│          Section subtitle           │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

**Content Rules**:
- Title: section name (1-4 words)
- Subtitle: optional brief description
- Use contrasting background color
- Keep minimal and clean

**Slide count**: 0-4 per presentation

---

### 10. `summary` — Summary/Takeaways Slide

**Usage**: Recap key points before closing.

**Layout**:
```
┌─────────────────────────────────────┐
│  Key Takeaways                      │
│                                     │
│  1️⃣ <Takeaway one>                  │
│  2️⃣ <Takeaway two>                  │
│  3️⃣ <Takeaway three>                │
│  4️⃣ <Takeaway four>                │
│  5️⃣ <Takeaway five>                │
└─────────────────────────────────────┘
```

**Content Rules**:
- 3-5 key takeaways maximum
- Each takeaway should be concise and memorable
- Use numbered list for clarity
- Focus on actionable or important points
- Should be near the end of the presentation

**Slide count**: Exactly 1 per presentation (recommended)

---

### 11. `thank-you` — Closing Slide

**Usage**: Final slide to thank the audience and provide contact info.

**Layout**:
```
┌─────────────────────────────────────┐
│                                     │
│          Thank You!                 │
│                                     │
│    📧 <email>                       │
│    🌐 <website>                     │
│    📱 <social media>                │
│                                     │
│          Questions?                 │
└─────────────────────────────────────┘
```

**Content Rules**:
- Must be the last slide
- Include contact information
- Optional: Q&A invitation
- Keep clean and professional

**Slide count**: Exactly 1 per presentation (must be last slide)

---

## Slide Type Selection Guide

When planning a presentation, use this guide to select appropriate slide types:

| Content Need | Recommended Type | Alternative |
|-------------|-----------------|-------------|
| Introduce the presentation | `title` | — |
| Show what's coming | `agenda` | `content` |
| Present key information | `content` | `two-column` |
| Compare two things | `comparison` | `two-column` |
| Show a diagram/screenshot | `image` | `content` |
| Present data/statistics | `chart` | `content` |
| Highlight a key message | `quote` | `content` |
| Transition between sections | `section` | — |
| Summarize key points | `summary` | `content` |
| Close the presentation | `thank-you` | — |

## Mandatory Slide Types

Every presentation must include:
1. **`title`** — as the first slide
2. **`thank-you`** — as the last slide

All other slide types are optional and should be selected based on content needs.
