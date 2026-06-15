# Verification Report

- Timestamp: `2026-06-15T13:59:45.562Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `366aeda`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-15-harden-agentloopkit-autonomous-dogfood-harness.md`
- Title: `Harden AgentLoopKit autonomous dogfood harness`
- Task type: `feature`
- Status: `proposed`





## Commands Run
### test: `npx pnpm@10.12.1 test`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 test /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> vitest run


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  61 passed (61)
      Tests  561 passed (561)
   Start at  15:59:51
   Duration  284.90s (transform 511ms, setup 0ms, import 2.87s, tests 2954.87s, environment 3ms)

```

### lint: `npx pnpm@10.12.1 lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 lint /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> eslint .

```

### typecheck: `npx pnpm@10.12.1 typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 typecheck /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> tsc --noEmit

```

### build: `npx pnpm@10.12.1 build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 build /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: /Users/abhyoh/local dev folder/Apps/AgentLoopKit/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     402.23 KB
ESM dist/cli/index.js.map 764.51 KB
ESM ⚡️ Build success in 30ms
DTS Build start
DTS ⚡️ Build success in 924ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm run test:unit`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 test:unit
> vitest run tests/config.test.ts tests/slug.test.ts tests/template-renderer.test.ts tests/markdown-format.test.ts tests/package-manager.test.ts tests/project-detection.test.ts tests/schema.test.ts tests/schemastore.test.ts tests/policy-packs.test.ts tests/github-metadata.test.ts tests/release-proof.test.ts tests/public-docs-hygiene.test.ts tests/roadmap-channels.test.ts tests/autonomous-dogfood.test.ts tests/cli-docs-drift.test.ts tests/safety.test.ts tests/version.test.ts tests/package-metadata.test.ts tests/package-scripts.test.ts tests/post-verification-gates.test.ts tests/task-contract.test.ts


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  21 passed (21)
      Tests  84 passed (84)
   Start at  16:05:03
   Duration  21.03s (transform 137ms, setup 0ms, import 532ms, tests 41.28s, environment 1ms)

```

### task: `npm run check:public-docs`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 check:public-docs
> node scripts/public-docs-hygiene.mjs

# AgentLoopKit Public Docs Hygiene
Version: 0.33.0
Public docs checked: 73
Repo harness files checked: 2
Public docs hygiene passed.
```

### task: `npm run check:links`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 check:links
> tsx scripts/check-markdown-links.ts

Markdown links OK (1878 file(s) checked).
```

### task: `npm run build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 build
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: /Users/abhyoh/local dev folder/Apps/AgentLoopKit/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     402.23 KB
ESM dist/cli/index.js.map 764.51 KB
ESM ⚡️ Build success in 28ms
DTS Build start
DTS ⚡️ Build success in 933ms
DTS dist/cli/index.d.ts 13.00 B
```

## Not Run
- Nothing skipped.

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
