# Verification Report

- Timestamp: `2026-06-24T15:02:09.038Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `637b843c`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-24-prove-agentloop-start-usefulness-2.md`
- Title: `Prove AgentLoop Start usefulness`
- Task type: `feature`
- Status: `in-progress`





## Commands Run
### task: `npm run test:unit -- tests/agent-start.test.ts tests/context-contract.test.ts tests/doctor.test.ts tests/upgrade-harness.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.42.0 test:unit
> vitest run tests/config.test.ts tests/slug.test.ts tests/template-renderer.test.ts tests/markdown-format.test.ts tests/package-manager.test.ts tests/project-detection.test.ts tests/schema.test.ts tests/schemastore.test.ts tests/policy-packs.test.ts tests/github-metadata.test.ts tests/github-action-runner.test.ts tests/release-proof.test.ts tests/readiness-score.test.ts tests/public-docs-hygiene.test.ts tests/product-positioning.test.ts tests/roadmap-channels.test.ts tests/autonomous-dogfood.test.ts tests/dogfood-start-script.test.ts tests/maintenance-check-script.test.ts tests/cli-docs-drift.test.ts tests/safety.test.ts tests/version.test.ts tests/package-metadata.test.ts tests/package-scripts.test.ts tests/post-verification-gates.test.ts tests/task-contract.test.ts tests/agent-start.test.ts tests/context-contract.test.ts tests/doctor.test.ts tests/upgrade-harness.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  30 passed (30)
      Tests  207 passed (207)
   Start at  17:02:11
   Duration  55.23s (transform 776ms, setup 0ms, import 2.08s, tests 197.00s, environment 3ms)

```

### task: `npm run check:public-docs`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.42.0 check:public-docs
> node scripts/public-docs-hygiene.mjs

# AgentLoopKit Public Docs Hygiene
Version: 0.42.0
Public docs checked: 79
Repo harness files checked: 2
Public docs hygiene passed.
```

### task: `npm run build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.42.0 build
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: [git-root]
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     597.92 KB
ESM dist/cli/index.js.map 1.10 MB
ESM ⚡️ Build success in 69ms
DTS Build start
DTS ⚡️ Build success in 2220ms
DTS dist/cli/index.d.ts 13.00 B
```


## Not Run
- test: `npx pnpm@10.12.1 test`
- lint: `npx pnpm@10.12.1 lint`
- typecheck: `npx pnpm@10.12.1 typecheck`
- build: `npx pnpm@10.12.1 build`

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
