---
name: ushell-frontend-development
description: Implementation-specific entry skill for UShell.ReactFrontend (the U-Shell runtime/harness). Use before changing code, build or docs in this repository. Contains only implementation details (project layout, key files, build, versioning, local rules). All U-Shell design knowledge and requirements live in the root skills of ProjectUShell/UShell.Docs, which must always be loaded as well.
---

# UShell.ReactFrontend - implementation details

> **This skill covers implementation details only.** The U-Shell target state, layer
> requirements, compatibility rules and backlog live in **UShell.Docs** (root level of the
> U-Shell skill set). Always load them first:
>
> - `ushell-architecture` (mandatory root entry)
> - `ushell-shell-runtime` (requirements for this layer, consolidated status)
> - plus the domain skills the task touches: `ushell-interaction-dynamics`, `ushell-declarative-model`, `ushell-widget-contract`, `ushell-data-auth-scope`, `ushell-server-commands`, `ushell-host-api`
>
> Location: sibling checkout `../UShell.Docs/.agents/skills/<name>/SKILL.md`, otherwise
> https://github.com/ProjectUShell/UShell.Docs/tree/master/.agents/skills
>
> Design knowledge discovered while working here goes into those skills, not into this file.

## Repository layout

- `ushell-ts/` - **productive** shell (React, TypeScript, Tailwind, webpack module federation). Build: `npm run build`, dev: `npm start`.
- `ushell/` - older JavaScript generation. Do not extend.
- `vers/` - KVU versioning (`versioninfo.json`, `changelog.md`). **Never edit `vers/changelog.md`.**

## Key files (`ushell-ts/src`)

| Area | Files |
|---|---|
| Bootstrap, global exposure (`globalWorkspaceManager`, `setAppScope`), `headless` mode | `App.tsx` |
| Portfolio/module loading, ApplicationScope runtime | `portfolio-handling/PortfolioLoader.ts`, `PortfolioManager.ts` |
| Menus | `portfolio-handling/MenuBuilder.tsx`, `PortfolioBasedMenuService.tsx` |
| `mapDynamic` resolution | `portfolio-handling/ArgumentMapper.ts` |
| WidgetHost implementation | `portfolio-handling/WidgetHost.ts` |
| Use-case lifecycle, command execution, persistence, widget rendering | `workspace-handling/WorkspaceManager.tsx` |
| Use-case toolbar | `workspace-handling/_Organisms/CommandBar.tsx` |
| Tokens and login | `authentication/TokenService.ts`, `authentication/Components/*` |
| Datastores/datasources | `datasource-handling/DatasourceManager.ts` |
| Remote widgets | `federation/*` |

## Local rules

- Consumed contracts: `ushell-portfoliodescription`, `ushell-modulebase`, `ushell-common-components`. A new descriptive attribute or widget capability is added **there first**, then consumed here.
- Every change stays backwards compatible with existing portfolios, modules, remote widgets, globals exposed on `globalThis` and persisted `localStorage` state (see `ushell-architecture` §6).
- Reusable UI goes to CommonComponents, not here.
- When touching `WorkspaceManager.tsx`, prefer extracting the touched responsibility (command pipeline, instance management) over growing the file.
- Reference backlog IDs (`UB-xx` from `UShell.Docs/doc/backlog.md`) in commit messages and PR descriptions.
