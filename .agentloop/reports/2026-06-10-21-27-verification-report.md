# Verification Report

- Timestamp: 2026-06-10T19:27:53.466Z
- Repo: AgentLoopKit
- Git branch: main
- Git commit: 5c8399d
- Working tree: dirty
- Overall status: pass


## Task Context
- Path: .agentloop/tasks/2026-06-10-prepare-v0-27-0-task-doctor-release.md
- Title: Prepare v0.27.0 task doctor release
- Task type: release
- Status: in-progress



## Commands Run
### test: `npx pnpm@10.12.1 test`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.27.0 test /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> vitest run


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  33 passed (33)
      Tests  154 passed (154)
   Start at  21:27:54
   Duration  12.89s (transform 1.34s, setup 0ms, import 5.83s, tests 97.96s, environment 5ms)

```

### lint: `npx pnpm@10.12.1 lint`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.27.0 lint /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> eslint .

```

### typecheck: `npx pnpm@10.12.1 typecheck`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.27.0 typecheck /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> tsc --noEmit

```

### build: `npx pnpm@10.12.1 build`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.27.0 build /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: /Users/abhyoh/local dev folder/Apps/AgentLoopKit/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     158.85 KB
ESM dist/cli/index.js.map 301.07 KB
ESM ⚡️ Build success in 20ms
DTS Build start
DTS ⚡️ Build success in 676ms
DTS dist/cli/index.d.ts 13.00 B
```

### custom: `node scripts/prepublish-check.mjs`

- Exit code: 0
- Status: pass

```text
Prepublish metadata check passed.
```

### custom: `npx pnpm@10.12.1 check:links`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.27.0 check:links /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> tsx scripts/check-markdown-links.ts

Markdown links OK (639 file(s) checked).
```

### custom: `npx --yes projscan doctor --format markdown`

- Exit code: 0
- Status: pass

```text
# Project Health Report

**Health Score: A (97/100)**

