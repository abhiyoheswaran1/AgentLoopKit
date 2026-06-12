# Verification Report

- Timestamp: `2026-06-12T19:42:23.133Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `5051d48`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-12-release-agentloopkit-0-28-5-patch.md`
- Title: `Release AgentLoopKit 0.28.5 patch`
- Task type: `release`
- Status: `proposed`





## Commands Run
### task: `npm run lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.5 lint
> eslint .

```

### task: `npm run typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.5 typecheck
> tsc --noEmit

```

### task: `npm test`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.5 test
> vitest run


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  51 passed (51)
      Tests  455 passed (455)
   Start at  21:42:36
   Duration  228.62s (transform 376ms, setup 0ms, import 2.28s, tests 2192.59s, environment 3ms)

```

### task: `npm run check:links`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.5 check:links
> tsx scripts/check-markdown-links.ts

Markdown links OK (1414 file(s) checked).
```

### task: `node scripts/prepublish-check.mjs`

- Exit code: 0
- Status: pass


```text
Prepublish metadata check passed.
```

### task: `npm run build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.5 build
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: /Users/abhyoh/local dev folder/Apps/AgentLoopKit/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     325.89 KB
ESM dist/cli/index.js.map 620.24 KB
ESM ⚡️ Build success in 24ms
DTS Build start
DTS ⚡️ Build success in 891ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm run smoke:release`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.5 smoke:release
> node scripts/smoke-packed-release.mjs

Release smoke for agentloopkit@0.28.5
Packed /var/folders/tc/vn86wd6d7v70rn_pxbv3h2k40000gn/T/agentloopkit-release-smoke-irm2tD/pack/agentloopkit-0.28.5.tgz
README has no stale exact version pins.
Public docs have no stale version pins or unsupported public claims.
ROADMAP current release state matches package metadata.
Packed binary version smoke passed.
Packed init smoke passed.
Packed local-only init smoke passed.
Packed create-task path guard smoke passed.
Packed verify task path guard smoke passed.
Packed init symlink guard smoke passed.
Packed task archive symlink guard smoke passed.
Packed home-directory dry-run guard smoke passed.
Release smoke passed.
```

### task: `node scripts/smoke-cli.mjs`

- Exit code: 0
- Status: pass


```text
CLI smoke for agentloopkit@0.28.5
Version smoke passed.
Missing config smoke passed.
Init dry-run smoke passed.
Init smoke passed.
Doctor smoke passed.
Create-task smoke passed.
Task lifecycle smoke passed.
Verify smoke passed.
Verify progress smoke passed.
Handoff smoke passed.
Check-gates smoke passed with status pass.
Ship smoke passed.
Review-context smoke passed.
Run ledger limit smoke passed.
Run ledger smoke passed.
Prepare-pr smoke passed.
Maintainer-check smoke passed with status warn.
Task done smoke passed.
Nested cwd smoke passed.
CLI smoke passed.
```

### task: `npx --yes projscan doctor --format markdown`

- Exit code: 0
- Status: pass


```text
# Project Health Report

**Health Score: A (100/100)**

[![projscan health](https://img.shields.io/badge/projscan-A-brightgreen)](https://github.com/abhiyoheswaran1/projscan)

No issues detected. Project looks healthy!
```

### task: `npm publish --access public --dry-run`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.5 prepublishOnly
> node scripts/prepublish-check.mjs && npm run typecheck && npm test && npm run build

Prepublish metadata check passed.

> agentloopkit@0.28.5 typecheck
> tsc --noEmit


> agentloopkit@0.28.5 test
> vitest run


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  51 passed (51)
      Tests  455 passed (455)
   Start at  21:48:20
   Duration  176.41s (transform 370ms, setup 0ms, import 2.27s, tests 1652.92s, environment 3ms)


> agentloopkit@0.28.5 build
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: /Users/abhyoh/local dev folder/Apps/AgentLoopKit/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     325.89 KB
ESM dist/cli/index.js.map 620.24 KB
ESM ⚡️ Build success in 30ms
DTS Build start
DTS ⚡️ Build success in 919ms
DTS dist/cli/index.d.ts 13.00 B
npm notice
npm notice 📦  agentloopkit@0.28.5
npm notice Tarball Contents
npm notice 1.1kB LICENSE
npm notice 14.6kB README.md
npm notice 13B dist/cli/index.d.ts
npm notice 333.7kB dist/cli/index.js
npm notice 635.1kB dist/cli/index.js.map
npm notice 4.6kB dist/schema/agentloop.config.schema.json
npm notice 1.2kB dist/templates/agents/claude-code.md
npm notice 1.3kB dist/templates/agents/codex.md
npm notice 1.1kB dist/templates/agents/cursor.md
npm notice 1.2kB dist/templates/agents/gemini-cli.md
npm notice 1.1kB dist/templates/agents/generic.md
npm notice 1.1kB dist/templates/agents/github-copilot-cli.md
npm notice 1.1kB dist/templates/agents/opencode.md
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
npm notice 5.8kB dist/templates/harness/commands.md
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
npm notice 5.8kB dist/templates/root/agentloop-directory-readme.md
npm notice 917B dist/templates/root/agentloop.config.json
npm notice 4.2kB dist/templates/root/AGENTLOOP.md
npm notice 5.2kB dist/templates/root/AGENTS.md
npm notice 3.1kB dist/templates/tasks/README.md
npm notice 2.2kB package.json
npm notice 4.6kB schema/agentloop.config.schema.json
npm notice 563B server.json
npm notice Tarball Details
npm notice name: agentloopkit
npm notice version: 0.28.5
npm notice filename: agentloopkit-0.28.5.tgz
npm notice package size: 219.4 kB
npm notice unpacked size: 1.0 MB
npm notice shasum: 1c58d5350fe652c5615e716c33a3458849d70fdb
npm notice integrity: sha512-IrIwhi0mwHRta[...]JCLSDAEKSO1Ig==
npm notice total files: 58
npm notice
npm notice Publishing to https://registry.npmjs.org/ with tag latest and public access (dry-run)
+ agentloopkit@0.28.5
```

### task: `npm pack --pack-destination /tmp --silent`

- Exit code: 0
- Status: pass


```text
agentloopkit-0.28.5.tgz
```

## Not Run
- test
- lint
- typecheck
- build

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
