# Presentation Index Specification

**Spec ID**: presentation-index-spec
**Version**: 0.0.1
**Last Updated**: 2026-05-05

---

## Purpose

This specification defines the format and maintenance rules for the presentations index file. The index tracks all presentations created within the workspace and serves as the single source of truth for presentation metadata.

## File Location

- **Path**: `.asdm/workspace/presentations/index.md`
- **Encoding**: UTF-8

## Template

```markdown
# Presentations Index

**Created Date**: YYYY-MM-DD
**Last Updated**: YYYY-MM-DD

## Summary

| | Total | Planned | Created | Updated |
|---|-------|---------|---------|---------|
| | <total> | <planned> | <created> | <updated> |

## Presentation Registry

| | ID | Name | Status | Theme | Slides | Plan File | Output File | Created | Updated |
|---|----|------|--------|-------|--------|-----------|-------------|---------|---------|
| | PRES-001 | <name> | PLANNED | <theme> | <count> | <path> | - | YYYY-MM-DD | YYYY-MM-DD |
| | PRES-002 | <name> | CREATED | <theme> | <count> | <path> | <path> | YYYY-MM-DD | YYYY-MM-DD |
```

## Field Definitions

### Summary Section

| Field | Type | Description |
|-------|------|-------------|
| Total | number | Total number of presentations |
| Planned | number | Presentations in PLANNED status |
| Created | number | Presentations in CREATED status |
| Updated | number | Presentations in UPDATED status |

**Invariant**: `Total = Planned + Created + Updated`

### Registry Columns

| Column | Required | Type | Description |
|--------|----------|------|-------------|
| ID | ✅ | string | Unique presentation ID (`PRES-NNN`) |
| Name | ✅ | string | Presentation title |
| Status | ✅ | enum | `PLANNED` / `CREATED` / `UPDATED` |
| Theme | ✅ | string | Applied theme name |
| Slides | ✅ | number | Total slide count |
| Plan File | ✅ | string | Relative path to plan file |
| Output File | ✅ | string | Relative path to .pptx file, or `-` if not yet created |
| Created | ✅ | date | Date created (YYYY-MM-DD) |
| Updated | ✅ | date | Date last updated (YYYY-MM-DD) |

## ID Generation Rules

1. IDs are sequential: `PRES-001`, `PRES-002`, `PRES-003`, ...
2. Always zero-pad to 3 digits
3. Never reuse or recycle IDs, even if a presentation is deleted
4. To determine the next ID, find the highest existing ID and increment

## Update Rules

The index must be updated in these scenarios:

| Event | Action |
|-------|--------|
| `/asdm-presentation-planning` completes | Add new row with status `PLANNED`, Output File `-` |
| `/asdm-presentation-create` completes | Update row: status → `CREATED`, fill Output File path |
| Plan is modified/re-planned | Update row: status → `UPDATED`, update Updated date |
| Summary counts must be recalculated on every update |

## Example

```markdown
# Presentations Index

**Created Date**: 2026-05-05
**Last Updated**: 2026-05-05

## Summary

| | Total | Planned | Created | Updated |
|---|-------|---------|---------|---------|
| | 3 | 1 | 2 | 0 |

## Presentation Registry

| | ID | Name | Status | Theme | Slides | Plan File | Output File | Created | Updated |
|---|----|------|--------|-------|--------|-----------|-------------|---------|---------|
| | PRES-001 | AI在医疗领域的应用 | CREATED | Professional | 12 | PRES-001/presentation-plan.md | PRES-001/PRES-001.pptx | 2026-05-05 | 2026-05-05 |
| | PRES-002 | 项目季度汇报 | CREATED | Corporate | 15 | PRES-002/presentation-plan.md | PRES-002/PRES-002.pptx | 2026-05-05 | 2026-05-05 |
| | PRES-003 | 新功能介绍 | PLANNED | Technical | 10 | PRES-003/presentation-plan.md | - | 2026-05-05 | 2026-05-05 |
```
