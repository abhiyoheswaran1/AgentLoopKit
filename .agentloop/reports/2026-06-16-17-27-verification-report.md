# Verification Report

- Timestamp: `2026-06-16T15:27:31.390Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `5c4abf5`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-16-publish-github-marketplace-action.md`
- Title: `Publish GitHub Marketplace Action`
- Task type: `release`
- Status: `in-progress`





## Commands Run
### test: `npx pnpm@10.12.1 test`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test [git-root]
> vitest run


 RUN  v4.1.8 [git-root]


 Test Files  63 passed (63)
      Tests  653 passed (653)
   Start at  17:27:33
   Duration  137.50s (transform 870ms, setup 0ms, import 3.99s, tests 1436.10s, environment 5ms)

```

### lint: `npx pnpm@10.12.1 lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 lint [git-root]
> eslint .

```

### typecheck: `npx pnpm@10.12.1 typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 typecheck [git-root]
> tsc --noEmit

```

### build: `npx pnpm@10.12.1 build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 build [git-root]
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: [git-root]/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     445.88 KB
ESM dist/cli/index.js.map 838.10 KB
ESM ⚡️ Build success in 36ms
DTS Build start
DTS ⚡️ Build success in 1099ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm run check:public-docs`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 check:public-docs
> node scripts/public-docs-hygiene.mjs

# AgentLoopKit Public Docs Hygiene
Version: 0.35.2
Public docs checked: 73
Repo harness files checked: 2
Public docs hygiene passed.
```

### task: `npm run check:links`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 check:links
> tsx scripts/check-markdown-links.ts

Markdown links OK (2653 file(s) checked).
```

### task: `npm run test:quick`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test:quick
> npm run test:unit


> agentloopkit@0.35.2 test:unit
> vitest run tests/config.test.ts tests/slug.test.ts tests/template-renderer.test.ts tests/markdown-format.test.ts tests/package-manager.test.ts tests/project-detection.test.ts tests/schema.test.ts tests/schemastore.test.ts tests/policy-packs.test.ts tests/github-metadata.test.ts tests/github-action-runner.test.ts tests/release-proof.test.ts tests/public-docs-hygiene.test.ts tests/roadmap-channels.test.ts tests/autonomous-dogfood.test.ts tests/dogfood-start-script.test.ts tests/maintenance-check-script.test.ts tests/cli-docs-drift.test.ts tests/safety.test.ts tests/version.test.ts tests/package-metadata.test.ts tests/package-scripts.test.ts tests/post-verification-gates.test.ts tests/task-contract.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  24 passed (24)
      Tests  116 passed (116)
   Start at  17:30:05
   Duration  19.17s (transform 381ms, setup 0ms, import 1.04s, tests 32.68s, environment 2ms)

```

### task: `npm run build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 build
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: [git-root]/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     445.88 KB
ESM dist/cli/index.js.map 838.10 KB
ESM ⚡️ Build success in 30ms
DTS Build start
DTS ⚡️ Build success in 1113ms
DTS dist/cli/index.d.ts 13.00 B
```


## Not Run
- Nothing skipped.

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