[![projscan health](https://img.shields.io/badge/projscan-A-brightgreen)](https://github.com/abhiyoheswaran1/projscan)

Found **1** issue(s).

- ℹ️ **Unused exports in scripts/smoke-packed-release.mjs** - 4 named exports (assertReadmePins, createSmokeSteps, runReleaseSmoke, isDirectRun) but nothing in the project imports this file. Dead code or awaiting wiring?
```

### custom: `npm run smoke:release`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.27.0 smoke:release
> node scripts/smoke-packed-release.mjs

Release smoke for agentloopkit@0.27.0
Packed /var/folders/tc/vn86wd6d7v70rn_pxbv3h2k40000gn/T/agentloopkit-release-smoke-lI1pVn/pack/agentloopkit-0.27.0.tgz
README pins match package version.
Packed binary version smoke passed.
Packed init smoke passed.
Packed local-only init smoke passed.
Packed create-task path guard smoke passed.
Packed verify task path guard smoke passed.
Packed home-directory dry-run guard smoke passed.
Release smoke passed.
```

### custom: `npm publish --access public --dry-run`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.27.0 prepublishOnly
> node scripts/prepublish-check.mjs && npm run typecheck && npm test && npm run build

Prepublish metadata check passed.

> agentloopkit@0.27.0 typecheck
> tsc --noEmit


> agentloopkit@0.27.0 test
> vitest run


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  33 passed (33)
      Tests  154 passed (154)
   Start at  21:28:28
   Duration  13.09s (transform 1.01s, setup 0ms, import 5.85s, tests 100.05s, environment 3ms)


> agentloopkit@0.27.0 build
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: /Users/abhyoh/local dev folder/Apps/AgentLoopKit/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     158.85 KB
ESM dist/cli/index.js.map 301.07 KB
ESM ⚡️ Build success in 20ms
DTS Build start
DTS ⚡️ Build success in 693ms
DTS dist/cli/index.d.ts 13.00 B
npm notice
npm notice 📦  agentloopkit@0.27.0
npm notice Tarball Contents
npm notice 1.1kB LICENSE
npm notice 25.9kB README.md
npm notice 13B dist/cli/index.d.ts
npm notice 162.7kB dist/cli/index.js
npm notice 308.3kB dist/cli/index.js.map
npm notice 3.3kB dist/schema/agentloop.config.schema.json
npm notice 1.1kB dist/templates/agents/claude-code.md
npm notice 1.2kB dist/templates/agents/codex.md
npm notice 1.0kB dist/templates/agents/cursor.md
npm notice 1.1kB dist/templates/agents/gemini-cli.md
npm notice 956B dist/templates/agents/generic.md
npm notice 1.0kB dist/templates/agents/github-copilot-cli.md
npm notice 1.0kB dist/templates/agents/opencode.md
npm notice 457B dist/templates/gates/dependency-gate.md
npm notice 472B dist/templates/gates/docs-gate.md
npm notice 621B dist/templates/gates/implementation-gate.md
npm notice 440B dist/templates/gates/regression-gate.md
npm notice 470B dist/templates/gates/review-gate.md
npm notice 502B dist/templates/gates/security-gate.md
npm notice 513B dist/templates/gates/test-gate.md
npm notice 120B dist/templates/handoffs/decision-log.md
npm notice 387B dist/templates/handoffs/pr-summary.md
npm notice 133B dist/templates/handoffs/release-notes.md
npm notice 155B dist/templates/handoffs/reviewer-brief.md
npm notice 94B dist/templates/handoffs/rollback-plan.md
npm notice 135B dist/templates/handoffs/verification-report.md
npm notice 614B dist/templates/harness/autonomous-work-rules.md
npm notice 4.4kB dist/templates/harness/commands.md
npm notice 446B dist/templates/harness/definition-of-done.md
npm notice 260B dist/templates/harness/release-checklist.md
npm notice 493B dist/templates/harness/repo-map.md
npm notice 375B dist/templates/harness/review-checklist.md
npm notice 333B dist/templates/harness/working-agreement.md
npm notice 720B dist/templates/loops/bugfix.md
npm notice 646B dist/templates/loops/dependency-upgrade.md
npm notice 648B dist/templates/loops/docs.md
npm notice 865B dist/templates/loops/feature.md
npm notice 674B dist/templates/loops/migration.md
npm notice 748B dist/templates/loops/refactor.md
npm notice 620B dist/templates/loops/release.md
npm notice 688B dist/templates/loops/security-review.md
npm notice 668B dist/templates/loops/test-generation.md
npm notice 308B dist/templates/policies/database-change-policy.md
npm notice 315B dist/templates/policies/dependency-change-policy.md
npm notice 243B dist/templates/policies/git-policy.md
npm notice 478B dist/templates/policies/no-destructive-actions.md
npm notice 325B dist/templates/policies/public-api-change-policy.md
npm notice 275B dist/templates/policies/secrets-policy.md
npm notice 314B dist/templates/policies/security-policy.md
npm notice 255B dist/templates/policies/ui-change-policy.md
npm notice 4.8kB dist/templates/root/agentloop-directory-readme.md
npm notice 917B dist/templates/root/agentloop.config.json
npm notice 3.8kB dist/templates/root/AGENTLOOP.md
npm notice 4.9kB dist/templates/root/AGENTS.md
npm notice 2.1kB dist/templates/tasks/README.md
npm notice 1.9kB package.json
npm notice 3.3kB schema/agentloop.config.schema.json
npm notice 563B server.json
npm notice Tarball Details
npm notice name: agentloopkit
npm notice version: 0.27.0
npm notice filename: agentloopkit-0.27.0.tgz
npm notice package size: 125.2 kB
npm notice unpacked size: 551.2 kB
npm notice shasum: a116b957c2ef35a1d26e50344a78be65fe595e6c
npm notice integrity: sha512-yrSKzDKOgns75[...]U0xZpnmrIDMZg==
npm notice total files: 58
npm notice
npm notice Publishing to https://registry.npmjs.org/ with tag latest and public access (dry-run)
+ agentloopkit@0.27.0
```

## Not Run
- Nothing skipped.

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
