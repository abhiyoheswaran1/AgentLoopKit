# Verification Report

- Timestamp: `2026-06-16T21:22:42.449Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `370a9fe`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-16-sort-maintainer-check-review-area-counts-2.md`
- Title: `Sort maintainer-check review area counts`
- Task type: `feature`
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
      Tests  706 passed (706)
   Start at  23:22:43
   Duration  77.86s (transform 2.50s, setup 0ms, import 10.10s, tests 806.05s, environment 7ms)

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
ESM dist/cli/index.js     467.71 KB
ESM dist/cli/index.js.map 876.55 KB
ESM ⚡️ Build success in 28ms
DTS Build start
DTS ⚡️ Build success in 897ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm test -- tests/maintainer-check.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run tests/maintainer-check.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  12 passed (12)
   Start at  23:24:10
   Duration  6.18s (transform 65ms, setup 0ms, import 125ms, tests 5.94s, environment 0ms)

```

### task: `npm run typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 typecheck
> tsc --noEmit

```

### task: `npm run lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 lint
> eslint .

```

### task: `npm test`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run


 RUN  v4.1.8 [git-root]


 Test Files  63 passed (63)
      Tests  706 passed (706)
   Start at  23:24:21
   Duration  78.01s (transform 2.14s, setup 0ms, import 9.78s, tests 795.84s, environment 9ms)

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
ESM dist/cli/index.js     467.71 KB
ESM dist/cli/index.js.map 876.55 KB
ESM ⚡️ Build success in 28ms
DTS Build start
DTS ⚡️ Build success in 919ms
DTS dist/cli/index.d.ts 13.00 B
```

## Post-Verification Gates
### post-verification: `npx --no-install tsx src/cli/index.ts maintainer-check --redact-paths`

- Exit code: 0
- Status: pass


```text
# AgentLoopKit Maintainer Check

Status: `warn`

- [`pass`] `task-contract`: `Task contract found: Sort maintainer-check review area counts` (`.agentloop/tasks/2026-06-16-sort-maintainer-check-review-area-counts-2.md`)
- [`pass`] `verification-evidence`: `Overall status: pass` (`.agentloop/reports/2026-06-16-23-22-verification-report.md`)
- [`pass`] `handoff-summary`: `Reviewer handoff found.` (`.agentloop/handoffs/2026-06-16-23-16-pr-summary-3.md`)
- [`pass`] `github-metadata`: `No imported GitHub metadata found; optional context not provided.`
- [`warn`] `changed-file-count`: `714 changed file(s) detected (62 non-evidence file(s), 652 AgentLoop evidence file(s)). Non-evidence review areas: Documentation 24, Source 16, Tests 16, CI / Automation 4, AgentLoop 2.`
- [`pass`] `dependency-lockfiles`: `No dependency or lockfile changes detected.`
- [`pass`] `migrations`: `No migration files changed.`
- [`pass`] `auth-security-files`: `No auth/security-sensitive files changed.`
- [`pass`] `generated-files`: `No generated output files changed.`

## Maintainer Checklist

- [ ] Confirm the task contract matches the pull request scope.
- [ ] Confirm verification evidence is fresh and relevant.
- [ ] Review changed files for ownership and blast radius.
- [ ] Confirm rollback notes are practical.

## Suggested Contributor Request

Please address the AgentLoopKit maintainer warnings or explain why they are acceptable.

```

### post-verification: `npm run dogfood:strict`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 dogfood:strict
> node scripts/dogfood.mjs --strict

# AgentLoopKit Dogfood Gate
Mode: strict

## task folder hygiene
$ npx --no-install tsx src/cli/index.ts task doctor
# AgentLoopKit Task Doctor

Status: `pass`
Checked: `25`
Diagnostics: `0`

No task folder hygiene issues found.

## current loop status
$ npx --no-install tsx src/cli/index.ts status --brief --redact-paths
AgentLoopKit: task="Sort maintainer-check review area counts" status="in-progress"; verification=pass; run="handoff 706 files"; tree=dirty (714); next="agentloop task done"
Reason: Task, verification, and handoff evidence cover the current dirty files. Mark the task done when the handoff is ready, or keep it open if work is still in progress.

