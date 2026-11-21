---
name: stylebook
description: Use when a user wants to adopt a Stylebook UI style or component in another project, or provides a Stylebook preview URL, copied reference, or style identifier.
---

# Stylebook

Use the user's request to decide where and how to apply Stylebook. A copied Stylebook reference identifies a style or component and its source. The requested change comes from the user's surrounding instructions. If they only share a reference, identify what it points to and ask what they want to do with it.

## Resolve the reference

- A Stylebook URL encodes `theme` and, for a component, `component` in its hash. A copied reference uses `类型` for the object kind and `标识` for its ID. In a component reference, use `预览风格` or the preview URL to resolve the accompanying theme.
- Match a theme against the [current theme definitions](https://github.com/Peiiii/stylebook/blob/main/src/library/themes.ts). Use the exact ID. If an explicit ID is missing or retired, report that to the user. A preview may render its default theme for an unknown ID.
- Use the [source repository](https://github.com/Peiiii/stylebook) to retrieve the relevant files. When copying code, resolve them at one revision and record that revision for follow-up.

## Apply the requested scope

For a whole page or theme, read the [adoption guide](https://github.com/Peiiii/stylebook/blob/main/docs/adopt-stylebook.md) and the theme's `adoption` entry in the theme definitions. Start from the recommended template when its structure matches the requested page. Preserve the relevant layout hierarchy, component relationships and interaction states. Use the spacing, typography, and avoid notes when adapting the design.

For a multi-theme app, follow the adoption guide’s multi-theme example. Expose the user’s selected allowlist and default, save preference under an app-specific key, and apply the theme at the root shared by regular and portaled content. Verify refresh and mobile or portaled components in each relevant theme.

| Requested scope  | What to use                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Visual reference | Use the selected preview or supplied screenshot as evidence. Trace visual decisions to the selected theme when source is available. Adapt them to the destination's existing components and styling system.                                                                                                                                                                                                                                                                                                                                                                  |
| A theme          | In [themes.css](https://github.com/Peiiii/stylebook/blob/main/src/library/themes.css), find the selected `[data-atlas-theme="<id>"]` rules and their shared variables and scoped styles. Check [theme.css](https://github.com/Peiiii/stylebook/blob/main/src/library/theme.css) for base token definitions and Tailwind mappings. Translate the tokens into the destination project's design system. If reusing scoped CSS, check the theme attribute, component `data-slot` values and where popovers or dialogs mount so the theme reaches them.                           |
| A component      | Look up the exact component ID in [registry.json](https://github.com/Peiiii/stylebook/blob/main/src/library/registry.json). Reuse a compatible local primitive where possible. Otherwise, read the component source and follow its relevant imports, using registry paths relative to `src/library/`. Treat example files as usage references. Check [package.json](https://github.com/Peiiii/stylebook/blob/main/package.json) for the source dependencies and [the UI license](https://github.com/Peiiii/stylebook/blob/main/src/library/ui/LICENSE.md) when copying code. |

Use the destination project's existing conventions and restrict changes to the surface the user named. Stylebook's source uses React and Tailwind CSS v4. In a different stack, translate the relevant tokens and interaction states into local equivalents. For a single component, bring over only the CSS and dependencies it actually uses.

Verify the result in the destination app. For themes, compare typography, spacing, surfaces, shape and selected states in addition to color. For interactive components, check the relevant keyboard, focus and disabled states, including portaled content if present. Summarize where the reference was applied and the source files used.
