# Theme & Style Specification

**Spec ID**: theme-style-spec
**Version**: 0.0.1
**Last Updated**: 2026-05-05

---

## Purpose

This specification defines the available presentation themes, color schemes, font rules, and styling guidelines. When generating presentations, the `asdm-presentation-create` action must apply styles according to this specification.

## Predefined Themes

### 1. Professional — 商务专业

**Best for**: Business meetings, corporate presentations, stakeholder updates

| Element | Value |
|---------|-------|
| Primary Color | `#1B3A5C` (Navy Blue) |
| Secondary Color | `#2E86AB` (Steel Blue) |
| Accent Color | `#F18F01` (Amber) |
| Background | `#FFFFFF` (White) |
| Text Primary | `#1A1A2E` (Near Black) |
| Text Secondary | `#555555` (Dark Gray) |
| Title Font | Microsoft YaHei / Calibri |
| Body Font | Microsoft YaHei / Calibri |

### 2. Academic — 学术研究

**Best for**: Research presentations, academic conferences, thesis defenses

| Element | Value |
|---------|-------|
| Primary Color | `#0B5345` (Dark Teal) |
| Secondary Color | `#148F77` (Teal) |
| Accent Color | `#E74C3C` (Red) |
| Background | `#FFFFFF` (White) |
| Text Primary | `#1A1A2E` (Near Black) |
| Text Secondary | `#555555` (Dark Gray) |
| Title Font | SimSun / Georgia |
| Body Font | Microsoft YaHei / Calibri |

### 3. Creative — 创意设计

**Best for**: Marketing pitches, design reviews, creative showcases

| Element | Value |
|---------|-------|
| Primary Color | `#6C3483` (Vibrant Purple) |
| Secondary Color | `#A569BD` (Light Purple) |
| Accent Color | `#F39C12` (Gold) |
| Background | `#FFFFFF` (White) |
| Text Primary | `#1A1A2E` (Near Black) |
| Text Secondary | `#555555` (Dark Gray) |
| Title Font | Microsoft YaHei / Calibri |
| Body Font | Microsoft YaHei / Calibri |

### 4. Technical — 技术工程

**Best for**: Engineering reviews, technical architecture, IT presentations

| Element | Value |
|---------|-------|
| Primary Color | `#2C3E50` (Steel Blue) |
| Secondary Color | `#3498DB` (Blue) |
| Accent Color | `#27AE60` (Green) |
| Background | `#FFFFFF` (White) |
| Text Primary | `#1A1A2E` (Near Black) |
| Text Secondary | `#555555` (Dark Gray) |
| Title Font | Consolas / Calibri |
| Body Font | Microsoft YaHei / Calibri |

### 5. Medical — 医疗健康

**Best for**: Healthcare, medical research, life sciences

| Element | Value |
|---------|-------|
| Primary Color | `#1E8449` (Forest Green) |
| Secondary Color | `#27AE60` (Green) |
| Accent Color | `#2980B9` (Blue) |
| Background | `#FFFFFF` (White) |
| Text Primary | `#1A1A2E` (Near Black) |
| Text Secondary | `#555555` (Dark Gray) |
| Title Font | Microsoft YaHei / Calibri |
| Body Font | Microsoft YaHei / Calibri |

### 6. Minimal — 极简风格

**Best for**: Startup pitches, modern presentations, Apple-style talks

| Element | Value |
|---------|-------|
| Primary Color | `#2C3E50` (Dark Gray) |
| Secondary Color | `#95A5A6` (Gray) |
| Accent Color | `#E74C3C` (Red) |
| Background | `#FFFFFF` (White) |
| Text Primary | `#1A1A2E` (Near Black) |
| Text Secondary | `#555555` (Dark Gray) |
| Title Font | Microsoft YaHei / Helvetica Neue |
| Body Font | Microsoft YaHei / Helvetica Neue |

---

## Theme Selection Guide

| Content Type | Recommended Theme | Alternative |
|-------------|-------------------|-------------|
| Business/corporate | Professional | Minimal |
| Research/academic | Academic | Professional |
| Marketing/creative | Creative | Minimal |
| Engineering/IT | Technical | Professional |
| Healthcare/life sciences | Medical | Professional |
| Startup/pitch | Minimal | Creative |
| General purpose | Professional | Minimal |

---

## Typography Rules

### Font Sizes (in points)

| Element | Minimum | Maximum | Recommended |
|---------|---------|---------|-------------|
| Slide Title | 28 | 40 | 32 |
| Section Header | 36 | 48 | 40 |
| Body Text | 16 | 24 | 20 |
| Bullet Points | 16 | 22 | 18 |
| Sub-bullets | 14 | 20 | 16 |
| Caption | 12 | 16 | 14 |
| Speaker Notes | 12 | 14 | 12 |

### Font Families

| Category | Chinese | English |
|----------|---------|---------|
| Primary Title | Microsoft YaHei, SimHei | Calibri, Arial |
| Body Text | Microsoft YaHei | Calibri, Arial |
| Code/Technical | Consolas, Source Code Pro | Consolas, Courier New |
| Academic | SimSun, FangSong | Georgia, Times New Roman |

### Font Rules