## public docs hygiene
$ node scripts/public-docs-hygiene.mjs
# AgentLoopKit Public Docs Hygiene
Version: 0.35.2
Public docs checked: 73
Repo harness files checked: 2
Public docs hygiene passed.

## dependency audit
$ npx --yes pnpm@10.12.1 audit --audit-level high
No known vulnerabilities found

## harness upgrade audit
$ npx --no-install tsx src/cli/index.ts upgrade-harness --redact-paths
# AgentLoopKit Harness Upgrade

- Overall status: `pass`
- Dry run: `no`
- Writes files: `no`
- Target: `[agentloop-root]`

## Manifest

- `current`: `.agentloop/manifest.json`
- Current template version: `1`
- Local template version: `1`

## Harness Files

- `current`: `AGENTS.md`
  Present topics: `ship`, `prepare-pr`, `run-ledger`, `maintainer-check`, `review-context`, `upgrade-safety`
  Missing topics: none
- `current`: `AGENTLOOP.md`
  Present topics: `ship`, `prepare-pr`, `run-ledger`, `maintainer-check`, `review-context`, `upgrade-safety`
  Missing topics: none
- `current`: `.agentloop/harness/commands.md`
  Present topics: `ship`, `prepare-pr`, `run-ledger`, `maintainer-check`, `review-context`, `upgrade-safety`
  Missing topics: none
- `current`: `.agentloop/README.md`
  Present topics: `ship`, `prepare-pr`, `run-ledger`, `maintainer-check`, `review-context`, `upgrade-safety`
  Missing topics: none

## Next Steps

- Run `agentloop upgrade-harness` after updating the CLI to inspect existing harness guidance.
- Harness guidance already mentions the current review-readiness loop.

## Safety

This command reads local AgentLoopKit harness files only. It does not overwrite guidance, merge templates, run verification commands, read .env contents, call external APIs, or upload files.

## review evidence gates
$ npx --no-install tsx src/cli

[output truncated: showing first 2500 and last 2500 characters of 8922 total]

n why they are acceptable.


## agent review context
$ npx --no-install tsx src/cli/index.ts review-context --redact-paths
# AgentLoopKit Review Context

- Active task: `Sort maintainer-check review area counts` (`in-progress`) - `.agentloop/tasks/2026-06-16-sort-maintainer-check-review-area-counts-2.md`
- Latest verification: `pass` - `.agentloop/reports/2026-06-16-23-22-verification-report.md`
- Gates: `pass`
- Policy status: `8` current, `0` modified, `0` missing, `0` extra
- Artifacts: `3` task(s), `28` AgentFlight placeholder task(s), `442` verification report(s), `648` handoff(s)
- Latest ship score: `92`/100 - `.agentloop/reports/2026-06-16-23-15-ship-report.md`
- GitHub metadata: missing - `.agentloop/github/context.json`
- Working tree: `dirty (714)`

## Recent Runs

- `handoff` `706` changed file(s) - `2026-06-16-23-16-handoff-3`
- `handoff` `701` changed file(s) - `2026-06-16-23-16-handoff-2`
- `handoff` `695` changed file(s) - `2026-06-16-23-16-handoff`

## Next Action

Run `agentloop task done`.

Task, verification, and handoff evidence cover the current dirty files. Mark the task done when the handoff is ready, or keep it open if work is still in progress.

## Safety

This snapshot is read-only. It does not run commands, write files, include full Markdown artifact bodies, read `.env` contents, or call external APIs.


## agentflight session health
$ npx --yes agentflight doctor
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

## projscan project health
$ npx --yes projscan --format markdown doctor
# Project Health Report

**Health Score: A (100/100)**

[![projscan health](https://img.shields.io/badge/projscan-A-brightgreen)](https://github.com/abhiyoheswaran1/projscan)

No issues detected. Project looks healthy!

Dogfood gate passed.
```


## Not Run
- Nothing skipped.

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
