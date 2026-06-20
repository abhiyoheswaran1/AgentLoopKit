# Verification Report

- Timestamp: `2026-06-20T06:43:19.424Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `8d1ebb76`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-20-make-doctor-pre-init-safe-for-copy-paste-trials.md`
- Title: `Make doctor pre-init safe for copy-paste trials`
- Task type: `feature`
- Status: `in-progress`





## Commands Run
### task: `npx pnpm@10.12.1 vitest run tests/doctor.test.ts`

- Exit code: 0
- Status: pass


```text

 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  19 passed (19)
   Start at  08:43:24
   Duration  65.38s (transform 91ms, setup 0ms, import 160ms, tests 64.65s, environment 0ms)

```

### task: `npm run test:quick`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.36.2 test:quick
> npm run test:unit


> agentloopkit@0.36.2 test:unit
> vitest run tests/config.test.ts tests/slug.test.ts tests/template-renderer.test.ts tests/markdown-format.test.ts tests/package-manager.test.ts tests/project-detection.test.ts tests/schema.test.ts tests/schemastore.test.ts tests/policy-packs.test.ts tests/github-metadata.test.ts tests/github-action-runner.test.ts tests/release-proof.test.ts tests/public-docs-hygiene.test.ts tests/roadmap-channels.test.ts tests/autonomous-dogfood.test.ts tests/dogfood-start-script.test.ts tests/maintenance-check-script.test.ts tests/cli-docs-drift.test.ts tests/safety.test.ts tests/version.test.ts tests/package-metadata.test.ts tests/package-scripts.test.ts tests/post-verification-gates.test.ts tests/task-contract.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  24 passed (24)
      Tests  150 passed (150)
   Start at  08:44:34
   Duration  57.52s (transform 209ms, setup 0ms, import 677ms, tests 145.05s, environment 1ms)

```

### task: `npm run typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.36.2 typecheck
> tsc --noEmit

```

### task: `npm run lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.36.2 lint
> eslint .

```

### task: `npm run build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.36.2 build
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: [git-root]/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     495.84 KB
ESM dist/cli/index.js.map 929.71 KB
ESM ⚡️ Build success in 30ms
DTS Build start
DTS ⚡️ Build success in 959ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm run check:public-docs`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.36.2 check:public-docs
> node scripts/public-docs-hygiene.mjs

# AgentLoopKit Public Docs Hygiene
Version: 0.36.2
Public docs checked: 74
Repo harness files checked: 2
Public docs hygiene passed.
```

### task: `npm run check:links`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.36.2 check:links
> tsx scripts/check-markdown-links.ts

Markdown links OK (4456 file(s) checked).
```

### task: `npx --yes projscan doctor --format markdown`

- Exit code: 0
- Status: pass


```text
# Project Health Report

**Health Score: A (90/100)**

[![projscan health](https:[git-root]

Found **1** issue(s).

- ⚠️ **Install lifecycle script present: prepublishOnly** - The package manifest defines "prepublishOnly": "node scripts/prepublish-check.mjs && npm run typecheck && npm test && npm run build". Install lifecycle scripts execute during dependency installation and are a common supply-chain execution path; verify this script before release or install.
```

### task: `npx --yes agentflight doctor`

- Exit code: 0
- Status: pass


```text
AgentFlight Doctor

Overall: OK

- OK Node.js version: v26.3.0 satisfies AgentFlight's Node.js 20+ target.
- OK npm availability: npm 11.16.0 is available.
- OK git availability: git is available.
- OK repository root: [git-root]
- OK package manager: pnpm
- OK .agentflight presence: .agentflight exists.
- OK config validity: .agentflight/config.json is valid.
- OK .agentflight writable: .agentflight is writable.
- OK current session: A current session exists.
- OK ProjScan availability: ProjScan is available.
- OK AgentLoopKit availability: AgentLoopKit is available.
- OK test script: npm run test is configured.
- OK build script: npm run build is configured.
- OK typecheck script: npm run typecheck is configured.
- OK lint script: npm run lint is configured.
```


## Not Run
- test
- lint
- typecheck
- build

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
