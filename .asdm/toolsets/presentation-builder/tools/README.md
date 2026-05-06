# Presentation Builder Tools

This directory contains tool scripts for the Presentation Builder toolset.

## Overview

The Presentation Builder relies on the `pptx` skill for `.pptx` file generation. This skill is provided by the runtime environment and is not bundled within the toolset itself.

## Skill Dependency

| Skill | Purpose | Invocation |
|-------|---------|------------|
| `pptx` | Create, modify, and save .pptx presentation files | Automatically invoked by `asdm-presentation-create` action |

## How It Works

When the `asdm-presentation-create` action is executed:

1. The action loads the `pptx` skill using the `use_skill` tool
2. The skill provides capabilities for creating slides, inserting content, and saving `.pptx` files
3. The action follows the presentation plan to create each slide with the appropriate layout
4. The final `.pptx` file is saved to `.asdm/workspace/presentations/<presentation-id>/`

## Extending with Custom Tools

If you need to add custom tooling (e.g., batch conversion, custom rendering), create a script in this directory and reference it from the relevant action file.

### Adding a New Tool

1. Create your script file in this directory (e.g., `presentation-batch-generator.js`)
2. Document the script's purpose, parameters, and usage in this README
3. Reference the script from the appropriate action file in `../actions/`

## Current Tools

*No custom tool scripts are currently included. The toolset relies entirely on the `pptx` skill for file generation.*