1. Maximum **2 font families** per presentation
2. Title and body fonts must be from the same family or visually compatible
3. Use consistent font weights: Bold for titles, Regular for body
4. Never use decorative/fonts (Comic Sans, Papyrus, etc.)
5. Code snippets must use monospace fonts

---

## Color Application Rules

### Per-Element Color Usage

| Element | Color Source | Rules |
|---------|-------------|-------|
| Slide Title | Primary Color | Always use primary color |
| Subtitle | Secondary Color | Lighter shade for hierarchy |
| Body Text | Text Primary | Near-black for readability |
| Bullet Points | Text Primary | Same as body text |
| Accent Elements | Accent Color | Use sparingly for emphasis |
| Header/Footer Bars | Primary Color | Thin bar at top or bottom |
| Background | Background | Always white or very light gray |
| Section Dividers | Primary Color | Full-bleed background |

### Contrast Requirements

| Combination | Minimum Contrast Ratio | Standard |
|------------|----------------------|----------|
| Title on White | 4.5:1 | WCAG AA |
| Body Text on White | 4.5:1 | WCAG AA |
| White on Primary | 4.5:1 | WCAG AA |
| Accent on White | 3:1 | WCAG AA (large text) |

### Color Usage Principles

1. **60-30-10 Rule**: 60% neutral (white/gray), 30% primary, 10% accent
2. **Never** use color as the sole means of conveying information
3. **Consistency**: Same color = same meaning across all slides
4. **Accessibility**: Always verify contrast ratios

---

## Layout Spacing

### Margins (relative to slide dimensions)

| Area | Size (16:9) | Percentage |
|------|------------|-----------|
| Top Margin | 0.5 inch | ~5% |
| Bottom Margin | 0.5 inch | ~5% |
| Left Margin | 0.75 inch | ~8% |
| Right Margin | 0.75 inch | ~8% |

### Element Spacing

| Elements | Spacing |
|----------|---------|
| Title to Body | 0.4 inch |
| Between Bullet Points | 0.25 inch |
| Between Columns | 0.5 inch |
| Image to Caption | 0.2 inch |

---

## Slide Master Layouts

### Title Slide Layout
```
┌──────────────────────────────────────┐
│  ╔══════════════════════════════╗    │
│  ║     <Main Title>            ║    │
│  ║     <Subtitle>              ║    │
│  ║                              ║    │
│  ║     <Presenter / Date>       ║    │
│  ╚══════════════════════════════╝    │
└──────────────────────────────────────┘
```

### Content Slide Layout
```
┌──────────────────────────────────────┐
│  <Slide Title>                       │
│  ─────────────────                   │
│                                      │
│  • Bullet point 1                    │
│  • Bullet point 2                    │
│  • Bullet point 3                    │
│                                      │
│  ┌─────────────────────────────┐    │
│  │     <Optional Image Area>   │    │
│  └─────────────────────────────┘    │
└──────────────────────────────────────┘
```

### Two-Column Layout
```
┌──────────────────────────────────────┐
│  <Slide Title>                       │
│  ─────────────────                   │
│                                      │
│  ┌──────────────┐ ┌──────────────┐  │
│  │  Column A     │ │  Column B     │  │
│  │  • Item 1     │ │  • Item 1     │  │
│  │  • Item 2     │ │  • Item 2     │  │
│  └──────────────┘ └──────────────┘  │
└──────────────────────────────────────┘
```

### Section Divider Layout
```
┌──────────────────────────────────────┐
│  ████████████████████████████████    │
│  ████████████████████████████████    │
│  ██  <Section Title>           ██    │
│  ██  <Section Subtitle>       ██    │
│  ████████████████████████████████    │
│  ████████████████████████████████    │
└──────────────────────────────────────┘
```
(Full-bleed primary color background with white text)

---

## Image & Visual Guidelines

### Image Sizing

| Usage | Recommended Size (16:9) | Format |
|-------|------------------------|--------|
| Full-slide image | 1920×1080 px | PNG/JPG |
| Half-slide image | 960×540 px | PNG/JPG |
| Icon/Logo | 128×128 px | SVG/PNG |
| Thumbnail | 320×180 px | PNG/JPG |

### Image Rules

1. Use high-resolution images (minimum 150 DPI for print, 72 DPI for screen)
2. Prefer SVG for icons and diagrams
3. Apply consistent border radius (0 or 8px) across all images
4. Add subtle drop shadow for floating images (offset: 2px, blur: 4px, opacity: 15%)
5. Never stretch or distort images

### Chart Styling

| Chart Element | Style |
|---------------|-------|
| Chart Colors | Use theme colors (Primary, Secondary, Accent) |
| Axis Labels | Body font, 14pt, Text Secondary color |
| Data Labels | Body font, 12pt, bold |
| Grid Lines | Light gray (#E0E0E0), thin |
| Legend | Below chart, 12pt |
| Chart Background | Transparent or white |

---

## File Output Settings

| Setting | Value |
|---------|-------|
| Slide Size | 16:9 (13.333" × 7.5") |
| File Format | .pptx (Office Open XML) |
| Compatibility | PowerPoint 2016+, LibreOffice 7.0+ |
| Embedded Fonts | Yes (if custom fonts used) |
| Image Compression | 150 DPI minimum |
