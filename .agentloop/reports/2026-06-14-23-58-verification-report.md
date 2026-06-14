# Verification Report

- Timestamp: `2026-06-14T21:58:10.671Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `c0bb55c`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-14-harden-oss-roadmap-release-proof-and-public-docs.md`
- Title: `Harden OSS roadmap release proof and public docs`
- Task type: `feature`
- Status: `in-progress`





## Commands Run
### task: `npm run test:unit`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.32.1 test:unit
> vitest run tests/config.test.ts tests/slug.test.ts tests/template-renderer.test.ts tests/markdown-format.test.ts tests/package-manager.test.ts tests/project-detection.test.ts tests/schema.test.ts tests/schemastore.test.ts tests/policy-packs.test.ts tests/github-metadata.test.ts tests/release-proof.test.ts tests/public-docs-hygiene.test.ts tests/roadmap-channels.test.ts tests/cli-docs-drift.test.ts tests/safety.test.ts tests/version.test.ts tests/package-metadata.test.ts tests/package-scripts.test.ts tests/post-verification-gates.test.ts tests/task-contract.test.ts


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  20 passed (20)
      Tests  81 passed (81)
   Start at  23:58:14
   Duration  20.58s (transform 167ms, setup 0ms, import 579ms, tests 45.46s, environment 1ms)

```

### task: `npm run test:integration`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.32.1 test:integration
> vitest run tests/doctor.test.ts tests/upgrade-harness.test.ts tests/init.test.ts tests/create-task.test.ts tests/verification.test.ts tests/ship.test.ts tests/prepare-pr.test.ts tests/maintainer-check.test.ts tests/release-check.test.ts tests/dogfood-script.test.ts tests/release-smoke.test.ts tests/published-smoke-script.test.ts tests/mcp-server.test.ts


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  13 passed (13)
      Tests  178 passed (178)
   Start at  23:58:39
   Duration  137.23s (transform 245ms, setup 0ms, import 962ms, tests 712.51s, environment 1ms)

```

### task: `npm run check:public-docs`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.32.1 check:public-docs
> node scripts/public-docs-hygiene.mjs

# AgentLoopKit Public Docs Hygiene
Version: 0.32.1
Public docs checked: 72
Repo harness files checked: 2
Public docs hygiene passed.
```

### task: `npm run check:links`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.32.1 check:links
> tsx scripts/check-markdown-links.ts

Markdown links OK (1863 file(s) checked).
```

### task: `npm run build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.32.1 build
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
ESM ⚡️ Build success in 34ms
DTS Build start
DTS ⚡️ Build success in 979ms
DTS dist/cli/index.d.ts 13.00 B
```

## Not Run
- test
- lint
- typecheck
- build

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
