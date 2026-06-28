# Autonomous Dogfooding

This repo uses AgentLoopKit as its own operating loop and uses Baseframe Labs companion tools as local proof sources.

## Required Tools

- AgentLoopKit: task contracts, verification reports, ship reports, PR handoffs, release proof, run ledger, and gates.
- ProjScan: repo health, repo understanding, risk signals, and agent-oriented project inspection.
- AgentFlight: local session flight recorder, status, proof reports, replay, and resume prompts.

## Operating Loop

Use this loop for meaningful product changes:

Build -> Test -> Review -> Simulated user feedback -> Product panel debate -> Decision -> Backlog update -> Iterate -> Verify -> Document

Do not skip the task contract. Do not skip verification. Do not cut a version unless the maintainer explicitly asks for release prep.

## Start A Session

Start the flight recorder first, wait for it to finish, then create or update the AgentLoop task contract. Do not start AgentFlight and `agentloop create-task` in parallel. Parallel starts can leave a generic AgentFlight-derived task contract active instead of the detailed AgentLoop task.

```bash
npm run dogfood:start -- --title "Describe the change" --type feature --problem "Why this task matters" --outcome "What should be true when it is done"
```

The helper runs AgentLoopKit through the source CLI (`npx --no-install tsx src/cli/index.ts`) so dogfooding works before `dist/` exists in a fresh contributor checkout.

Supported task types: `feature`, `bugfix`, `refactor`, `tests`, `test-generation`, `docs`, `release`, `security-review`, `dependency-upgrade`, and `migration`. `--type test` is accepted as a local alias for `tests`. Unsupported task types fail before AgentFlight starts, so the helper does not create a recorder session for a task contract that AgentLoopKit would reject.

After the detailed AgentLoop task is created, the helper parks exact AgentFlight placeholder task contracts with `agentloop task status <path> deferred`. It preserves the task file as evidence and does not touch custom task contracts.

Use `--dry-run` first when you want to inspect the exact local commands without writing AgentFlight, AgentLoopKit, or ProjScan state.

If you start AgentFlight directly with `npx --yes agentflight start --task "<task>" --yes`, run `agentloop status --redact-paths` and `agentloop task doctor --redact-paths` afterward. If the AgentFlight placeholder becomes active, treat that file as preserved session evidence: run `agentloop task clear`, then `agentloop task set <path>` for the detailed task contract or `agentloop create-task` for new scoped work. Do not hand-edit or delete the placeholder as the default recovery.

If a task already exists, read it first:

```bash
agentloop task list
agentloop task show <path>
agentloop task set <path>
```

## During Implementation

Use the internal decision files before choosing scope:

- `.agentloop/product-panel.md`
- `.agentloop/user-personas.md`
- `.agentloop/backlog.md`
- `.agentloop/research/`

Backlog rows are decision support, not proof that work is still open. Before creating a task from a backlog row, cross-check `.agentloop/tasks/archive/`, current task contracts, tests, docs, and implementation evidence for a matching completed change. If the work is already archived and the behavior is implemented, treat it as shipped local context and do not create a duplicate task contract by default.

Synthetic feedback is internal decision support, not public evidence. Do not write public docs that claim real users, teams, adoption, interviews, testimonials, or demand unless the repo contains real evidence.

Use the panel roles as reviewers:

- Abhi: product wedge and adoption value
- Maya: architecture and maintainability
- Elias: open-source trust and README clarity
- Nora: CLI and onboarding experience
- Samir: safety, registry, env-file, and supply-chain risk
- Lina: agentic engineering workflow
- Tom: deterministic value for skeptical reviewers
- Rachel: lightweight team consistency

AgentFlight changed-file filters ignore generated AgentLoop evidence directories so `agentflight status` and proof reports stay focused on implementation changes. The ignored evidence directories are `.agentloop/handoffs/, .agentloop/reports/, .agentloop/runs/, and .agentloop/tasks/archive/`. Keep `.agentloop/harness/`, product-panel files, backlog, policies, and source changes visible; AgentLoopKit remains the source of truth for task, verification, ship, and handoff evidence.

ProjScan ignores generated AgentLoop and AgentFlight evidence directories through `.projscanrc.json` so repo scans focus on source, docs, tests, config, and current task context. Keep `.agentloop/harness/`, `.agentloop/policies/`, product-panel files, backlog, research files, and current `.agentloop/tasks/` contracts visible to ProjScan.

## Local Loop Contracts

Use AgentLoopKit loop contracts when a task should iterate across evidence rather than one implementation pass:

```bash
agentloop loop create --preset agentloopkit-maintenance --budget-tokens 50000 --max-iterations 5
agentloop loop tick
agentloop loop status
agentloop loop report
agentloop ready
```

Use a guarded runner only when the task contract already names the command:

```bash
agentloop loop create \
  --goal "Keep AgentLoopKit release-ready" \
  --runner-command "npm run maintenance:check" \
  --runner-timeout-ms 900000 \
  --budget-tokens 50000 \
  --max-iterations 3
agentloop loop run
agentloop loop status
agentloop loop report
```

Loop commands record goals, token receipts, readiness decisions, guarded runner evidence, and stop reasons. `loop tick` reads evidence only. `loop run` executes only the configured runner command, rejects shell syntax, blocks publish and destructive command families, caps output, and still enforces iteration and token-budget limits. Use `agentloopkit-maintenance` for routine health, `docs-drift` for CLI and docs alignment, `release-readiness` before approved release work, and `baseframe-integration` for local artifact compatibility.

## Verification

Use focused checks while editing, then record proof:

```bash
npm run test:unit
npm run check:public-docs
npm run check:links
npm run build
agentloop verify --task-commands --write-run
npx --yes projscan doctor --format markdown
npx --yes agentflight doctor
npx --yes agentflight status
```

When recording focused AgentFlight verification, pass the executable and arguments after `--`:

```bash
npx --yes agentflight verify -- npm test -- tests/example.test.ts
```

Do not pass the full verification command as one quoted string; AgentFlight records command arguments directly, and a quoted shell-style command can create failed evidence for a command that was never executed.

For release work, run the release gate only after the maintainer asks for a release:

```bash
npm run release-flow
agentloop release-proof
```

## Handoff

Before stopping:

```bash
agentloop ship
agentloop prepare-pr
agentloop handoff --write-run
npm run dogfood:strict
npx --yes agentflight snapshot --note "Handoff ready"
npx --yes agentflight report
```

Run `npm run dogfood:strict` after fresh handoff or ship evidence exists, when review-gate warnings should block the handoff. Strict dogfood includes `check-gates --strict`, so running it before reviewer evidence is written will correctly fail and ask for `agentloop handoff`. It also prints AgentFlight doctor and status output so session health and readiness are visible; AgentFlight status remains exit-code based and its human output is not parsed. maintainer-check warnings remain reviewer guidance unless the command exits non-zero.

Keep the handoff honest:

- What changed
- What was verified
- What failed or was not checked
- Which personas or panel concerns shaped the decision
- What should happen next

## Local Artifacts

Commit AgentLoopKit evidence when it is part of the repo task. Keep noisy local caches out of review:

- `.projscan-memory/`
- `.projscan-cache/`
- `.agentflight/current/`
- `.agentflight/sessions/*.json`

Commit `.agentflight/config.json` so future agents share the same local-first setup. Commit curated AgentFlight reports only when they are intentionally redacted and useful review evidence for this repo. Do not commit live session JSON, credentials, `.env` files, npm tokens, GitHub tokens, or machine-specific secrets.
