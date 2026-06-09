# Verification Report

- Timestamp: 2026-06-09T23:10:10.414Z
- Repo: AgentLoopKit
- Git branch: main
- Git commit: e3aeaf5
- Working tree: dirty
- Overall status: pass


## Commands Run
### test: `npx pnpm@10.12.1 test`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.16.0 test /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> vitest run


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  23 passed (23)
      Tests  83 passed (83)
   Start at  01:10:12
   Duration  10.00s (transform 332ms, setup 0ms, import 1.54s, tests 54.59s, environment 1ms)

```

### lint: `npx pnpm@10.12.1 lint`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.16.0 lint /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> eslint .

```

### typecheck: `npx pnpm@10.12.1 typecheck`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.16.0 typecheck /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> tsc --noEmit

```

### build: `npx pnpm@10.12.1 build`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.16.0 build /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: /Users/abhyoh/local dev folder/Apps/AgentLoopKit/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     98.86 KB
ESM dist/cli/index.js.map 187.77 KB
ESM ⚡️ Build success in 20ms
DTS Build start
DTS ⚡️ Build success in 516ms
DTS dist/cli/index.d.ts 13.00 B
```

### custom: `npx pnpm@10.12.1 check:links`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.16.0 check:links /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> tsx scripts/check-markdown-links.ts

Markdown links OK (383 file(s) checked).
```

### custom: `npx projscan doctor --format markdown`

- Exit code: 0
- Status: pass

```text
# Project Health Report

**Health Score: A (100/100)**

[![projscan health](https://img.shields.io/badge/projscan-A-brightgreen)](https://github.com/abhiyoheswaran1/projscan)

No issues detected. Project looks healthy!
```

### custom: `npm pack --dry-run`

- Exit code: 0
- Status: pass

```text
npm notice
npm notice 📦  agentloopkit@0.16.0
npm notice Tarball Contents
npm notice 1.1kB LICENSE
npm notice 17.2kB README.md
npm notice 13B dist/cli/index.d.ts
npm notice 101.2kB dist/cli/index.js
npm notice 192.3kB dist/cli/index.js.map
npm notice 3.3kB dist/schema/agentloop.config.schema.json
npm notice 869B dist/templates/agents/claude-code.md
npm notice 1.0kB dist/templates/agents/codex.md
npm notice 840B dist/templates/agents/cursor.md
npm notice 879B dist/templates/agents/gemini-cli.md
npm notice 764B dist/templates/agents/generic.md
npm notice 847B dist/templates/agents/github-copilot-cli.md
npm notice 840B dist/templates/agents/opencode.md
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
npm notice 2.7kB dist/templates/harness/commands.md
npm notice 446B dist/templates/harness/definition-of-done.md
npm notice 260B dist/templates/harness/release-checklist.md
npm notice 493B dist/templates/harness/repo-map.md
npm notice 303B dist/templates/harness/review-checklist.md
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
npm notice 2.7kB dist/templates/root/agentloop-directory-readme.md
npm notice 917B dist/templates/root/agentloop.config.json
npm notice 2.9kB dist/templates/root/AGENTLOOP.md
npm notice 1.8kB dist/templates/root/AGENTS.md
npm notice 2.0kB dist/templates/tasks/README.md
npm notice 1.7kB package.json
npm notice 3.3kB schema/agentloop.config.schema.json
npm notice Tarball Details
npm notice name: agentloopkit
npm notice version: 0.16.0
npm notice filename: agentloopkit-0.16.0.tgz
npm notice package size: 83.6 kB
npm notice unpacked size: 354.9 kB
npm notice shasum: 6d7f937b0d47641d1a60639a8480ffb69029475d
npm notice integrity: sha512-mZZPhxyQxJt0M[...]dFPYIVBTOV4Xg==
npm notice total files: 57
npm notice
agentloopkit-0.16.0.tgz
```

## Not Run
- Nothing skipped.

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
