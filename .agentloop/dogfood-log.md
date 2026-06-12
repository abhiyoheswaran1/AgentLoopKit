# Dogfood Log

Internal log of AgentLoopKit used on AgentLoopKit itself.

## 2026-06-12: 0.28.6 Release Gate

- Task contract: `.agentloop/tasks/archive/2026-06-12-release-agentloopkit-0-28-6-patch.md`
- Trigger:
  - The release-check stale-release-notes guard landed on `main`.
  - The maintainer asked for a small patch release after the dogfood pass.
- Product change:
  - Prepared `agentloopkit@0.28.6`.
  - Updated `package.json`, `server.json`, `CHANGELOG.md`, and `ROADMAP.md`.
  - Generated clean release notes for `v0.28.5..HEAD`.
- Verification:
  - AgentLoop release verification passed and wrote `.agentloop/reports/2026-06-12-22-56-verification-report.md`.
  - The verification run wrote `.agentloop/runs/2026-06-12-22-59-verify/`.
  - `npm run dogfood:strict` passed.
  - `node dist/cli/index.js release-check --strict` passed and verified the `0.28.6` release notes.
  - `npx --yes projscan doctor --format markdown` reported A 100/100.
  - GitHub release `v0.28.6` was created with release asset SHA-256 `2f91b2c0adc5d44f5f32f09eb40f4e0ce028c07400c6fb76fe075070ec65b573`.
  - CI workflow `27442870785` passed.
  - CLI Smoke workflow `27442870779` passed on Ubuntu, macOS, and Windows.
  - Publish workflow `27442925865` passed and published `agentloopkit@0.28.6`.
  - Docker workflow `27442925900` passed.
  - MCP Registry workflow `27443148213` passed.
  - `npm view agentloopkit version versions --json` reported latest `0.28.6`.
  - `npm run smoke:published -- --version 0.28.6` passed.
- Worked well:
  - The new release-check rule caught the exact evidence it was meant to prove: current-version release notes existed before publishing.
- Improve:
  - The generated release notes include many AgentLoop evidence files; keep GitHub release notes concise and public-facing.

## 2026-06-12: Current Release Notes Evidence Gate

- Task contract: `.agentloop/tasks/archive/2026-06-12-require-current-release-notes-in-release-check.md`
- Trigger:
  - Dogfooding after `0.28.5` showed `release-check` accepted the latest generated release-notes artifact even when it described an older package version.
  - The release gate needed stronger local evidence before pointing maintainers at the npm-status step.
- Product change:
  - `release-check` now reads the latest generated release-notes artifact and warns unless it mentions the local `package.json` version.
  - Strict mode fails that warning, so stale release notes cannot pass a maintainer release gate.
  - The command stays local-only and does not call npm, GitHub, MCP Registry, or any external API.
- Verification:
  - Red TDD run: `npm test -- tests/release-check.test.ts -t "warns when generated release notes do not mention the package version"` failed because stale release notes still passed.
  - Green focused run: the same regression test passed after the release-notes version check.
  - Full focused suite: `npm test -- tests/release-check.test.ts` passed with 8 tests.
  - AgentLoop verification passed and wrote `.agentloop/reports/2026-06-12-22-41-verification-report.md`.
  - The verification run wrote `.agentloop/runs/2026-06-12-22-42-verify/`.
  - `npm run dogfood:strict` passed.
  - `npx --yes projscan doctor --format markdown` reported A 100/100.
- Worked well:
  - The release-check gate now proves the generated release notes belong to the package version being prepared.
- Improve:
  - A future release workflow could generate release notes and then run `release-check --strict` in one documented maintainer sequence.

## 2026-06-12: 0.28.5 Release Gate

- Task contract: `.agentloop/tasks/archive/2026-06-12-release-agentloopkit-0-28-5-patch.md`
- Trigger:
  - The safer `release-check` publish guidance landed after `0.28.4`.
  - The maintainer asked for a small patch release after logo and dogfood work.
- Product change:
  - Prepared `agentloopkit@0.28.5`.
  - Updated `server.json` so MCP Registry metadata names the same package version.
  - Moved the release-check guidance changelog note from `Unreleased` into `0.28.5`.
  - Updated `ROADMAP.md` current release state so release smoke matches package metadata.
  - Fixed `check-gates --strict` so clean committed release evidence does not fail only because there are no changed files.
- Verification:
  - First AgentLoop release verification failed because `ROADMAP.md` still named `0.28.4`.
  - Focused guard: `npm test -- tests/release-smoke.test.ts` passed with 18 tests after the roadmap update.
  - Focused packed smoke: `npm run smoke:release` passed after the roadmap update.
  - Red TDD run: `npm test -- tests/check-gates.test.ts -t "passes strict gates for clean verified evidence with no changed files"` failed because clean Git context still warned.
  - Green focused run: the same check-gates test passed after the gate status change.
  - Full check-gates run: `npm test -- tests/check-gates.test.ts` passed with 13 tests.
  - Final AgentLoop release verification passed and wrote `.agentloop/reports/2026-06-12-22-10-verification-report.md`.
  - The final verification run wrote `.agentloop/runs/2026-06-12-22-20-verify/`.
  - `npm run dogfood:strict` passed after the clean-tree strict-gate fix.
  - `node dist/cli/index.js release-check --strict` passed.
  - GitHub release `v0.28.5` was created with release asset SHA-256 `89244fd07cb85c2615adf7461cbb9a71d24b83858752acc22f83752fe1e47ba7`.
  - CI workflow `27440864521` passed.
  - CLI Smoke workflow `27440864531` passed on Ubuntu, macOS, and Windows.
  - Publish workflow `27440882421` passed and published `agentloopkit@0.28.5`.
  - Docker workflow `27440882387` passed.
  - MCP Registry workflow `27441104421` passed.
  - `npm view agentloopkit version versions --json` reported latest `0.28.5`.
  - `npm run smoke:published -- --version 0.28.5` passed.
- Worked well:
  - The release-smoke roadmap guard caught stale public release state before tagging.
- Improve:
  - Release tasks should keep registry checks in the post-publish section because `npm-status --expect-current` cannot pass for a new version before the trusted publishing workflow runs.

## 2026-06-12: Safer Release-Check Publish Guidance

- Task contract: `.agentloop/tasks/archive/2026-06-12-make-release-check-publish-guidance-safer.md`
- Trigger:
  - After `0.28.4` was live, `release-check --strict` still recommended `npm publish --access public`.
  - The command is local-only, so it cannot know whether npm already has the current version.
- Product change:
  - `release-check` now points maintainers to `agentloop npm-status` before publishing.
  - The command stays read-only and does not call npm, GitHub, or any external API.
- Verification:
  - Red TDD run: `npm test -- tests/release-check.test.ts` failed because the command still returned `npm publish --access public`.
  - Green focused run: `npm test -- tests/release-check.test.ts` passed with 7 tests.
  - AgentLoop verification passed and wrote `.agentloop/reports/2026-06-12-21-13-verification-report.md`.
  - The verification run wrote `.agentloop/runs/2026-06-12-21-14-verify/`.
  - `npm run dogfood:strict` passed.
  - `npm run check:links` passed and checked 1406 Markdown files.
  - `npx --yes projscan doctor --format markdown` reported A 100/100.
  - `npm run lint` passed.
  - Full `npm test` passed with 51 files and 455 tests.
- Worked well:
  - The release process exposed a real safety copy bug after the package was already current on npm.
- Improve:
  - Consider a future `release-check --registry` mode that composes local release evidence with `npm-status` output while keeping default `release-check` local-only.

## 2026-06-12: 0.28.4 Release Gate

- Task contract: `.agentloop/tasks/2026-06-12-prepare-0-28-4-patch-release.md`
- Trigger:
  - The latest dogfood improvements were verified on `main`, but npm and GitHub still pointed at `0.28.3`.
  - The patch release needed package metadata, MCP metadata, changelog, release smoke, and registry proof to line up.
- Product change:
  - Prepared `agentloopkit@0.28.4`.
  - Updated `server.json` so MCP Registry metadata names the same package version.
  - Raised Vitest's bounded per-test timeout to 90 seconds after full release gates exposed multiple subprocess-heavy CLI tests exceeding the previous 30 second budget.
- Verification:
  - `node scripts/prepublish-check.mjs` passed.
  - `npm test -- tests/prepare-pr.test.ts tests/check-gates.test.ts tests/status.test.ts` passed with 43 tests.
  - AgentLoop release verification passed and wrote `.agentloop/reports/2026-06-12-20-35-verification-report.md`.
  - The passing verification run wrote `.agentloop/runs/2026-06-12-20-39-verify/`.
  - `npm run lint` passed.
  - `npm run check:links` passed and checked 1397 Markdown files.
  - `git diff --check` passed.
  - `npx --yes projscan doctor --format markdown` reported A 100/100.
  - GitHub release `v0.28.4` was created with release asset SHA-256 `9550589fcb6400d5d3972c2f308d60d7d25df0d85d70033f293d0ad709435a6f`.
  - Publish workflow `27436246020` passed and published `agentloopkit@0.28.4`.
  - Docker workflow `27436246026` passed.
  - MCP Registry workflow `27436462226` passed.
  - `npm view agentloopkit version versions --json` reported latest `0.28.4`.
  - `npm run smoke:published -- --version 0.28.4` passed.
- Worked well:
  - The release gate caught stale process assumptions before tagging.
  - Packed release smoke kept README, public docs, and ROADMAP version state aligned with package metadata.
- Improve:
  - `release-check --strict` should stay a post-verification clean-tree gate, not a command inside `agentloop verify`.
  - Release tasks should include `lint` and `check:links` when docs or tests changed.

## 2026-06-12: Duplicate Verification Skip Reporting

- Task contract: `.agentloop/tasks/archive/2026-06-12-report-skipped-duplicate-verification-commands.md`
- Trigger:
  - The previous config-command task made verification skip exact duplicate command strings, but reports did not explain which duplicate was skipped.
  - Agents need that evidence when a task command was found but does not appear as a separate command result.
- Product change:
  - Verification JSON now includes `skippedDuplicateCommands` with `command`, `originalKey`, and `duplicateKey`.
  - Markdown verification reports include a `Duplicate Commands` section when exact duplicates are skipped.
  - Duplicate commands still execute once.
  - Two subprocess-heavy integration tests now use the repo's existing 90s timeout-budget pattern after the full suite exposed 30s timeouts.
- Verification:
  - Red TDD run: `npm test -- tests/verification.test.ts -t "runs exact duplicate configured and task commands only once"` failed because `skippedDuplicateCommands` was missing.
  - Green targeted run: the same focused test passed.
  - Focused affected run: `npm test -- tests/verification.test.ts tests/prepare-pr.test.ts tests/release-check.test.ts` passed with 53 tests.
  - First AgentLoop task verification failed because `tests/prepare-pr.test.ts` and `tests/release-check.test.ts` had two timeout-prone tests without the local 90s budget.
  - Retried AgentLoop task verification passed and wrote `.agentloop/reports/2026-06-12-19-43-verification-report.md`.
  - The passing verification run wrote `.agentloop/runs/2026-06-12-19-49-verify/`.
  - `npm run dogfood:strict` passed.
  - `npm run check:links` passed and checked 1394 Markdown files.
  - `npx --yes projscan doctor --format markdown` reported A 100/100.
  - Final ship and PR evidence were generated after the log entry was written and are stored in the committed run ledger for this task.
- Worked well:
  - The previous task's dogfood note became the next task and produced a concrete UX improvement.
- Improve:
  - If duplicate skips become common, consider adding the count to the terminal success line without printing full command strings by default.

## 2026-06-12: Config Verification Commands for Task Contracts

- Task contract: `.agentloop/tasks/archive/2026-06-12-add-config-verification-command-suggestions.md`
- Trigger:
  - Dogfooding showed TypeScript source changes could omit `typecheck` from task-level verification commands even when `agentloop.config.json` already had the command.
  - The first implementation exposed a second bug: copying configured commands into a task contract could make `verify --task-commands` run the same exact command twice.
- Product change:
  - Added `agentloop create-task --include-config-commands`.
  - The flag copies non-empty configured `test`, `lint`, `typecheck`, and `build` commands into the task contract without running them during creation.
  - Task creation de-duplicates exact command strings when configured and explicit verification commands overlap.
  - Verification now runs exact duplicate command strings once when configured commands and task contract commands overlap.
- Verification:
  - Red TDD run: `npm test -- tests/create-task.test.ts` failed because `--include-config-commands` was unknown.
  - Green focused run: `npm test -- tests/create-task.test.ts` passed with 19 tests.
  - Red TDD run: `npm test -- tests/verification.test.ts` failed because duplicate configured and task commands both ran.
  - Green focused run: `npm test -- tests/verification.test.ts` passed with 41 tests.
  - AgentLoop task verification passed with `--only-task-commands --progress` and wrote `.agentloop/reports/2026-06-12-19-17-verification-report.md`.
  - The verification run wrote `.agentloop/runs/2026-06-12-19-20-verify/`.
  - `npm run dogfood:strict` passed.
  - `npm run check:links` passed and checked 1386 Markdown files.
  - `npx --yes projscan doctor --format markdown` reported A 100/100.
  - Ship report: `.agentloop/reports/2026-06-12-19-23-ship-report.md` with review readiness `96`/100.
  - PR summary: `.agentloop/handoffs/2026-06-12-19-23-pr-summary.md`.
  - PR description: `.agentloop/handoffs/2026-06-12-19-23-pr-description.md`.
- Worked well:
  - Running the product on itself caught the duplicate-command behavior before the change was committed.
- Improve:
  - Consider a future `verify` report note that states when duplicate commands were skipped, so agents can explain why a found task command does not appear as a separate `task` entry.

## 2026-06-12: Built CLI Smoke Covers Bounded Runs

- Task contract: `.agentloop/tasks/2026-06-12-smoke-test-bounded-run-output.md`
- Trigger:
  - `agentloop runs --latest` and `agentloop runs --limit <count>` had source tests, but release smoke did not prove the built CLI accepted the new flags.
- Product change:
  - `scripts/smoke-cli.mjs` now runs the built CLI with `runs --latest`.
  - It also runs `runs --limit 2 --json` and checks that exactly the newest two runs are returned in order.
  - `tests/distribution-artifacts.test.ts` guards that this smoke coverage remains present.
- Verification:
  - Focused run: `npm test -- tests/distribution-artifacts.test.ts` passed with 10 tests.
  - Focused run after the CI typecheck fix: `npm test -- tests/runs.test.ts tests/distribution-artifacts.test.ts` passed with 21 tests.
  - `npm run typecheck` passed after tightening `runs --limit` parsing.
  - `npm run build && node scripts/smoke-cli.mjs` passed and printed `Run ledger limit smoke passed.`
  - AgentLoop task verification passed and wrote `.agentloop/reports/2026-06-12-18-46-verification-report.md`.
  - Full `npm test` passed inside the AgentLoop verification run.
  - Handoff summary: `.agentloop/handoffs/2026-06-12-18-53-pr-summary.md`.
  - Ship report: `.agentloop/reports/2026-06-12-18-53-ship-report.md` with review readiness `96`/100.
  - `npm run dogfood:strict` passed.
  - `npx --yes projscan doctor --format markdown` reported A 100/100.
- Worked well:
  - The previous GitHub CI failure caught a type-narrowing issue that local focused runtime tests did not cover.
- Improve:
  - Include `npm run typecheck` in task verification commands whenever TypeScript source changes, even for smoke-test tasks.

## 2026-06-12: Bounded Run Ledger Navigation

- Task contract: `.agentloop/tasks/2026-06-12-add-run-ledger-limit-controls.md`
- Trigger:
  - `agentloop runs` had become noisy in this repo because dogfooding writes many verify, handoff, and ship entries.
- Product change:
  - Added `agentloop runs --latest`.
  - Added `agentloop runs --limit <count>`.
  - Invalid limits fail before workspace loading or run metadata reads.
- Verification:
  - Red TDD run: `npm test -- tests/runs.test.ts` failed on unknown `--limit` and invalid-limit behavior.
  - Green focused run: `npm test -- tests/runs.test.ts` passed with 11 tests.
  - AgentLoop task verification passed and wrote `.agentloop/reports/2026-06-12-18-26-verification-report.md`.
  - Full `npm test` and `npm run build` passed inside the AgentLoop verification run.
  - Built CLI smoke checks: `node dist/cli/index.js runs --latest` and `node dist/cli/index.js runs --limit 2 --json` passed.
  - Handoff summary: `.agentloop/handoffs/2026-06-12-18-33-pr-summary.md`.
  - Ship report: `.agentloop/reports/2026-06-12-18-33-ship-report.md` with review readiness `96`/100.
  - `npm run dogfood:strict` passed.
  - `npm run check:links` passed.
  - `npx --yes projscan doctor --format markdown` reported A 100/100.
- Worked well:
  - Dogfooding a long run ledger made the smallest useful UX improvement obvious.
- Improve:
  - Consider adding similar bounded output to `intent <file>` if file histories become noisy.

## 2026-06-12: Clarified Status After Archived Evidence

- Task contract: `.agentloop/tasks/2026-06-12-clarify-status-after-archived-evidence.md`
- Trigger:
  - After task cleanup, `agentloop status` could say `agentloop create-task` even while the just-shipped dirty evidence still needed final handoff or review attention.
- Product change:
  - `agentloop status` now points to `agentloop handoff` when no open task exists, the tree is dirty, and the latest run references completed task evidence.
  - Dirty work with no task/run evidence still points to `agentloop create-task`.
  - JSON, brief, and Markdown status outputs share the same next-action decision.
- Verification:
  - Focused run: `npm test -- tests/status.test.ts` passed with 25 tests.
  - AgentLoop task verification passed and wrote `.agentloop/reports/2026-06-12-18-11-verification-report.md`.
  - Full `npm test` and `npm run build` passed inside the AgentLoop verification run.
  - Handoff summary: `.agentloop/handoffs/2026-06-12-18-18-pr-summary.md`.
  - Ship report: `.agentloop/reports/2026-06-12-18-18-ship-report.md` with review readiness `100`/100.
  - `npm run dogfood:strict` passed.
  - `npx --yes projscan doctor --format markdown` reported A 100/100.
- Worked well:
  - The previous archived-run fix made this mismatch visible in real dogfood output.
- Improve:
  - Keep next-action rules aligned between `status`, `check-gates`, and the dogfood gate.

## 2026-06-12: Hydrated Archived Run Task Status

- Task contract: `.agentloop/tasks/2026-06-12-hydrate-archived-run-task-status.md`
- Trigger:
  - `agentloop runs --json` and `agentloop status --json` showed archived completed work as `in-progress` because run metadata kept the original task snapshot.
- Product change:
  - Run summaries now hydrate task title, status, and path from the current task file or archived task file when present.
  - Stored run metadata remains unchanged on disk.
  - Missing task files still fall back to the stored run snapshot.
- Verification:
  - Red TDD run: `npm test -- tests/runs.test.ts tests/status.test.ts` failed on stale latest-run task metadata.
  - Green focused run: `npm test -- tests/runs.test.ts tests/status.test.ts` passed with 33 tests.
  - AgentLoop task verification passed and wrote `.agentloop/reports/2026-06-12-17-53-verification-report.md`.
  - Full `npm test` and `npm run build` passed inside the AgentLoop verification run.
  - Handoff summary: `.agentloop/handoffs/2026-06-12-18-00-pr-summary.md`.
  - Ship report: `.agentloop/reports/2026-06-12-18-00-ship-report.md` with review readiness `96`/100.
  - `npm run dogfood:strict` passed and showed recent archived runs with `status: done`.
  - `npx --yes projscan doctor --format markdown` reported A 100/100.
- Worked well:
  - Dogfooding exposed a real ledger trust issue after archiving completed task contracts.
- Improve:
  - Evidence displays should prefer reachable local artifacts when they exist, without rewriting historical evidence files.

## 2026-06-12: Built CLI Smoke Covers Verify Progress

- Task contract: `.agentloop/tasks/2026-06-12-smoke-test-verify-progress-flag.md`
- Trigger:
  - `agentloop verify --progress` had source-level tests, but the built package smoke flow did not prove the packaged binary accepted the new flag.
- Product change:
  - `scripts/smoke-cli.mjs` now runs `verify --progress` against the built CLI.
  - The smoke assertion checks the start line, finish line, and absence of raw child-process output in stdout.
- Verification:
  - Red TDD run: `npm test -- tests/distribution-artifacts.test.ts` failed because the smoke script had no `--progress` coverage.
  - Green focused run: `npm test -- tests/distribution-artifacts.test.ts` passed with 1 file and 10 tests.
  - `npm run build && node scripts/smoke-cli.mjs` passed, including `Verify progress smoke passed.`
  - AgentLoop task verification passed with `--progress` and wrote `.agentloop/reports/2026-06-12-17-39-verification-report.md`.
  - `npm run dogfood:strict` passed.
  - `npx --yes projscan doctor --format markdown` reported A 100/100.
- Worked well:
  - The smoke flow now covers the exact binary users get from the package.
- Improve:
  - Keep new CLI flags covered in both source tests and built smoke when they affect release confidence.

## 2026-06-12: Roadmap Release-State Guard

- Task contract: `.agentloop/tasks/2026-06-12-guard-roadmap-release-state.md`
- Trigger:
  - After `0.28.3`, release-status docs were current but `ROADMAP.md` still named an older current release.
  - The product-panel decision treated stale public release state as a trust issue.
- Product change:
  - Release smoke now checks `ROADMAP.md` `Current State` lines against `package.json.version`.
  - The guard is local and deterministic. It does not call npm, GitHub, GHCR, or MCP Registry.
- Verification:
  - Red TDD run: `npm test -- tests/release-smoke.test.ts` failed because `assertRoadmapCurrentReleaseState` did not exist.
  - Green focused run: `npm test -- tests/release-smoke.test.ts` passed with 1 file and 18 tests.
  - AgentLoop task verification passed with `--progress` and wrote `.agentloop/reports/2026-06-12-17-31-verification-report.md`.
  - `npm run smoke:release` passed and printed `ROADMAP current release state matches package metadata.`
  - `npm run dogfood:strict` passed.
  - `npx --yes projscan doctor --format markdown` reported A 100/100.
- Worked well:
  - The test caught an extractor bug before implementation was accepted.
- Improve:
  - Keep release guards narrow. Historical release docs should still be allowed to mention older versions.

## 2026-06-12: Verification Progress Output

- Task contract: `.agentloop/tasks/2026-06-12-add-verification-progress-output.md`
- Trigger:
  - Dogfood release gates and test runs can look idle while subprocesses run.
  - The product-panel decision favored a small opt-in progress mode over a spinner, TUI, live log stream, or new dependency.
- Product change:
  - `agentloop verify --progress` prints bounded command start/finish lines.
  - Raw child-process output stays in the verification report.
  - `agentloop verify --json --progress` keeps stdout parseable as JSON.
- Verification:
  - Red TDD run: `npm test -- tests/verification.test.ts` failed because progress events were absent and `--progress` was unknown.
  - Green focused run: `npm test -- tests/verification.test.ts` passed with 1 file and 40 tests.
  - AgentLoop task verification passed with `--progress` and wrote `.agentloop/reports/2026-06-12-17-19-verification-report.md`.
  - Full `npm test` passed with 51 files and 444 tests.
  - `npm run build` passed.
  - `npm run dogfood:strict` passed.
  - `npx --yes projscan doctor --format markdown` reported A 100/100.
  - `agentloop ship` reported review readiness 96/100.
- Worked well:
  - The fix directly improved the same long-running gate pain that dogfooding exposed.
- Improve:
  - Consider using `--progress` in release and dogfood docs where humans run long local checks.
  - Do not parallelize dependent `ship` and `prepare-pr` dogfood commands; run `ship` first, then let `prepare-pr` reuse that evidence.

## 2026-06-12: 0.28.3 Release Gate

- Task contract: `.agentloop/tasks/2026-06-12-release-agentloopkit-0-28-3.md`
- Trigger:
  - The archived-task `ship` and `prepare-pr` fixes were ready for a small patch release.
- What happened:
  - The first local release gate passed, but `npm publish --access public --dry-run` exposed two full-suite timeout failures in subprocess-heavy tests.
  - Added explicit 90s Vitest timeout budgets to those integration tests, matching the existing pattern for other ledger and artifact tests.
- Verification:
  - `npm publish --access public --dry-run` passed after the timeout-budget patch.
  - `npm pack --pack-destination /tmp --silent` produced `agentloopkit-0.28.3.tgz`.
  - GitHub release `v0.28.3` published with tarball SHA-256 `e40d2f6434dd3d509f01588194469d9203bded2c583789484884699e128b718e`.
  - CI `27423798870`, CLI Smoke `27423798891`, Publish `27423870384`, Docker `27423870325`, and MCP Registry `27424136328` passed.
  - npm latest is `0.28.3`.
  - `npm run smoke:published -- --version 0.28.3` passed.
- Improve:
  - Keep npm dry-run publishing in every release gate. It catches release-hook behavior that a standalone command sequence can miss.

## 2026-06-12: Prepare-pr Reuses Archived Task Evidence

- Task contract: `.agentloop/tasks/2026-06-12-fix-prepare-pr-archived-task-evidence.md`
- Trigger:
  - After `ship` was fixed to use archived latest-run task evidence, dogfooding showed `prepare-pr` could still lose the task title and task-body sections after cleanup.
  - The generated PR description fell back to generic copy even though a fresh ship report had the archived task context.
- Product change:
  - `prepare-pr` now uses the same current-or-latest-run task evidence resolver as `ship`.
  - Fresh ship-run reuse now works after task archival without writing a duplicate ship run.
  - PR title, acceptance criteria, risks, and rollback notes stay available from the archived task contract.
- Verification:
  - Red TDD run: `npm test -- tests/prepare-pr.test.ts` failed because `titleSuggestion` was `AgentLoopKit review-ready changes`.
  - Green focused run: `npm test -- tests/prepare-pr.test.ts` passed with 1 file and 5 tests.
  - Post-archive dogfood run: `agentloop ship` resolved `.agentloop/tasks/archive/2026-06-12-fix-prepare-pr-archived-task-evidence.md` as `done`, and `agentloop prepare-pr --write --json` reused run `2026-06-12-16-28-ship`.
- Worked well:
  - The dogfood flow caught a user-facing handoff regression immediately after the lower-level `ship` scoring fix.
- Improve:
  - Keep release gates checking the full lifecycle after archiving, not only while a task is active.

## 2026-06-12: Ship Reuses Archived Task Evidence

- Task contract: `.agentloop/tasks/2026-06-12-fix-ship-archived-task-scoring.md`
- Trigger:
  - After the post-verification gates task was archived, `npm run dogfood:strict`, `check-gates`, and `maintainer-check` still found the archived task through latest-run evidence.
  - `agentloop ship` did not use that same fallback, so it scored task clarity as missing after cleanup.
- Product change:
  - `agentloop ship` now uses the same current-or-latest-run task evidence resolver as gates and maintainer-check.
  - Archived task evidence remains read-only context. It does not reactivate the task, alter archive behavior, or execute commands.
- Verification:
  - Red TDD run: `npm test -- tests/ship.test.ts` failed because `ship --json` returned `task: null`, task clarity `0`, and blocker `No task contract found.`
  - Green focused run: `npm test -- tests/ship.test.ts` passed with 1 file and 6 tests.
- Worked well:
  - Dogfooding caught a consistency gap between related review-readiness commands.
  - The fix reused an existing safety-checked resolver instead of adding a parallel path lookup.
- Improve:
  - Keep watching for places where archived task evidence is valid for review but should not become active task state.

## 2026-06-12: Post-Verification Gates For Dogfood Flow

- Task contract: `.agentloop/tasks/2026-06-12-add-post-verification-task-gates.md`
- Trigger:
  - The release metadata guard task showed that `npm run dogfood:strict` fails when a task puts it under `Verification Commands`, because strict dogfood needs a fresh verification report first.
  - The product-panel decision favored explicit task evidence over automatic second-phase command execution.
- Product change:
  - `agentloop create-task` now accepts repeatable `--post-verification` flags.
  - Generated task contracts include a `Post-Verification Gates` section.
  - `agentloop verify --task-commands` still executes only reviewed commands under `Verification Commands`.
  - CLI docs, verification docs, task templates, and harness command guidance now explain the split.
- Verification:
  - Red TDD run: `npm test -- tests/task-contract.test.ts tests/create-task.test.ts tests/verification.test.ts` failed before the CLI flag and generated section existed.
  - Green focused run: `npm test -- tests/task-contract.test.ts tests/create-task.test.ts tests/verification.test.ts` passed with 3 files and 56 tests.
  - Supporting checks passed: `npm run lint`, `npm run typecheck`, `npm run check:links`, `git diff --check`, and `npx --yes projscan doctor --format markdown`.
  - AgentLoop verification report: `.agentloop/reports/2026-06-12-15-42-verification-report.md`.
  - Run ledger entry: `.agentloop/runs/2026-06-12-15-44-verify/`.
  - Post-verification gate: `npm run dogfood:strict` passed after the report existed.
  - Final ship and handoff evidence were generated after the task was archived, with review readiness `96`/100.
- Worked well:
  - The product now matches the way we use it: verify first, then run evidence-dependent gates.
  - The verification parser test protects the safety boundary, so post-verification commands do not become hidden execution.
- Improve:
  - Long verification runs still look quiet while subprocesses execute. Keep the streaming progress backlog item separate.
  - `agentloop ship` should reuse archived latest-run task evidence after cleanup, the same way strict gates and maintainer-check already do.

## 2026-06-12: Release Metadata Sync Prepublish Guard

- Task contract: `.agentloop/tasks/2026-06-12-add-release-metadata-sync-prepublish-guard.md`
- Trigger:
  - The `0.28.2` release gate failed late because `server.json` still listed `0.28.1` after `package.json` moved to `0.28.2`.
  - The product-panel decision favored a fast read-only prepublish guard over metadata auto-rewrites.
- Product change:
  - `scripts/prepublish-check.mjs` now checks `package.json.version` against `server.json.version`.
  - The same guard checks the `agentloopkit` npm package entry inside `server.json`.
  - The guard prints the expected version from `package.json` and the stale value from `server.json`.
- Verification:
  - Red TDD run: `npm test -- tests/prepublish-check.test.ts` failed because stale `server.json` metadata still exited 0.
  - Green focused run: `npm test -- tests/prepublish-check.test.ts` passed with 4 tests.
  - First focused AgentLoop verification failed because `npm run dogfood:strict` was listed as a task command before a current verification report existed.
  - The task contract now treats `npm run dogfood:strict` as a post-report handoff gate.
  - Focused AgentLoop verification passed: `.agentloop/reports/2026-06-12-15-14-verification-report.md`.
  - Final AgentLoop verification passed: `.agentloop/reports/2026-06-12-15-18-verification-report.md`.
  - Run ledger entries: `.agentloop/runs/2026-06-12-15-14-verify/` and `.agentloop/runs/2026-06-12-15-19-verify/`.
  - `npm run dogfood:strict` passed after the report existed.
  - Ship report: `.agentloop/reports/2026-06-12-15-19-ship-report.md` with review readiness `96`/100.
  - Handoff summary: `.agentloop/handoffs/2026-06-12-15-19-pr-summary.md`.
  - ProjScan reported A 100/100.
- Worked well:
  - The release failure became a concrete product guard within one dogfood cycle.
  - The new `--only-task-commands` flag made the focused verification pass shorter and clearer.
- Improve:
  - Add phase-aware guidance so task contracts do not put post-report commands inside the same `verify --task-commands` phase.

## 2026-06-12: 0.28.2 Patch Release Gate

- Task contract: `.agentloop/tasks/2026-06-12-prepare-0-28-2-patch-release.md`
- Trigger:
  - The task-only verification shortcut needed a small patch release after logo and dogfood work landed.
  - Package metadata, changelog, MCP server metadata, and release docs needed to agree before GitHub/npm publishing.
- Product change:
  - Bumped package metadata to `0.28.2`.
  - Moved shortcut changes into `CHANGELOG.md` under `0.28.2`.
  - Updated release docs to identify `0.28.2` as the active patch candidate.
  - Updated `server.json` from `0.28.1` to `0.28.2`.
- Verification:
  - First release gate failed because `server.json` still listed npm package version `0.28.1`.
  - Focused fix verification: `npm test -- tests/distribution-artifacts.test.ts` passed with 1 file and 10 tests.
  - Final release gate report: `.agentloop/reports/2026-06-12-14-42-verification-report.md`.
  - Final release gate run: `.agentloop/runs/2026-06-12-14-50-verify/`.
  - Final release gate passed `npm run lint`, `npm run typecheck`, `npm test`, `npm run check:links`, `node scripts/prepublish-check.mjs`, `git diff --check`, `npm run build`, `npm run smoke:release`, `node scripts/smoke-cli.mjs`, `node dist/cli/index.js artifacts --json`, `npx --yes projscan doctor --format markdown`, `npm run dogfood:strict`, `npm publish --access public --dry-run`, and `npm pack --pack-destination /tmp --silent`.
  - Full suite passed with 51 files and 436 tests.
  - ProjScan reported A 100/100.
  - Local tarball: `/tmp/agentloopkit-0.28.2.tgz`.
  - Local tarball SHA-256: `ea34d7a9d3edefea9ba7edd447cf3e1ec85dd8b94a8d638c7906182f61705b09`.
- Post-publish proof:
  - GitHub release: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.28.2>
  - Release commit: `fda3195d9ef816ca53084170eb84ce82c342c950`.
  - CI run `27417101095` passed.
  - CLI Smoke run `27417101070` passed on Ubuntu, macOS, and Windows.
  - Publish workflow run `27417122044` passed and published `agentloopkit@0.28.2`.
  - Docker workflow run `27417122089` passed.
  - MCP Registry workflow run `27417334613` passed.
  - `npm view agentloopkit version versions --json` reported latest `0.28.2`.
  - `node dist/cli/index.js npm-status --agentloopkit --expect-current --json` reported status `current`.
  - `npm run smoke:published -- --version 0.28.2` passed.
  - GitHub release asset SHA-256 matched the local tarball SHA-256.
- Worked well:
  - Distribution artifact tests caught MCP metadata drift before publish.
  - The published-package smoke helper gave a cleaner user-path check than ad hoc `npx --package` commands from the repo.
- Improve:
  - Add a release metadata sync helper or release-check rule for `server.json` so maintainers get a faster failure than the full test suite.
  - Add streaming/progress output for long `agentloop verify` runs.

## 2026-06-12: Task-Only Verification Shortcut

- Task contract: `.agentloop/tasks/2026-06-12-add-task-only-verification-shortcut.md`
- Trigger:
  - Focused dogfood verification required `--no-test --no-lint --no-typecheck --no-build` before task contract commands could run by themselves.
  - The safe part of the workflow already required `--task-commands`; the missing piece was a shorter way to skip configured repo commands.
- Product change:
  - Added `agentloop verify --task <path> --task-commands --only-task-commands`.
  - The shortcut skips configured `test`, `lint`, `typecheck`, and `build` commands and records them under `notRun`.
  - The shortcut returns JSON option errors and runs nothing when `--task` or `--task-commands` is missing.
  - Public docs now show the explicit task path for task-command verification.
- Verification:
  - Red focused run: `npm test -- tests/verification.test.ts` failed because `--only-task-commands` was unknown.
  - Green focused run: `npm test -- tests/verification.test.ts` passed with 1 file and 36 tests.
  - Dogfood verification report: `.agentloop/reports/2026-06-12-14-16-verification-report.md`.
  - Dogfood verify run: `.agentloop/runs/2026-06-12-14-19-verify/`.
  - Task-only shortcut verification report: `.agentloop/reports/2026-06-12-14-20-verification-report.md`.
  - Task-only shortcut run: `.agentloop/runs/2026-06-12-14-22-verify/`.
  - Full verification included `npx pnpm@10.12.1 test`, lint, typecheck, build, and `npx --yes projscan doctor --format markdown`.
  - Shortcut verification ran six task commands and recorded configured `test`, `lint`, `typecheck`, and `build` as not run.
- Worked well:
  - The new flag made the dogfood loop shorter without making task Markdown executable by default.
- Improve:
  - Consider a future active-task default for `verify --task-commands`, so users do not need to paste the task path after `create-task`.

## 2026-06-12: MCP Artifact Inventory Lookup

- Task contract: `.agentloop/tasks/2026-06-12-expose-artifact-inventory-through-mcp.md`
- Trigger:
  - MCP clients could read specific reports and run evidence but still had to scrape directories to discover available local AgentLoopKit artifacts.
  - The CLI already had read-only `agentloop artifacts --json`, so MCP should expose the same metadata shape.
- Product change:
  - Added read-only MCP tool `agentloop_artifacts`.
  - The tool returns the existing artifact inventory JSON shape.
  - Added optional `type` and `latest` inputs matching the CLI inventory filters.
  - The MCP server instructions and docs now mention artifact inventory metadata.
  - No artifact content dump beyond existing metadata, writes, command execution, env reads, external APIs, uploads, version bump, or release were added.
- Verification:
  - Red focused run: `npm test -- tests/mcp-tools.test.ts` failed because `agentloop_artifacts` was missing and unknown.
  - Green focused run of the same command passed after adding the tool.
  - Focused MCP suite `npm test -- tests/mcp-tools.test.ts tests/mcp-server.test.ts` passed with 2 files and 5 tests.
  - `npm run typecheck`, `npm run lint`, `npm run check:links`, and `git diff --check` passed.
  - `npm run build` passed.
  - Full `npm test` passed with 47 files and 407 tests.
  - CLI smoke passed.
  - Packed release smoke passed.
  - Production dependency audit passed with no known vulnerabilities.
  - ProjScan reported A 100/100.
  - Dogfood verification report: `.agentloop/reports/2026-06-12-07-03-verification-report.md`.
  - Dogfood verify run: `.agentloop/runs/2026-06-12-07-07-verify/`.
  - Archived completed prior task: `.agentloop/tasks/archive/2026-06-12-expose-gate-status-through-mcp.md`.
  - Dogfood ship report: `.agentloop/reports/2026-06-12-07-07-ship-report.md`.
  - Dogfood ship run: `.agentloop/runs/2026-06-12-07-07-ship/`.
  - Dogfood PR summary: `.agentloop/handoffs/2026-06-12-07-07-pr-summary.md`.
  - Dogfood PR description: `.agentloop/handoffs/2026-06-12-07-07-pr-description.md`.
  - Ship score: 95/100 with gates passing.
- Worked well:
  - Reusing `getArtifactInventory()` and `renderArtifactInventoryJson()` kept the MCP output aligned with CLI automation output.
- Improve:
  - Consider a compact MCP status preset later if clients want one call that combines status, gates, latest artifacts, and next action.

## 2026-06-12: MCP Gate Status Lookup

- Task contract: `.agentloop/tasks/2026-06-12-expose-gate-status-through-mcp.md`
- Trigger:
  - MCP clients could read local evidence and maintainer checks but could not inspect the deterministic review gate report without shelling out to `agentloop check-gates`.
  - `check-gates` is already local-only and read-only, so the MCP surface should reuse it rather than introduce new gate logic.
- Product change:
  - Added read-only MCP tool `agentloop_check_gates`.
  - The tool returns the same gate status shape as `agentloop check-gates --json`.
  - Added optional `strict` input for clients that want warning gates to fail, matching the CLI behavior.
  - The MCP server instructions and docs now mention gate status.
  - No verification execution, write tools, GitHub posting, token handling, env reads, external APIs, uploads, version bump, or release were added.
- Verification:
  - Red focused run: `npm test -- tests/mcp-tools.test.ts` failed because `agentloop_check_gates` was missing and unknown.
  - Green focused run of the same command passed after adding the tool.
  - Focused MCP suite `npm test -- tests/mcp-tools.test.ts tests/mcp-server.test.ts` passed with 2 files and 5 tests.
  - `npm run typecheck`, `npm run lint`, `npm run check:links`, and `git diff --check` passed.
  - `npm run build` passed.
  - Full `npm test` passed with 47 files and 407 tests.
  - CLI smoke passed.
  - Packed release smoke passed.
  - Production dependency audit passed with no known vulnerabilities.
  - ProjScan reported A 100/100.
  - Dogfood verification report: `.agentloop/reports/2026-06-12-06-47-verification-report.md`.
  - Dogfood verify run: `.agentloop/runs/2026-06-12-06-51-verify/`.
  - Archived completed prior task: `.agentloop/tasks/archive/2026-06-12-expose-policy-status-through-mcp.md`.
  - Dogfood ship report: `.agentloop/reports/2026-06-12-06-51-ship-report.md`.
  - Dogfood ship run: `.agentloop/runs/2026-06-12-06-51-ship/`.
  - Dogfood PR summary: `.agentloop/handoffs/2026-06-12-06-51-pr-summary.md`.
  - Dogfood PR description: `.agentloop/handoffs/2026-06-12-06-51-pr-description.md`.
  - Ship score: 95/100 with gates passing.
- Worked well:
  - Reusing `checkGates()` made the MCP tool consistent with CLI, ship, badge, and CI-summary gate behavior.
- Improve:
  - Consider MCP access to `agentloop artifacts` next so agents can inventory local evidence without reading directories directly.

## 2026-06-12: MCP Policy Status Lookup

- Task contract: `.agentloop/tasks/2026-06-12-expose-policy-status-through-mcp.md`
- Trigger:
  - MCP clients could read policy files but could not inspect whether local policies were current, modified, missing, or extra without shelling out to the CLI.
  - `agentloop policy status --json` already had the deterministic local comparison behavior, so MCP only needed a read-only wrapper.
- Product change:
  - Added read-only MCP tool `agentloop_policy_status`.
  - The tool returns the same local policy status shape as `agentloop policy status --json`.
  - The MCP server instructions and docs now mention policy template status alongside policy reads.
  - No policy writes, migrations, command execution, env reads, external APIs, uploads, version bump, or release were added.
- Verification:
  - Red focused run: `npm test -- tests/mcp-tools.test.ts` failed because `agentloop_policy_status` was missing and unknown.
  - Green focused run of the same command passed after adding the tool.
  - Focused MCP suite `npm test -- tests/mcp-tools.test.ts tests/mcp-server.test.ts` passed with 2 files and 5 tests.
  - `npm run typecheck`, `npm run lint`, `npm run check:links`, and `git diff --check` passed.
  - `npm run build` passed.
  - Full `npm test` passed with 47 files and 407 tests.
  - CLI smoke passed.
  - Packed release smoke passed.
  - Production dependency audit passed with no known vulnerabilities.
  - ProjScan reported A 100/100.
  - Dogfood verification report: `.agentloop/reports/2026-06-12-06-28-verification-report.md`.
  - Dogfood verify run: `.agentloop/runs/2026-06-12-06-31-verify/`.
  - Archived completed prior task: `.agentloop/tasks/archive/2026-06-12-expose-maintainer-check-through-mcp.md`.
  - Dogfood ship report: `.agentloop/reports/2026-06-12-06-34-ship-report.md`.
  - Dogfood ship run: `.agentloop/runs/2026-06-12-06-34-ship/`.
  - Dogfood PR summary: `.agentloop/handoffs/2026-06-12-06-34-pr-summary.md`.
  - Dogfood PR description: `.agentloop/handoffs/2026-06-12-06-34-pr-description.md`.
  - Ship score: 95/100 with gates passing.
- Worked well:
  - Reusing `getPolicyStatus()` kept MCP behavior consistent with the existing CLI JSON output.
- Improve:
  - Keep MCP v1 read-only; if policy migration ever exists, it should remain a separate explicit CLI command, not an MCP side effect.

## 2026-06-12: MCP Maintainer Check

- Task contract: `.agentloop/tasks/2026-06-12-expose-maintainer-check-through-mcp.md`
- Trigger:
  - MCP clients could read evidence but could not ask AgentLoopKit for the deterministic maintainer reviewability checklist used by the CLI.
  - Maintainer-check is local-only and already avoids posting comments, calling GitHub, or reading tokens.
- Product change:
  - Added read-only MCP tool `agentloop_maintainer_check`.
  - The tool returns the existing maintainer-check payload with status, checks, checklist, and suggested contributor request.
  - The implementation does not change maintainer-check logic.
- Verification:
  - Red focused run: `npm test -- tests/mcp-tools.test.ts` failed because `agentloop_maintainer_check` was missing and unknown.
  - Green focused run of the same command passed after adding the tool.
  - Focused MCP suite `npm test -- tests/mcp-tools.test.ts tests/mcp-server.test.ts` passed with 2 files and 5 tests.
  - `npm run typecheck`, `npm run lint`, `npm run check:links`, and `git diff --check` passed.
  - `npm run build` passed.
  - Full `npm test` passed with 47 files and 407 tests.
  - CLI smoke passed.
  - Packed release smoke passed.
  - Production dependency audit passed with no known vulnerabilities.
  - ProjScan reported A 100/100.
  - Dogfood verification report: `.agentloop/reports/2026-06-12-06-10-verification-report.md`.
  - Dogfood verify run: `.agentloop/runs/2026-06-12-06-13-verify/`.
  - Archived completed prior task: `.agentloop/tasks/archive/2026-06-12-expose-file-intent-through-mcp.md`.
  - Dogfood ship report: `.agentloop/reports/2026-06-12-06-13-ship-report.md`.
  - Dogfood ship run: `.agentloop/runs/2026-06-12-06-13-ship/`.
  - Dogfood PR summary: `.agentloop/handoffs/2026-06-12-06-13-pr-summary.md`.
  - Dogfood PR description: `.agentloop/handoffs/2026-06-12-06-13-pr-description.md`.
  - Ship score: 92/100 with gates passing.
- Worked well:
  - The MCP command stayed as a thin read-only wrapper around the existing maintainer-check core.
- Improve:
  - Add MCP coverage for policy status only if clients need policy drift signals beyond `agentloop_list_policies` and `agentloop_read_policy`.

## 2026-06-12: MCP File Intent Lookup

- Task contract: `.agentloop/tasks/2026-06-12-expose-file-intent-through-mcp.md`
- Trigger:
  - MCP clients could inspect run summaries and details but could not ask which previous AgentLoopKit runs touched a file and why.
  - The CLI already had deterministic `agentloop intent <file>` behavior backed by the local run ledger.
- Product change:
  - Added read-only MCP tool `agentloop_file_intent`.
  - The tool accepts a repo-relative file path and returns the normalized file plus matching local run summaries.
  - The tool reads run ledger metadata only; it does not read the target file contents.
  - Matching run summaries reuse the MCP repo-relative AgentLoop artifact path rendering.
- Verification:
  - Red focused run: `npm test -- tests/mcp-tools.test.ts` failed because `agentloop_file_intent` was missing and unknown.
  - Green focused run of the same command passed after adding the tool.
  - Focused MCP suite `npm test -- tests/mcp-tools.test.ts tests/mcp-server.test.ts` passed with 2 files and 5 tests.
  - `npm run typecheck`, `npm run lint`, `npm run check:links`, and `git diff --check` passed.
  - `npm run build` passed.
  - Full `npm test` passed with 47 files and 407 tests.
  - CLI smoke passed.
  - Packed release smoke passed.
  - Production dependency audit passed with no known vulnerabilities.
  - ProjScan reported A 100/100.
  - Dogfood verification report: `.agentloop/reports/2026-06-12-05-54-verification-report.md`.
  - Dogfood verify run: `.agentloop/runs/2026-06-12-05-58-verify/`.
  - Archived completed prior task: `.agentloop/tasks/archive/2026-06-12-expose-run-details-through-mcp.md`.
  - Dogfood ship report: `.agentloop/reports/2026-06-12-05-58-ship-report.md`.
  - Dogfood ship run: `.agentloop/runs/2026-06-12-05-58-ship/`.
  - Dogfood PR summary: `.agentloop/handoffs/2026-06-12-05-58-pr-summary.md`.
  - Dogfood PR description: `.agentloop/handoffs/2026-06-12-05-58-pr-description.md`.
  - Ship score: 92/100 with gates passing.
- Worked well:
  - Existing `findFileIntent()` kept the MCP tool deterministic and small.
- Improve:
  - Consider exposing maintainer-check through MCP next, but keep the server read-only.

## 2026-06-12: MCP Run Detail Lookup

- Task contract: `.agentloop/tasks/2026-06-12-expose-run-details-through-mcp.md`
- Trigger:
  - MCP clients could list recent run ledger summaries but could not inspect one run's score JSON, changed files, or diffstat without shelling out to `agentloop show-run`.
  - The MCP server should expose the same local review evidence as the CLI while staying read-only.
- Product change:
  - Added read-only MCP tool `agentloop_show_run`.
  - The tool accepts a run id and returns one run record with metadata, score, changed files, and diffstat.
  - MCP run detail metadata now renders AgentLoop artifact paths repo-relative.
  - The tool reuses the existing run-ledger id validation and path guards.
- Verification:
  - Red focused run: `npm test -- tests/mcp-tools.test.ts` failed because `agentloop_show_run` was missing and unknown.
  - Green focused run of the same command passed after adding the tool.
  - Focused MCP suite `npm test -- tests/mcp-tools.test.ts tests/mcp-server.test.ts` passed with 2 files and 5 tests.
  - `npm run typecheck`, `npm run lint`, `npm run check:links`, and `git diff --check` passed.
  - `npm run build` passed.
  - Full `npm test` first timed out in five subprocess-heavy tests because it ran in parallel with `npm run build`.
  - Rerunning the five timed-out files alone passed with 5 files and 54 tests.
  - Rerunning full `npm test` alone passed with 47 files and 407 tests.
  - CLI smoke passed.
  - Packed release smoke passed.
  - Production dependency audit passed with no known vulnerabilities.
  - ProjScan reported A 100/100.
  - Dogfood verification report: `.agentloop/reports/2026-06-12-05-38-verification-report.md`.
  - Dogfood verify run: `.agentloop/runs/2026-06-12-05-42-verify/`.
  - First dogfood ship run: `.agentloop/runs/2026-06-12-05-42-ship/` found task hygiene warning.
  - Archived completed prior task: `.agentloop/tasks/archive/2026-06-12-expose-ship-evidence-through-mcp.md`.
  - Final dogfood ship report: `.agentloop/reports/2026-06-12-05-42-ship-report.md`.
  - Final dogfood ship run: `.agentloop/runs/2026-06-12-05-42-ship-2/`.
  - Dogfood PR summary: `.agentloop/handoffs/2026-06-12-05-42-pr-summary.md`.
  - Dogfood PR description: `.agentloop/handoffs/2026-06-12-05-42-pr-description.md`.
  - Final ship score: 92/100 with gates passing.
- Worked well:
  - `task doctor` correctly caught the stale done task before the commit.
  - Existing `readRun()` safety checks kept the MCP implementation small.
- Improve:
  - Avoid running full test and build concurrently; subprocess-heavy tests can hit timeout budgets under local load.

## 2026-06-12: MCP Ship And Run Evidence

- Task contract: `.agentloop/tasks/2026-06-12-expose-ship-evidence-through-mcp.md`
- Trigger:
  - The read-only MCP server exposed status, tasks, policies, verification reports, and handoffs, but not ship readiness reports or run ledger summaries.
  - MCP clients need the same local evidence that reviewers see in `ship`, without write access or command execution.
- Product change:
  - Added read-only MCP tool `agentloop_latest_ship_report`.
  - Added read-only MCP tool `agentloop_list_runs` with a bounded `limit` argument.
  - MCP run paths now render repo-relative paths for verification reports, ship reports, and handoffs.
  - The MCP server still performs no writes, no command execution, no API calls, and no env-file reads.
- Verification:
  - Red focused run: `npm test -- tests/mcp-tools.test.ts` failed because the new tools were missing and `agentloop_latest_ship_report` was unknown.
  - Green focused run of the same command passed after adding the tools.
  - Focused MCP suite `npm test -- tests/mcp-tools.test.ts tests/mcp-server.test.ts` passed with 2 files and 5 tests.
  - `npm run typecheck`, `npm run lint`, `npm run check:links`, `git diff --check`, and `npm run build` passed.
  - Full `npm test` passed with 47 files and 407 tests.
  - CLI smoke passed.
  - Packed release smoke passed.
  - Production dependency audit passed with no known vulnerabilities.
  - ProjScan reported A 100/100.
  - Dogfood verification report: `.agentloop/reports/2026-06-12-05-11-verification-report.md`.
  - Dogfood verify run: `.agentloop/runs/2026-06-12-05-17-verify/`.
  - Dogfood ship report: `.agentloop/reports/2026-06-12-05-17-ship-report.md`.
  - Dogfood ship run: `.agentloop/runs/2026-06-12-05-17-ship/`.
  - Dogfood PR summary: `.agentloop/handoffs/2026-06-12-05-17-pr-summary.md`.
  - Dogfood PR description: `.agentloop/handoffs/2026-06-12-05-17-pr-description.md`.
  - Ship score: 96/100 with gates passing.
- Worked well:
  - The implementation reused the existing artifact root guards and run ledger reader instead of creating new filesystem paths.
- Improve:
  - Consider a future read-only `agentloop_show_run` MCP tool if clients need full run details instead of summaries.

## 2026-06-12: Repo-Relative PR-Facing Paths

- Task contract: `.agentloop/tasks/2026-06-12-use-repo-relative-paths-in-pr-facing-markdown.md`
- Trigger:
  - Dogfooding `agentloop ship --github-comment --json` showed absolute local artifact paths in PR-facing Markdown.
  - PR comments and PR descriptions should not leak a maintainer's machine path.
- Product change:
  - `ship` reports and `ship --github-comment` now render verification, handoff, and ship report paths relative to the repo.
  - `prepare-pr` body and GitHub comment Markdown now render AgentLoop artifact paths relative to the repo.
  - JSON fields such as `shipReportPath`, `handoffPath`, and `verificationReportPath` remain unchanged for scripts.
- Verification:
  - Red focused run: `npm test -- tests/ship.test.ts tests/prepare-pr.test.ts -t "review-readiness|GitHub comment|generates a PR description"` failed because Markdown included the temp repo root.
  - Green focused run of the same command passed after display-only path normalization.
  - Affected suite `npm test -- tests/ship.test.ts tests/prepare-pr.test.ts` passed with 2 files and 6 tests.
  - `npm run typecheck`, `npm run lint`, `npm run check:links`, `git diff --check`, and `npm run build` passed.
  - Full `npm test` passed with 47 files and 407 tests.
  - CLI smoke passed.
  - Packed release smoke passed.
  - Production dependency audit passed with no known vulnerabilities.
  - ProjScan reported A 100/100.
  - Dogfood verification report: `.agentloop/reports/2026-06-12-04-51-verification-report.md`.
  - Dogfood verify run: `.agentloop/runs/2026-06-12-04-57-verify/`.
  - Dogfood ship report: `.agentloop/reports/2026-06-12-04-58-ship-report.md`.
  - Dogfood ship run: `.agentloop/runs/2026-06-12-04-58-ship/`.
  - Dogfood PR summary: `.agentloop/handoffs/2026-06-12-04-58-pr-summary.md`.
  - Dogfood PR description: `.agentloop/handoffs/2026-06-12-04-58-pr-description.md`.
  - Ship score: 96/100 with gates passing.
- Worked well:
  - Tests now protect both sides of the contract: Markdown is repo-relative, JSON path fields stay script-friendly.
- Improve:
  - Review other PR-facing Markdown commands for absolute artifact paths if new report types are added.

## 2026-06-12: Ship GitHub Comment Output

- Task contract: `.agentloop/tasks/2026-06-12-add-ship-github-comment-output.md`
- Trigger:
  - `prepare-pr --github-comment` could emit PR-comment Markdown, but CI users who only want the readiness score still had to route through PR-description generation.
  - The acceptance-layer flow should let `ship` produce the compact reviewer comment directly.
- Product change:
  - Added `agentloop ship --github-comment`.
  - Added `githubComment` to `ship --json --github-comment`.
  - Plain `ship --github-comment` prints only the comment Markdown, which keeps CI redirection clean.
  - Updated GitHub Actions and end-to-end examples to use `ship --github-comment` for readiness comments.
- Verification:
  - Red focused run: `npm test -- tests/ship.test.ts -t "GitHub comment|writes a review-readiness"` failed because `ship` did not recognize `--github-comment`.
  - Green focused run of the same command passed after adding the flag and renderer.
  - Focused suite `npm test -- tests/ship.test.ts tests/cli-docs-drift.test.ts` passed with 2 files and 4 tests.
  - `npm run typecheck`, `npm run lint`, `npm run check:links`, `git diff --check`, and `npm run build` passed.
  - Full `npm test` passed with 47 files and 407 tests.
  - CLI smoke passed and now asserts `ship --json --github-comment`.
  - Packed release smoke passed.
  - Production dependency audit passed with no known vulnerabilities.
  - ProjScan reported A 100/100.
  - Dogfood verification report: `.agentloop/reports/2026-06-12-04-30-verification-report.md`.
  - Dogfood verify run: `.agentloop/runs/2026-06-12-04-36-verify/`.
  - Dogfood ship report: `.agentloop/reports/2026-06-12-04-37-ship-report.md`.
  - Dogfood ship run: `.agentloop/runs/2026-06-12-04-37-ship/`.
  - Dogfood PR summary: `.agentloop/handoffs/2026-06-12-04-37-pr-summary.md`.
  - Dogfood PR description: `.agentloop/handoffs/2026-06-12-04-37-pr-description.md`.
  - Ship score: 96/100 with gates passing.
- Worked well:
  - The feature reuses existing ship evidence and does not introduce GitHub API, token, or posting behavior.
- Improve:
  - Consider sharing one GitHub-comment renderer between `ship` and `prepare-pr` if the two comment shapes start drifting.

## 2026-06-12: Active Task Done Shortcut

- Task contract: `.agentloop/tasks/2026-06-12-add-active-task-done-shortcut.md`
- Trigger:
  - The review-ready next action now pointed at task completion, but it required `agentloop task status <path> done`.
  - That was correct but clumsy for agents and humans closing the active task loop.
- Product change:
  - Added `agentloop task done` to mark the active task done.
  - Added `agentloop task done <path>` for explicit task completion.
  - Updated `status` and `next` to recommend the short command for clean, verified tasks in `review`.
  - Kept archive as a separate action so completion does not move files by surprise.
- Verification:
  - Red focused run: `npm test -- tests/task-state.test.ts tests/status.test.ts tests/next.test.ts -t "task done|recommends finishing an active review task|marks the active task done|marks an explicit task done|active task errors"` failed because `task done` did not exist and status/next still recommended the path-heavy command.
  - Green focused run of the same command passed after adding the shortcut and recommendation update.
  - Focused suite `npm test -- tests/task-state.test.ts tests/status.test.ts tests/next.test.ts tests/completion.test.ts tests/cli-docs-drift.test.ts` passed with 5 files and 83 tests.
  - `npm run typecheck`, `npm run lint`, `npm run check:links`, `git diff --check`, `npm test`, and `npm run build` passed.
  - CLI smoke passed and now asserts `agentloop task done --json`.
  - Packed release smoke passed.
  - Production dependency audit passed with no known vulnerabilities.
  - ProjScan reported A 100/100.
  - Dogfood verification report: `.agentloop/reports/2026-06-12-04-04-verification-report.md`.
  - Dogfood verify run: `.agentloop/runs/2026-06-12-04-11-verify/`.
  - Dogfood ship report: `.agentloop/reports/2026-06-12-04-12-ship-report.md`.
  - Dogfood ship run: `.agentloop/runs/2026-06-12-04-12-ship/`.
  - Dogfood PR summary: `.agentloop/handoffs/2026-06-12-04-12-pr-summary.md`.
  - Dogfood PR description: `.agentloop/handoffs/2026-06-12-04-12-pr-description.md`.
  - Ship score: 92/100 with gates passing.
- Worked well:
  - The command reuses the existing status update path, so task validation and file writes stay in one place.
- Improve:
  - Consider a separate active-task archive shortcut later, but keep it explicit because archiving moves files.

## 2026-06-12: Review-Ready Next Action

- Task contract: `.agentloop/tasks/2026-06-12-improve-next-action-for-review-ready-tasks.md`
- Trigger:
  - After committing the create-task activation fix, `agentloop status --json` showed a clean repo with an active task still in `review`.
  - The recommended next command was `agentloop create-task`, which could send agents into unrelated work before closing the current loop.
- Product change:
  - `status` and `next` now recommend `agentloop task status <path> done` when the active task is `review`, verification passed, and the working tree is clean.
  - Failed verification still points to `agentloop verify`.
  - Dirty working trees still point to `agentloop handoff`.
- Verification:
  - Red focused run: `npm test -- tests/status.test.ts -t "recommends finishing an active review task"` failed because the next command was `agentloop create-task`.
  - Green focused run: `npm test -- tests/status.test.ts -t "recommends finishing an active review task"` passed after updating the next-action rules.
  - Affected suite `npm test -- tests/status.test.ts tests/next.test.ts tests/task-state.test.ts` passed with 3 files and 70 tests.
  - `npm run typecheck`, `npm run lint`, `npm run check:links`, `git diff --check`, `npm test`, and `npm run build` passed.
  - CLI smoke and packed release smoke passed.
  - Production dependency audit passed with no known vulnerabilities.
  - ProjScan reported A 100/100.
  - Dogfood verification report: `.agentloop/reports/2026-06-12-03-38-verification-report.md`.
  - Dogfood verify run: `.agentloop/runs/2026-06-12-03-45-verify/`.
  - Dogfood ship report: `.agentloop/reports/2026-06-12-03-45-ship-report.md`.
  - Dogfood ship run: `.agentloop/runs/2026-06-12-03-45-ship/`.
  - Dogfood PR summary: `.agentloop/handoffs/2026-06-12-03-45-pr-summary.md`.
  - Dogfood PR description: `.agentloop/handoffs/2026-06-12-03-45-pr-description.md`.
  - Ship score: 96/100 with gates passing.
- Worked well:
  - The bug surfaced directly through AgentLoopKit's own `status` output after a clean commit.
- Improve:
  - Consider a future command that closes the task loop explicitly without forcing users to remember `task status ... done` then `task archive ...`.

## 2026-06-12: Create Task Activates New Contract

- Task contract: `.agentloop/tasks/2026-06-12-activate-newly-created-task-contracts.md`
- Trigger:
  - Dogfooding the grouped `prepare-pr` work showed that `create-task` wrote a new contract while the active task pointer still referenced an older review task.
  - `ship` and `prepare-pr` then used stale task context until `agentloop task set` corrected the pointer.
- Product change:
  - `create-task` now calls the same active-task path guard as `agentloop task set` after writing the new contract.
  - Human output includes both the created task path and active-task path.
  - JSON output includes `task` plus `activeTask` metadata.
- Verification:
  - Red focused run: `npm test -- tests/create-task.test.ts -t "sets the newly created task as active"` failed while `create-task --json` returned only `task` and left the older active pointer in place.
  - Green focused run: `npm test -- tests/create-task.test.ts -t "sets the newly created task as active"` passed after `create-task` activated the new task.
  - Affected suite `npm test -- tests/create-task.test.ts tests/task-state.test.ts` passed with 2 files and 55 tests.
  - `npm run typecheck` passed.
  - `npm run lint` passed.
  - `npm run check:links` passed.
  - `git diff --check` passed.
  - Full `npm test` passed with 47 files and 400 tests.
  - `npm run build` passed.
  - CLI smoke passed with explicit assertions for `create-task --json` `activeTask` and `task current --json`.
  - Release smoke passed against the packed tarball.
  - Production dependency audit passed with no known vulnerabilities.
  - ProjScan reported A 100/100.
  - Dogfood verification report: `.agentloop/reports/2026-06-12-03-16-verification-report.md`.
  - Dogfood verify run: `.agentloop/runs/2026-06-12-03-23-verify/`.
  - Dogfood ship report: `.agentloop/reports/2026-06-12-03-23-ship-report.md`.
  - Dogfood ship run: `.agentloop/runs/2026-06-12-03-23-ship/`.
  - Dogfood PR summary: `.agentloop/handoffs/2026-06-12-03-23-pr-summary.md`.
  - Dogfood PR description: `.agentloop/handoffs/2026-06-12-03-23-pr-description.md`.
  - Ship score: 96/100 with gates passing.
- Worked well:
  - Reusing `setActiveTask` kept the existing path and symlink guards in the write path.
- Improve:
  - Consider adding `--no-activate` later only if scripts need task creation without changing loop state.

## 2026-06-12: Grouped Prepare PR Change Areas

- Task contract: `.agentloop/tasks/2026-06-12-group-prepare-pr-changed-files-by-review-area.md`
- Trigger:
  - Dogfooding showed `prepare-pr` still rendered changed files as one flat list.
  - The product direction is review readiness, so PR bodies should help reviewers scan risk-sensitive files, source, tests, docs, AgentLoop evidence, config, CI, and other files quickly.
- Product change:
  - Extracted the PR summary change-area classifier into a shared `change-areas` helper.
  - Changed `prepare-pr` PR bodies to group changed files by review area.
  - Kept `changedFiles` JSON flat and unchanged for scripts.
- Verification:
  - Red focused run: `npm test -- tests/prepare-pr.test.ts -t "groups changed files"` failed while `prepare-pr` still rendered a flat changed-file list.
  - Green focused run: `npm test -- tests/prepare-pr.test.ts -t "groups changed files"` passed after `prepare-pr` used grouped change areas.
  - Affected suite `npm test -- tests/prepare-pr.test.ts tests/pr-summary.test.ts` passed with 2 files and 13 tests.
  - `npm run typecheck` passed.
  - `npm run lint`, `npm run check:links`, and `git diff --check` passed.
  - Full suite `npm test` passed with 47 files and 399 tests.
  - `npm run build` passed.
  - Final self-verify `node dist/cli/index.js verify --task .agentloop/tasks/2026-06-12-group-prepare-pr-changed-files-by-review-area.md --task-commands --timeout-ms 300000 --write-run --json` passed and wrote `.agentloop/reports/2026-06-12-02-33-verification-report.md` plus run `.agentloop/runs/2026-06-12-02-39-verify/`.
  - First `ship` attempt used the previous review task because the active task pointer still referenced it; corrected with `agentloop task set .agentloop/tasks/2026-06-12-group-prepare-pr-changed-files-by-review-area.md` and removed the stale ship artifacts.
  - Final ship report scored 96/100 with passing gates and wrote `.agentloop/reports/2026-06-12-02-40-ship-report.md` plus run `.agentloop/runs/2026-06-12-02-40-ship/`.
  - Final `prepare-pr --write --json` wrote `.agentloop/handoffs/2026-06-12-02-40-pr-description.md`, reused `.agentloop/runs/2026-06-12-02-40-ship/`, and generated Source, Tests, AgentLoop, and Documentation changed-file sections.
  - Final `npm run check:links`, `git diff --check`, and `agentloop task doctor --json` passed.
  - Final `npm run smoke:release` passed.
  - Production dependency audit `npx pnpm@10.12.1 audit --prod` reported no known vulnerabilities.
  - ProjScan `npx --yes projscan doctor --format markdown` reported A 100/100.
- Worked well:
  - The existing PR summary taxonomy was good enough; sharing it avoids a second reviewer-facing classification model.
- Improve:
  - Consider exposing `changeAreas` in `prepare-pr --json` only if scripts need grouped structured data.
  - Consider warning when `create-task` writes a new task but another active task remains pinned.

## 2026-06-12: Latest Run Evidence In Status

- Task contract: `.agentloop/tasks/2026-06-12-show-latest-run-evidence-in-status.md`
- Trigger:
  - `ship`, `verify --write-run`, and `handoff --write-run` can now write local ledger evidence.
  - Agents checking `agentloop status` still needed a separate `runs` call to see the newest evidence run.
- Product change:
  - Added `latestRun` to `agentloop status --json`.
  - Added a `Latest run` line to Markdown status output.
  - Added a compact `run="..."` segment to `status --brief`.
  - Kept next-action selection unchanged so run history informs the user without masking stale verification rules.
- Verification:
  - Red focused run: `npm test -- tests/status.test.ts -t "shows latest run ledger"` failed before `status` exposed run metadata.
  - Green focused run: `npm test -- tests/status.test.ts -t "shows latest run ledger"` passed after implementation.
  - Affected-suite run `npm test -- tests/status.test.ts tests/next.test.ts tests/runs.test.ts tests/cli-docs-drift.test.ts` passed with 4 files and 37 tests.
  - Built CLI smoke initially failed because same-minute `verify`, `handoff`, and `ship` runs were sorted only by minute-level timestamps.
  - Red run-order regression `npm test -- tests/runs.test.ts -t "orders same-minute"` failed before precise run ordering existed.
  - Green run-order regression `npm test -- tests/runs.test.ts -t "orders same-minute"` passed after run metadata gained precise timestamps and `listRuns` sorted by them.
  - Affected-suite rerun passed with 4 files and 38 tests after the ordering fix.
  - Full suite `npm test` passed with 47 files and 396 tests.
  - `npm run typecheck`, `npm run lint`, and `npm run check:links` passed.
  - `npm run build` passed.
  - `node scripts/smoke-cli.mjs` passed after the run-ordering fix.
  - Final full suite `npm test` passed with 47 files and 397 tests.
  - Final `npm run lint` and `npm run check:links` passed.
  - `npm run smoke:release` passed.
  - Production dependency audit `npx pnpm@10.12.1 audit --prod` reported no known vulnerabilities.
  - ProjScan `npx --yes projscan doctor --format markdown` reported A 100/100.
  - Final self-verify `node dist/cli/index.js verify --task .agentloop/tasks/2026-06-12-show-latest-run-evidence-in-status.md --task-commands --timeout-ms 300000 --write-run --json` passed and wrote `.agentloop/reports/2026-06-12-01-20-verification-report.md` plus run `.agentloop/runs/2026-06-12-01-27-verify/`.
  - Final ship report scored 92/100 and wrote `.agentloop/reports/2026-06-12-01-28-ship-report.md`.
  - Final PR description wrote `.agentloop/handoffs/2026-06-12-01-28-pr-description.md`; handoff summary is `.agentloop/handoffs/2026-06-12-01-28-pr-summary.md`.
  - `prepare-pr --write` refreshed readiness and wrote the final latest run `.agentloop/runs/2026-06-12-01-28-ship-2/`.
- Worked well:
  - The feature reused the existing run-ledger reader, including the symlink guard.
  - The built smoke test caught a cross-command same-minute ordering case that the first unit test did not cover.
- Improve:
  - Consider surfacing a one-line stale-run hint later if teams start depending on run age in status.
  - Consider making `prepare-pr` reuse an existing fresh ship run instead of writing a second same-minute ship run when nothing changed.

## 2026-06-12: Reuse Fresh Ship Run In Prepare PR

- Task contract: `.agentloop/tasks/2026-06-12-reuse-fresh-ship-run-in-prepare-pr.md`
- Trigger:
  - Dogfooding showed `prepare-pr --write` could create a second same-minute ship run immediately after `agentloop ship`.
  - The duplicate run was valid but noisy because it referenced the same task, verification report, and ship report.
- Product change:
  - `prepare-pr` now checks the local run ledger for a matching fresh ship run before creating a new one.
  - Matching requires the same active task path, current verification report, existing ship report, and same non-generated changed-file set.
  - Generated evidence under `.agentloop/reports/`, `.agentloop/runs/`, and `.agentloop/handoffs/` does not force a duplicate readiness run.
- Verification:
  - Red focused run: `npm test -- tests/prepare-pr.test.ts -t "reuses a fresh ship run"` failed with two ship runs.
  - Green focused run: `npm test -- tests/prepare-pr.test.ts -t "reuses a fresh ship run"` passed.
  - Focused suite `npm test -- tests/prepare-pr.test.ts tests/runs.test.ts` passed with 2 files and 8 tests.
  - `npm run typecheck` passed.
  - `npm run lint`, `npm run check:links`, `npm run build`, `node scripts/smoke-cli.mjs`, and `npm run smoke:release` passed.
  - Full suite `npm test` passed with 47 files and 398 tests.
  - Production dependency audit `npx pnpm@10.12.1 audit --prod` reported no known vulnerabilities.
  - ProjScan `npx --yes projscan doctor --format markdown` reported A 100/100.
  - Final self-verify `node dist/cli/index.js verify --task .agentloop/tasks/2026-06-12-reuse-fresh-ship-run-in-prepare-pr.md --task-commands --timeout-ms 300000 --write-run --json` passed and wrote `.agentloop/reports/2026-06-12-01-43-verification-report.md` plus run `.agentloop/runs/2026-06-12-01-49-verify/`.
  - Final ship report scored 96/100 and wrote `.agentloop/reports/2026-06-12-01-49-ship-report.md` plus run `.agentloop/runs/2026-06-12-01-49-ship/`.
  - Final `prepare-pr --write --json` wrote `.agentloop/handoffs/2026-06-12-01-49-pr-description.md`, reused `.agentloop/runs/2026-06-12-01-49-ship/`, and did not create a duplicate ship run.
  - Final status brief showed `run="ship 96/100"` for the active task.
- Worked well:
  - The fix reuses existing run-ledger and ship-report data rather than adding a separate cache.
- Improve:
  - Add a JSON field later that tells callers whether `prepare-pr` reused or refreshed ship evidence.

## 2026-06-12: Prepare PR Ship Evidence Source

- Task contract: `.agentloop/tasks/2026-06-12-report-prepare-pr-ship-evidence-source.md`
- Trigger:
  - After `prepare-pr` learned to reuse fresh ship runs, JSON callers still had no direct way to know whether evidence was reused or refreshed.
- Product change:
  - Added `shipEvidence.source` to `prepare-pr --json` with `reused` or `refreshed`.
  - Added `shipEvidence.runId` when the PR description is backed by a run ledger entry.
  - Kept human output unchanged.
- Verification:
  - Red focused run: `npm test -- tests/prepare-pr.test.ts` failed before `shipEvidence` existed.
  - Green focused run: `npm test -- tests/prepare-pr.test.ts` passed with 1 file and 2 tests.
  - `npm run typecheck` passed.
  - `npm run lint`, `npm run check:links`, `npm run build`, `node scripts/smoke-cli.mjs`, and `npm run smoke:release` passed.
  - Focused suite `npm test -- tests/prepare-pr.test.ts tests/cli-docs-drift.test.ts` passed with 2 files and 3 tests.
  - Full suite `npm test` passed with 47 files and 398 tests.
  - Production dependency audit `npx pnpm@10.12.1 audit --prod` reported no known vulnerabilities.
  - ProjScan `npx --yes projscan doctor --format markdown` reported A 100/100.
  - Final self-verify `node dist/cli/index.js verify --task .agentloop/tasks/2026-06-12-report-prepare-pr-ship-evidence-source.md --task-commands --timeout-ms 300000 --write-run --json` passed and wrote `.agentloop/reports/2026-06-12-02-03-verification-report.md` plus run `.agentloop/runs/2026-06-12-02-09-verify/`.
  - `agentloop task doctor` initially warned that an older completed task was still in the active task folder.
  - Archived `.agentloop/tasks/2026-06-12-add-opt-in-run-ledger-entries-for-verify-and-handoff.md` to `.agentloop/tasks/archive/2026-06-12-add-opt-in-run-ledger-entries-for-verify-and-handoff.md`; `agentloop task doctor --json` then passed with 16 checked tasks and 0 diagnostics.
  - Final ship report scored 96/100 with passing gates and wrote `.agentloop/reports/2026-06-12-02-12-ship-report.md` plus run `.agentloop/runs/2026-06-12-02-12-ship/`.
  - Final `prepare-pr --write --json` wrote `.agentloop/handoffs/2026-06-12-02-12-pr-description.md`, reused `.agentloop/runs/2026-06-12-02-12-ship/`, and reported `shipEvidence.source` as `reused`.
- Worked well:
  - The field is additive and deterministic, and it avoids making agents infer behavior from run counts.
- Improve:
  - Consider showing the evidence source in `prepare-pr --github-comment` only if reviewers ask for that detail.

## 2026-06-12: Opt-In Run Ledger Records For Verify And Handoff

- Task contract: `.agentloop/tasks/2026-06-12-add-opt-in-run-ledger-entries-for-verify-and-handoff.md`
- Trigger:
  - `agentloop ship` recorded local run history, but narrower `verify` and `handoff` flows could not create ledger entries on their own.
  - The acceptance-layer direction works better when evidence can be traced at each stage, not only at final ship time.
- Product change:
  - Added `agentloop verify --write-run`.
  - Added `agentloop summarize --write-run` and `agentloop handoff --write-run`.
  - Extended run records so `verify`, `handoff`, and `ship` can appear together in `agentloop runs`, `show-run`, and `intent`.
  - Hardened run-id directory handling so symlinked run folders cannot redirect ledger writes outside `.agentloop/runs/`.
  - Added collision-safe numeric suffixes for same-minute same-command run records.
  - Fixed `prepare-pr` section parsing after dogfooding showed only the first acceptance-criteria bullet in the generated PR body.
- Verification:
  - Red focused run: `npm test -- tests/runs.test.ts` failed before the CLI flags existed.
  - Red symlink regression: `npm test -- tests/runs.test.ts -t "rejects run directories"` failed before the path guard.
  - Red same-minute collision regression: `npm test -- tests/runs.test.ts -t "keeps same-minute"` failed before the allocator change.
  - Red prepare-pr regression: `npm test -- tests/prepare-pr.test.ts` failed before all acceptance-criteria bullets were preserved.
  - Green focused run: `npm test -- tests/prepare-pr.test.ts tests/runs.test.ts` passed with 6 tests.
  - Final focused run `npm test -- tests/runs.test.ts tests/cli-docs-drift.test.ts` passed with 6 tests.
  - Final full suite `npm test` passed with 47 test files and 395 tests.
  - `npm run typecheck`, `npm run lint`, `npm run build`, `npm run check:links`, `node scripts/smoke-cli.mjs`, and `npm run smoke:release` passed.
  - Production dependency audit `npx pnpm@10.12.1 audit --prod` reported no known vulnerabilities.
  - ProjScan `npx --yes projscan doctor --format markdown` reported A 100/100.
  - Final self-verify `node dist/cli/index.js verify --task .agentloop/tasks/2026-06-12-add-opt-in-run-ledger-entries-for-verify-and-handoff.md --task-commands --timeout-ms 300000 --write-run --json` passed and wrote `.agentloop/reports/2026-06-12-00-45-verification-report.md` plus run `.agentloop/runs/2026-06-12-00-51-verify/`.
  - Final ship report scored 92/100 and wrote `.agentloop/reports/2026-06-12-00-51-ship-report.md` plus run `.agentloop/runs/2026-06-12-00-51-ship/`.
  - Final PR description wrote `.agentloop/handoffs/2026-06-12-00-51-pr-description.md`; final handoff summary is `.agentloop/handoffs/2026-06-12-00-51-pr-summary.md`.
- Worked well:
  - The feature stayed opt-in, preserving default command behavior.
  - The same local ledger is now useful before and after `ship`.
- Improve:
  - Consider a future retention or pruning command only if `.agentloop/runs/` becomes noisy in real projects.

## 2026-06-11: Harden Doctor Markdown Output

- Task contract: `.agentloop/tasks/2026-06-11-harden-doctor-markdown-output.md`
- Trigger:
  - The Markdown-surface scan found that `agentloop doctor` still rendered check statuses, names, messages, local paths, risk-file examples, strict mode, overall status, and next-action text directly into Markdown.
  - Doctor output is often a first-run diagnostic pasted into agent context, so local values should not corrupt Markdown when they contain backticks.
- Product change:
  - Added regression coverage for a working directory path and risk-file path containing backticks.
  - Changed doctor Markdown to use the shared inline-code formatter for check rows, overall status, strict mode, and next-step commands and reasons.
  - Preserved JSON output, doctor checks, risk scanning, strict-mode semantics, and next-action selection.
- Verification:
  - Red focused test `npm test -- tests/doctor.test.ts -t "doctor human output renders"` failed before the renderer changed.
  - Focused green suite `npm test -- tests/doctor.test.ts` passed with 13 tests.
  - Full suite `npm test` passed with 42 test files and 367 tests.
  - Full self-verify `node dist/cli/index.js verify --task .agentloop/tasks/2026-06-11-harden-doctor-markdown-output.md --task-commands --timeout-ms 240000 --json` passed and wrote `.agentloop/reports/2026-06-11-19-10-verification-report.md`.
  - CLI smoke `node scripts/smoke-cli.mjs` passed.
  - Release smoke `npm run smoke:release` passed.
  - Markdown link check `npm run check:links` passed.
  - Production dependency audit `npx pnpm@10.12.1 audit --prod` reported no known vulnerabilities.
  - ProjScan `npx --yes projscan doctor --format markdown` reported A 100/100.
  - Handoff summary generated at `.agentloop/handoffs/2026-06-11-19-15-pr-summary.md`.
- Worked well:
  - The change stayed in Markdown rendering and reused the existing formatter.
- Improve:
  - Continue scanning remaining human Markdown surfaces before the planned `0.28.0` batch.

## 2026-06-11: Harden Release-Check Markdown Output

- Task contract: `.agentloop/tasks/2026-06-11-harden-release-check-markdown-output.md`
- Trigger:
  - The Markdown-surface scan found that `agentloop release-check` still rendered package labels, git metadata, release check details, paths, status values, changed-file counts, and next-action commands directly into Markdown.
  - Release-check output is maintainer-facing evidence before publish, so local values should not corrupt Markdown when they contain backticks.
- Product change:
  - Added regression coverage for package name/version labels, git branch names, check messages, and release-check paths containing backticks.
  - Changed release-check Markdown to use the shared inline-code formatter for package labels, git lines, overall status, strict mode, changed-file count, check rows, and next-action commands.
  - Preserved JSON output, release-readiness decisions, git operations, and publish safety behavior.
- Verification:
  - Red focused test `npm test -- tests/release-check.test.ts -t "renders markdown check values"` failed before the renderer changed.
  - Focused green suite `npm test -- tests/release-check.test.ts` passed with 7 tests.
  - Full suite `npm test` passed with 42 test files and 366 tests.
  - Full self-verify `node dist/cli/index.js verify --task .agentloop/tasks/2026-06-11-harden-release-check-markdown-output.md --task-commands --timeout-ms 240000 --json` passed and wrote `.agentloop/reports/2026-06-11-18-45-verification-report.md`.
  - CLI smoke `node scripts/smoke-cli.mjs` passed.
  - Release smoke `npm run smoke:release` passed.
  - Markdown link check `npm run check:links` passed.
  - Production dependency audit `npx pnpm@10.12.1 audit --prod` reported no known vulnerabilities.
  - ProjScan `npx --yes projscan doctor --format markdown` reported A 100/100.
  - Handoff summary generated at `.agentloop/handoffs/2026-06-11-18-50-pr-summary.md`.
- Worked well:
  - The change stayed in the renderer and reused the existing Markdown formatting helper.
- Improve:
  - Continue scanning remaining human Markdown surfaces before the planned `0.28.0` batch.

## 2026-06-11: Harden CI Summary Markdown Output

- Task contract: `.agentloop/tasks/2026-06-11-harden-ci-summary-markdown-output.md`
- Trigger:
  - The remaining Markdown-surface scan found that `agentloop ci-summary` still rendered local evidence titles, paths, gate details, statuses, timestamps, and next-action commands directly into Markdown.
  - CI summaries can be pasted into logs, release notes, and handoffs, so local values should not corrupt Markdown when they contain backticks.
- Product change:
  - Added regression coverage for task titles, task paths, handoff titles, gate details, and evidence statuses containing backticks.
  - Changed CI summary Markdown to use the shared inline-code formatter for generated timestamps, evidence lines, verification status, gate status, gate details, and next-action commands.
  - Preserved JSON output, evidence discovery, gate decisions, file writes, and command exit behavior.
- Verification:
  - Red focused test `npm test -- tests/ci-summary.test.ts -t "writes markdown-safe CI evidence"` failed before the renderer changed.
  - Focused green suite `npm test -- tests/ci-summary.test.ts` passed with 14 tests.
  - Full suite `npm test` passed with 42 test files and 365 tests.
  - Full self-verify `node dist/cli/index.js verify --task .agentloop/tasks/2026-06-11-harden-ci-summary-markdown-output.md --task-commands --timeout-ms 240000 --json` passed and wrote `.agentloop/reports/2026-06-11-18-24-verification-report.md`.
  - CLI smoke `node scripts/smoke-cli.mjs` passed.
  - Release smoke `npm run smoke:release` passed.
  - Markdown link check `npm run check:links` passed.
  - Production dependency audit `npx pnpm@10.12.1 audit --prod` reported no known vulnerabilities.
  - ProjScan `npx --yes projscan doctor --format markdown` reported A 100/100.
  - Handoff summary generated at `.agentloop/handoffs/2026-06-11-18-30-pr-summary.md`.
- Worked well:
  - The renderer change stayed local to `ci-summary` and reused the existing Markdown formatting helper.
- Improve:
  - Continue scanning remaining human Markdown surfaces before the planned `0.28.0` batch.

## 2026-06-11: Harden Check-Gates Markdown Output

- Task contract: `.agentloop/tasks/2026-06-11-harden-check-gates-markdown-output.md`
- Trigger:
  - The remaining Markdown-surface scan found that `agentloop check-gates` rendered gate statuses, gate names, gate messages, evidence paths, git metadata, changed-file counts, and next-action commands directly into Markdown.
  - Review gate output is often pasted into agent handoffs and CI logs, so local values should not corrupt Markdown when they contain backticks.
- Product change:
  - Added regression coverage for a task title, task path, branch name, and next-action command containing backticks.
  - Changed check-gates Markdown to use the shared inline-code formatter for gate lines, git context, overall status, strict mode, changed-file count, and next-action command.
  - Preserved JSON output, gate decisions, strict-mode behavior, and exit codes.
- Verification:
  - Red focused test `npm test -- tests/check-gates.test.ts -t "renders markdown gate values"` failed before the renderer changed.
  - Focused green suite `npm test -- tests/check-gates.test.ts` passed with 11 tests.
  - Full suite `npm test` passed with 42 test files and 364 tests.
  - Full self-verify `node dist/cli/index.js verify --task .agentloop/tasks/2026-06-11-harden-check-gates-markdown-output.md --task-commands --timeout-ms 240000 --json` passed and wrote `.agentloop/reports/2026-06-11-18-00-verification-report.md`.
  - CLI smoke `node scripts/smoke-cli.mjs` passed.
  - Release smoke `npm run smoke:release` passed.
  - Markdown link check `npm run check:links` passed.
  - Production dependency audit `npx pnpm@10.12.1 audit --prod` reported no known vulnerabilities.
  - ProjScan `npx --yes projscan doctor --format markdown` reported A 100/100.
  - Handoff summary generated at `.agentloop/handoffs/2026-06-11-18-06-pr-summary.md`.
- Worked well:
  - The change stayed in the renderer and did not touch gate evaluation.
- Improve:
  - Continue scanning remaining human Markdown surfaces before the planned `0.28.0` batch.

## 2026-06-11: Harden Artifacts Markdown Output

- Task contract: `.agentloop/tasks/2026-06-11-harden-artifacts-markdown-output.md`
- Trigger:
  - The remaining Markdown-surface scan found that `agentloop artifacts` rendered task statuses, task titles, artifact titles, artifact paths, and verification statuses directly into Markdown.
  - The output is meant for humans, agents, and CI logs, so local artifact metadata should not break Markdown when it contains backticks.
- Product change:
  - Added a regression test for artifact titles, task statuses, task paths, HTML report paths, and badge paths containing backticks.
  - Changed artifact inventory Markdown to use the shared inline-code formatter for task counts, latest task lines, verification lines, named artifact lines, and path artifact lines.
  - Preserved JSON output and artifact discovery behavior.
- Verification:
  - Red focused test `npm test -- tests/artifacts.test.ts -t "renders markdown inventory values"` failed before the renderer changed.
  - Focused green suite `npm test -- tests/artifacts.test.ts` passed with 14 tests.
  - Full suite `npm test` passed with 42 test files and 363 tests.
  - Full self-verify `node dist/cli/index.js verify --task .agentloop/tasks/2026-06-11-harden-artifacts-markdown-output.md --task-commands --timeout-ms 240000 --json` passed and wrote `.agentloop/reports/2026-06-11-17-34-verification-report.md`.
  - Handoff summary generated at `.agentloop/handoffs/2026-06-11-17-40-pr-summary.md`.
  - CLI smoke `node scripts/smoke-cli.mjs` passed after a fresh serial build.
  - Release smoke `npm run smoke:release` passed.
  - Markdown link check `npm run check:links` passed.
  - Production dependency audit `npx pnpm@10.12.1 audit --prod` reported no known vulnerabilities.
  - ProjScan `npx --yes projscan doctor --format markdown` reported A 100/100.
- Worked well:
  - The existing shared Markdown formatter handled this surface without adding a parser or changing artifact data.
- Improve:
  - Continue scanning `check-gates` human output after this slice lands.
  - Avoid running `node scripts/smoke-cli.mjs` in parallel with commands that rebuild and clean `dist`.

## 2026-06-11: Harden Status And Next Markdown Output

- Task contract: `.agentloop/tasks/2026-06-11-harden-status-next-markdown-output.md`
- Trigger:
  - The Markdown report-surface scan found that `agentloop status` and `agentloop next` rendered local task titles, statuses, paths, git metadata, project names, commands, and working-tree values directly into Markdown.
  - Agents often paste these outputs into handoffs, so backticks in local values should not corrupt the rendered evidence.
- Product change:
  - Added regression tests for `status` and `next` output when task titles, task statuses, task paths, and project names contain backticks.
  - Changed `status` Markdown to use the shared inline-code formatter for project, git, task, report, command, working-tree, and command-list values.
  - Changed `next` Markdown to use the shared inline-code formatter for task, report, command, and working-tree values.
  - Preserved JSON output, brief status output, next-action selection, and normalized verification status parsing.
- Verification:
  - Red focused tests failed before the renderer changed:
    - `npm test -- tests/status.test.ts -t "renders status markdown values"`
    - `npm test -- tests/next.test.ts -t "renders next markdown values"`
  - Focused green suite `npm test -- tests/status.test.ts tests/next.test.ts` passed with 30 tests.
  - Full suite `npm test` passed with 42 test files and 362 tests.
  - Full self-verify `node dist/cli/index.js verify --task .agentloop/tasks/2026-06-11-harden-status-next-markdown-output.md --task-commands --timeout-ms 240000 --json` passed and wrote `.agentloop/reports/2026-06-11-17-09-verification-report.md`.
  - Handoff summary generated at `.agentloop/handoffs/2026-06-11-17-18-pr-summary.md`.
  - CLI smoke `node scripts/smoke-cli.mjs` passed.
  - Release smoke `npm run smoke:release` passed.
  - Markdown link check `npm run check:links` passed.
  - Production dependency audit `npx pnpm@10.12.1 audit --prod` reported no known vulnerabilities.
  - ProjScan `npx --yes projscan doctor --format markdown` reported A 100/100.
- Worked well:
  - The shared Markdown helper kept this to display rendering and avoided changes to JSON contracts or task selection.
- Improve:
  - Continue scanning remaining Markdown surfaces such as gate output and artifact inventories before the planned `0.28.0` batch.

## 2026-06-11: Harden Release-Note Metadata Markdown Output

- Task contract: `.agentloop/tasks/2026-06-11-harden-release-note-metadata-markdown-output.md`
- Trigger:
  - The report-surface scan found that release notes rendered package names, versions, range labels, branch names, commit IDs, and AgentLoop evidence values directly into Markdown.
  - Release-note output is reviewer-facing evidence, and refs, package metadata, task titles, and artifact paths can contain punctuation such as backticks.
- Product change:
  - Added a regression test for release-note metadata and AgentLoop evidence values containing backticks.
  - Changed release-note metadata and evidence rendering to use the shared inline-code formatter.
  - Preserved JSON output, git ref validation, range selection, changelog parsing, and publishing behavior.
- Verification:
  - Red focused test `npm test -- tests/release-notes.test.ts -t "escapes release-note metadata"` failed before the renderer changed.
  - Focused green test passed after the renderer change.
  - Adjacent suite `npm test -- tests/release-notes.test.ts` passed with 14 tests.
  - Full suite `npm test` passed with 42 test files and 360 tests.
  - Full self-verify `node dist/cli/index.js verify --task .agentloop/tasks/2026-06-11-harden-release-note-metadata-markdown-output.md --task-commands --timeout-ms 240000 --json` passed and wrote `.agentloop/reports/2026-06-11-16-48-verification-report.md`.
  - CLI smoke `node scripts/smoke-cli.mjs` passed.
  - Release smoke `npm run smoke:release` passed.
  - Markdown link check `npm run check:links` passed.
  - Production dependency audit `npx pnpm@10.12.1 audit --prod` reported no known vulnerabilities.
  - ProjScan `npx --yes projscan doctor --format markdown` reported A 100/100.
- Worked well:
  - The existing shared Markdown helper kept the change small and consistent with the CI metadata and path-label hardening.
- Improve:
  - Continue scanning status, gate, and artifact inventory Markdown before the `0.28.0` release batch.

## 2026-06-11: Harden CI Metadata Markdown Output

- Task contract: `.agentloop/tasks/2026-06-11-harden-ci-metadata-markdown-output.md`
- Trigger:
  - The Markdown report-surface scan found that verification reports and CI summaries rendered allowlisted CI metadata values directly into Markdown.
  - CI workflow names, refs, and URLs are trusted only as local provenance evidence and can contain Markdown punctuation such as backticks.
- Product change:
  - Added focused regressions for GitHub Actions metadata values containing backticks in verification reports and CI summaries.
  - Changed CI metadata rendering to use the shared inline-code formatter for workflow, event, ref, commit, run URL, and run attempt values.
  - Kept provider labels plain because they are fixed internal labels.
- Verification:
  - Red focused tests failed before the renderer changed:
    - `npm test -- tests/verification.test.ts -t "uses markdown-safe inline code for CI metadata"`
    - `npm test -- tests/ci-summary.test.ts -t "writes markdown-safe CI metadata"`
  - Focused green tests passed after the renderer change.
  - Adjacent suite `npm test -- tests/verification.test.ts tests/ci-summary.test.ts` passed with 43 tests.
  - Full suite `npm test` passed with 42 test files and 359 tests.
  - Full self-verify `node dist/cli/index.js verify --task .agentloop/tasks/2026-06-11-harden-ci-metadata-markdown-output.md --task-commands --timeout-ms 240000 --json` passed and wrote `.agentloop/reports/2026-06-11-16-27-verification-report.md`.
  - CLI smoke `node scripts/smoke-cli.mjs` passed.
  - Release smoke `npm run smoke:release` passed.
  - Markdown link check `npm run check:links` passed.
  - Production dependency audit `npx pnpm@10.12.1 audit --prod` reported no known vulnerabilities.
  - ProjScan `npx --yes projscan doctor --format markdown` reported A 100/100.
- Worked well:
  - The change reused the shared Markdown helper and did not change CI provider detection, JSON output, command execution, or environment access.
- Improve:
  - Continue reviewing local evidence renderers that combine headings, paths, and user-supplied titles before the `0.28.0` release batch.

## 2026-06-11: Harden npm Status Markdown Version Labels

- Task contract: `.agentloop/tasks/2026-06-11-harden-npm-status-markdown-version-labels.md`
- Trigger:
  - After extracting shared Markdown formatting, a report-surface scan found that `npm-status` still rendered local, latest, and registry version labels with fixed inline backticks.
  - Captured registry JSON is local evidence and can contain malformed strings.
- Product change:
  - Added a regression test for local, latest, and registry version strings containing backticks.
  - Changed npm-status Markdown to use the shared inline-code formatter for package and version labels.
  - Updated changelog, backlog, dogfood, and decision notes.
- Verification:
  - Red focused test: `npm test -- tests/npm-status.test.ts -t "escapes npm-status version labels"` failed before the renderer changed.
  - Focused green test: `npm test -- tests/npm-status.test.ts -t "escapes npm-status version labels"` passed after the renderer change.
  - Adjacent suite: `npm test -- tests/npm-status.test.ts` passed.
  - Full suite: `npm test` passed with 42 test files and 357 tests.
  - Full self-verify: `node dist/cli/index.js verify --task .agentloop/tasks/2026-06-11-harden-npm-status-markdown-version-labels.md --task-commands --timeout-ms 240000 --json` passed and wrote `.agentloop/reports/2026-06-11-16-07-verification-report.md`.
  - CLI smoke: `node scripts/smoke-cli.mjs` passed.
  - Release smoke: `npm run smoke:release` passed.
- Worked well:
  - The change reused the shared Markdown helper and did not change registry lookup, package-name validation, version validation, or npm command execution.
- Improve:
  - Keep scanning report surfaces that include local or captured external evidence before cutting `0.28.0`.

## 2026-06-11: Extract Markdown Inline-Code Formatter

- Task contract: `.agentloop/tasks/2026-06-11-extract-markdown-inline-code-formatter.md`
- Trigger:
  - Verification reports, PR summaries, and release notes had the same backtick-aware inline-code rendering logic after the Markdown-hardening pass.
  - The duplicated code raised maintenance risk without adding product value.
- Product change:
  - Added `src/core/markdown-format.ts` with shared `inlineCode`, `fencedCodeBlock`, and `longestBacktickRun` helpers.
  - Added a focused test suite for normal labels, labels containing backticks, and padding edge cases.
  - Updated verification reports, PR summaries, and release notes to use the shared helper.
- Verification:
  - Red helper test: `npm test -- tests/markdown-format.test.ts` failed before the helper module existed.
  - Helper suite: `npm test -- tests/markdown-format.test.ts` passed.
  - Adjacent suites: `npm test -- tests/verification.test.ts tests/pr-summary.test.ts tests/release-notes.test.ts` passed.
  - A full-suite run exposed a false timeout in CLI subprocess error tests that used a hard 5-second limit. The affected `agent-installation` and `create-task` tests now use a shared `CLI_PROCESS_TIMEOUT_MS`.
  - Affected CLI test suites: `npm test -- tests/agent-installation.test.ts tests/create-task.test.ts` passed.
  - Full suite: `npm test` passed with 42 test files and 356 tests.
  - Full self-verify: `node dist/cli/index.js verify --task .agentloop/tasks/2026-06-11-extract-markdown-inline-code-formatter.md --task-commands --timeout-ms 240000 --json` passed and wrote `.agentloop/reports/2026-06-11-15-51-verification-report.md`.
  - CLI smoke: `node scripts/smoke-cli.mjs` passed.
  - Release smoke: `npm run smoke:release` passed.
- Worked well:
  - The refactor stayed behind existing renderers and did not change command execution, git parsing, artifact writes, or report formats beyond using the same delimiter function.
- Improve:
  - Keep future Markdown helpers small and evidence-oriented. Avoid introducing a Markdown parser unless a real rendering need appears.

## 2026-06-11: Harden Release-Note File Path Labels

- Task contract: `.agentloop/tasks/2026-06-11-harden-release-note-file-path-labels.md`
- Trigger:
  - After hardening PR summary path labels, the next Markdown surface review found that release notes still rendered changed-file and working-tree paths with fixed inline backticks.
  - Repository paths are release evidence and can legally include backticks.
- Product change:
  - Added a regression test covering a changed file path and an uncommitted working-tree path that both contain backticks.
  - Changed release-note path labels to use inline-code delimiters longer than any backtick run in the path.
  - Updated release-note docs, changelog, backlog, and decision notes.
- Verification:
  - Red focused test: `npm test -- tests/release-notes.test.ts -t "escapes release-note file path labels"` failed before the renderer changed.
  - Focused green test: `npm test -- tests/release-notes.test.ts -t "escapes release-note file path labels"` passed after the renderer change.
  - Adjacent suite: `npm test -- tests/release-notes.test.ts` passed.
  - Full self-verify: `node dist/cli/index.js verify --task .agentloop/tasks/2026-06-11-harden-release-note-file-path-labels.md --task-commands --timeout-ms 240000 --json` passed and wrote `.agentloop/reports/2026-06-11-15-30-verification-report.md`.
  - CLI smoke: `node scripts/smoke-cli.mjs` passed.
  - Release smoke: `npm run smoke:release` passed.
- Worked well:
  - The fix stayed in the deterministic release-note renderer and did not change git range selection, status parsing, publishing behavior, or artifact writes.
- Improve:
  - Consider extracting shared Markdown inline-code helpers after one more renderer uses the same delimiter pattern.
  - Use a longer verify timeout for full-suite dogfood runs on slow or busy machines; the full suite can exceed 120 seconds.

## 2026-06-11: Harden PR Summary Changed-File Paths

- Task contract: `.agentloop/tasks/2026-06-11-harden-pr-summary-changed-file-paths.md`
- Trigger:
  - After hardening verification report Markdown delimiters, a handoff review found that PR summaries still rendered git file paths with fixed inline backticks.
  - Repository paths are local evidence and can legally include backticks.
- Product change:
  - Added a regression test for a changed file path containing a backtick.
  - Changed PR summary `Changed Files` and `Change Areas` path labels to use inline-code delimiters longer than any backtick run in the path.
  - Updated PR summary docs, changelog, backlog, and decision notes.
- Verification:
  - Red focused test: `npm test -- tests/pr-summary.test.ts -t "escapes changed file paths"` failed before the path renderer changed.
  - Focused green test: `npm test -- tests/pr-summary.test.ts -t "escapes changed file paths"` passed after the renderer change.
  - Adjacent suite: `npm test -- tests/pr-summary.test.ts` passed.
  - Full self-verify: `node dist/cli/index.js verify --task .agentloop/tasks/2026-06-11-harden-pr-summary-changed-file-paths.md --task-commands --timeout-ms 120000 --json` passed and wrote `.agentloop/reports/2026-06-11-15-06-verification-report.md`.
  - Release smoke: `npm run smoke:release` passed.
- Worked well:
  - The fix stayed in the deterministic summary renderer and did not change git status parsing or file-area classification.
- Improve:
  - Review release-note changed-file rendering for the same delimiter pattern in a later focused slice.

## 2026-06-11: Harden Verification Report Command Code Spans

- Task contract: `.agentloop/tasks/2026-06-11-harden-verification-report-command-code-spans.md`
- Trigger:
  - After fixing report code fences, an adjacent report-rendering review found that command labels still used fixed inline backticks.
  - Configured command strings can contain backticks, especially `node -e` snippets and shell examples.
- Product change:
  - Added a regression test for a failing verification command whose command string contains backticks.
  - Changed verification report command labels so failure summaries and full command sections use inline-code delimiters longer than any backtick run in the command string.
  - Updated verification-report docs, changelog, backlog, and decision notes.
- Verification completed so far:
  - Red focused test: `npm test -- tests/verification.test.ts -t "escapes command labels"` failed before the inline-code renderer existed.
  - Focused green test: `npm test -- tests/verification.test.ts -t "escapes command labels"` passed after the renderer change.
  - Adjacent suite: `npm test -- tests/verification.test.ts` passed.
- Final verification completed:
  - `npm run lint`: pass.
  - `npm run typecheck`: pass.
  - `npm test`: 41 files, 351 tests passed.
  - `npm run check:links`: pass, 895 Markdown files checked.
  - `npm run build`: pass.
  - `git diff --check`: pass.
  - `npx --yes projscan doctor --format markdown`: A, 100/100.
  - `npx pnpm@10.12.1 audit --prod`: pass, no known production vulnerabilities.
  - `node scripts/smoke-cli.mjs`: pass.
  - `npm run smoke:release`: pass.
  - AgentLoop task verification with `--task-commands`: pass.
- Verification report: `.agentloop/reports/2026-06-11-14-50-verification-report.md`
- Handoff summary: `.agentloop/handoffs/2026-06-11-14-53-pr-summary.md`
- Worked well:
  - The change reuses the same delimiter-length idea as command-output fences, so report rendering now treats command text and command output consistently.
- Improve:
  - Consider extracting shared Markdown rendering helpers if another report surface needs dynamic delimiters.

## 2026-06-11: Harden Verification Report Markdown Fences

- Task contract: `.agentloop/tasks/2026-06-11-harden-verification-report-markdown-fences.md`
- Trigger:
  - The maintainer asked for continued bug, improvement, and security passes.
  - A report-security review found that verification command output could contain Markdown fence markers.
- Product change:
  - Added a regression test for failed command output that prints triple backticks and a forged heading.
  - Changed verification report rendering so failure summaries and full command output use fences longer than any backtick run in the output.
  - Updated verification-report docs, changelog, backlog, and decisions.
- Verification completed so far:
  - Red focused test: `npm test -- tests/verification.test.ts -t "uses longer markdown fences"` failed with fixed triple-backtick fences.
  - Focused green test: `npm test -- tests/verification.test.ts -t "uses longer markdown fences"` passed after the renderer change.
  - Adjacent suite: `npm test -- tests/verification.test.ts` passed.
- Final verification completed:
  - `npm run lint`: pass.
  - `npm run typecheck`: pass.
  - `npm test`: 41 files, 350 tests passed.
  - `npm run check:links`: pass, 892 Markdown files checked.
  - `npm run build`: pass.
  - `git diff --check`: pass.
  - `npx --yes projscan doctor --format markdown`: A, 100/100.
  - `npx pnpm@10.12.1 audit --prod`: pass, no known production vulnerabilities.
  - `node scripts/smoke-cli.mjs`: pass.
  - `npm run smoke:release`: pass.
  - AgentLoop task verification with `--task-commands`: pass.
- Verification report: `.agentloop/reports/2026-06-11-14-33-verification-report.md`
- Handoff summary: `.agentloop/handoffs/2026-06-11-14-36-pr-summary.md`
- Task hygiene:
  - Archived stale completed task `.agentloop/tasks/2026-06-11-run-extended-0-28-0-launch-hardening-queue.md` after `task doctor` flagged it.
  - `agentloop task doctor --json`: pass after archival.
  - `agentloop check-gates --json`: pass after archival.
- Worked well:
  - The fix stayed at the Markdown rendering boundary and did not mutate command output.
- Improve:
  - Consider adding a packed-release smoke assertion for Markdown-fence-safe report output if this report surface changes again.

## 2026-06-11: Product Hardening And Security Pass

- Task contract: `.agentloop/tasks/2026-06-11-expand-smoke-coverage-for-setup-and-nested-command-flows.md`
- Trigger:
  - The maintainer set a focused goal to spend the next two hours improving the product, finding bugs, and running security passes.
  - Recent workspace-discovery fixes needed packaged-CLI smoke coverage, not only unit tests.
- Product change:
  - Extended `scripts/smoke-cli.mjs` to cover missing config JSON errors and nested working-directory use for `status`, `create-task`, `verify`, `handoff`, `check-gates`, `policy`, and `install-agent`.
  - Changed `scripts/smoke-packed-release.mjs` so child processes use an allowlisted environment instead of inheriting token-like variables from the parent shell.
  - Changed `agentloop npm-status --registry-json` to reject `.env` and `.env.*` paths before reading captured registry JSON.
  - Updated npm-status docs, CLI reference, generated harness guidance, changelog, and backlog.
- Verification completed:
  - Red focused checks:
    - `npm test -- tests/distribution-artifacts.test.ts` failed before smoke coverage existed.
    - `npm test -- tests/release-smoke.test.ts` failed before `buildChildEnv` existed.
    - `npm test -- tests/npm-status.test.ts` failed because `.env` was read and reported as invalid JSON.
  - Focused green checks:
    - `npm test -- tests/distribution-artifacts.test.ts tests/release-smoke.test.ts tests/npm-status.test.ts`
    - `node scripts/smoke-cli.mjs`
    - `npm run smoke:release`
    - `npm run check:links`
  - Full checks:
    - `npm run lint`: pass.
    - `npm run typecheck`: pass.
    - `npm test`: 41 files, 349 tests passed.
    - `npm run check:links`: pass, 889 Markdown files checked.
    - `npx pnpm@10.12.1 audit --prod`: pass, no known production vulnerabilities.
    - `npx --yes projscan doctor --format markdown`: A, 100/100.
    - `git diff --check`: pass.
    - `npm run build`: pass.
    - `node scripts/smoke-cli.mjs`: pass.
    - `npm run smoke:release`: pass.
  - AgentLoop task verification with `--task-commands`: pass.
- Verification report: `.agentloop/reports/2026-06-11-14-03-verification-report.md`
- Handoff summary: `.agentloop/handoffs/2026-06-11-14-08-pr-summary.md`
- Worked well:
  - `projscan` caught a test fixture value that looked like a hardcoded secret before commit.
  - The smoke script exposed a macOS `/var` versus `/private/var` realpath issue in the assertion, which was fixed inside the smoke helper.
  - GitHub Actions caught a Windows-only path separator issue in the nested task assertion after the first push; the smoke script now normalizes reported task paths before comparison.
- Improve:
  - Keep adding packaged-CLI smoke assertions for flows that users run through `npx`, especially when unit tests cover TypeScript sources only.

## 2026-06-11: Run 0.28.0 Launch-Quality Sprint

- Task contract: `.agentloop/tasks/2026-06-11-run-0-28-0-launch-quality-sprint.md`
- Trigger:
  - The maintainer asked to batch ongoing work for a later `0.28.0` release instead of cutting many small versions.
  - The approved sprint focused on README clarity, cross-platform smoke CI, read-only evidence inventory, generated first-run guidance, and release-readiness docs.
- Product change:
  - Simplified the npm-facing README and moved detailed command behavior into `docs/cli-reference.md`.
  - Added `.github/workflows/smoke.yml` and `scripts/smoke-cli.mjs` to exercise the built CLI on Ubuntu, macOS, and Windows.
  - Added read-only `agentloop artifacts` and `agentloop artifacts --json`.
  - Improved generated harness guidance with a risk-aware first task example and task-linked verification.
  - Updated changelog, roadmap, release-status docs, launch checklist, final handoff, decisions, backlog, and internal product-cycle notes.
- Verification completed:
  - Red docs behavior checks before implementation:
    - `npx vitest run tests/distribution-artifacts.test.ts` failed on missing `.github/workflows/smoke.yml`.
    - `npx vitest run tests/init.test.ts` failed on missing first-run guidance.
  - Focused green checks:
    - `npx vitest run tests/distribution-artifacts.test.ts`
    - `npx vitest run tests/artifacts.test.ts tests/init.test.ts`
  - Full checks:
    - `npm test`: 37 files, 306 tests passed.
    - `npm run lint`: pass.
    - `npm run typecheck`: pass.
    - `npm run check:links`: pass, 873 Markdown files checked.
    - `npm run build`: pass.
    - `git diff --check`: pass.
    - `npm run smoke:release`: pass.
    - `node scripts/smoke-cli.mjs`: pass.
    - `node dist/cli/index.js artifacts --json`: pass.
    - `npx --yes projscan doctor --format markdown`: A, 100/100.
  - AgentLoop task verification with `--task-commands`: pass.
- Verification report: `.agentloop/reports/2026-06-11-11-06-verification-report.md`
- Handoff summary: `.agentloop/handoffs/2026-06-11-11-10-pr-summary.md`
- Worked well:
  - Sub-agents handled disjoint smoke-CI and artifacts-command slices while the main session kept README and generated guidance coherent.
  - `agentloop artifacts --json` immediately made the repo's evidence inventory visible without reading `.env` contents or mutating files.
- Improve:
  - The first handoff was generated before this dogfood entry and task archival; regenerate handoff after the final docs/status cleanup when preparing the push.

## 2026-06-11: Guard Task Lifecycle Symlink Escapes

- Task contract: `.agentloop/tasks/archive/2026-06-11-guard-task-lifecycle-symlink-escapes.md`
- Trigger:
  - After task artifact path hardening, the task lifecycle layer still had its own lexical containment helper.
  - `task show`, `task set`, `task status`, `task archive`, and stale active-task state could follow a symlinked task subdirectory outside `.agentloop/tasks/`.
- Product change:
  - Changed task lifecycle path validation to use the shared symlink-aware containment helpers.
  - Kept normal repo-relative display paths by limiting realpath normalization to the containment check.
  - Added tests for read, set, status, archive, stale active state, and CLI JSON errors through a symlinked task path.
  - Updated README, task-contract docs, backlog, and the unreleased changelog.
- Verification completed:
  - Red focused test first: `npm test -- tests/task-state.test.ts` failed because outside task files were read and pinned through the symlink.
  - Focused green test: `npm test -- tests/task-state.test.ts`
  - Adjacent path suites: `npm test -- tests/create-task.test.ts tests/verification.test.ts`
  - AgentLoop task verification with `--task-commands`, including full `npm test`, lint, typecheck, markdown links, build, `git diff --check`, and `npx --yes projscan doctor --format markdown`
- Verification report: `.agentloop/reports/2026-06-11-06-51-verification-report.md`
- Handoff summary: `.agentloop/handoffs/2026-06-11-06-52-pr-summary.md`
- Worked well:
  - The first fix exposed a macOS realpath/display-path regression before commit, so containment and display paths were separated cleanly.
- Improve:
  - Consider centralizing all task path resolution behind one exported helper once the safety surface settles.

## 2026-06-11: Guard Task Path Symlink Escapes

- Task contract: `.agentloop/tasks/archive/2026-06-11-guard-create-task-output-symlink-escapes.md`
- Trigger:
  - During the bug pass, `create-task --out` was found to reject lexical outside paths but not resolved symlink escapes.
  - Diff review found the same issue for explicit task artifact reads, such as `verify --task`.
  - A symlinked subdirectory inside `.agentloop/tasks/` could redirect a task write or task read outside the configured task directory.
- Product change:
  - Added symlink-aware existing-ancestor normalization to shared filesystem helpers.
  - Reused the helper in artifact output validation.
  - Updated task contract output validation to reject resolved paths outside the configured task directory.
  - Updated explicit artifact path and verification task-path validation to reject symlink-escaped reads.
  - Added CLI regression coverage for `create-task --out .agentloop/tasks/<symlink>/file.md --json`.
  - Added verification regression coverage for `verify --task .agentloop/tasks/<symlink>/file.md --json` and task-command execution.
  - Updated README, task-contract docs, verification docs, backlog, and the unreleased changelog.
- Verification completed:
  - Red focused test first: `npm test -- tests/create-task.test.ts` failed because the command exited `0` through the symlink.
  - Red verification tests: `npm test -- tests/verification.test.ts` failed because verification read and ran through the symlink.
  - Focused green tests: `npm test -- tests/create-task.test.ts` and `npm test -- tests/verification.test.ts`
  - Adjacent artifact output tests: `npm test -- tests/html-report.test.ts tests/badge.test.ts tests/ci-summary.test.ts tests/release-notes.test.ts`
  - AgentLoop task verification with `--task-commands`, including full `npm test`, lint, typecheck, markdown links, build, `git diff --check`, and `npx --yes projscan doctor --format markdown`
- Verification report: `.agentloop/reports/2026-06-11-06-42-verification-report.md`
- Handoff summary: `.agentloop/handoffs/2026-06-11-06-44-pr-summary.md`
- Worked well:
  - The red test reproduced a real write-through-symlink failure before production code changed.
  - The fix reused the same containment model as output artifact paths instead of inventing a second rule.
- Improve:
  - Add packed-release smoke coverage for the symlink case if release smoke time stays acceptable.

## 2026-06-11: Point Gates To Task Doctor For Hygiene Warnings

- Task contract: `.agentloop/tasks/2026-06-11-point-gates-to-task-doctor-for-hygiene-warnings.md`
- Trigger:
  - `agentloop check-gates` surfaced `task-hygiene` warnings, but still recommended `agentloop handoff` when task, verification, and handoff evidence were already present.
  - That made the warning visible but did not send agents to the command that provides the actual cleanup checklist.
- Product change:
  - Changed gate next-action selection so task-hygiene warnings recommend `agentloop task doctor` after required task, verification, and handoff evidence exists.
  - Preserved higher-priority next actions for missing task contracts, failed verification reports, and missing handoffs.
  - Updated gate docs and the unreleased changelog.
  - No task files are archived, deleted, rewritten, or auto-fixed by `check-gates`.
- Verification completed:
  - Red focused test first: `npm test -- tests/check-gates.test.ts tests/task-state.test.ts` failed because the next action was still `agentloop handoff`.
  - Focused green test: `npm test -- tests/check-gates.test.ts tests/task-state.test.ts`
  - Full `npm test`
  - `npm run lint`
  - `npm run typecheck`
  - `npm run check:links`
  - `npm run build`
  - `git diff --check`
  - `npx --yes projscan doctor --format markdown`
- Verification report: `.agentloop/reports/2026-06-11-06-26-verification-report.md`
- Handoff summary: `.agentloop/handoffs/2026-06-11-06-28-pr-summary.md`
- Worked well:
  - The behavior change stayed inside the existing deterministic `chooseNextAction` order.
- Improve:
  - Consider whether `ci-summary` should mention the recommended gate next action more prominently.

## 2026-06-11: Add Task Hygiene Gate

- Task contract: `.agentloop/tasks/2026-06-11-add-task-hygiene-gate.md`
- Trigger:
  - `agentloop task doctor` reports stale, missing, legacy, unsupported, and terminal task-status issues, but `agentloop check-gates` did not surface those diagnostics during review evidence checks.
  - Reviewers and agents could pass gate evidence while the active task folder still needed cleanup.
- Product change:
  - Added a read-only `task-hygiene` gate to `agentloop check-gates`.
  - The gate passes when `agentloop task doctor` has no diagnostics.
  - The gate warns when task-folder diagnostics exist and points users to `agentloop task doctor`.
  - Default gates keep warning exit behavior; `--strict` fails when task hygiene warns.
  - Updated README, gate docs, getting-started docs, badge docs, and generated harness wording.
  - No task files are archived, deleted, rewritten, or auto-fixed by the gate.
- Verification completed:
  - Red focused test first: `npm test -- tests/check-gates.test.ts tests/task-state.test.ts` failed because `task-hygiene` did not exist and terminal task diagnostics did not affect gate status.
  - Focused green test: `npm test -- tests/check-gates.test.ts tests/task-state.test.ts`
  - Full `npm test`
  - `npm run lint`
  - `npm run typecheck`
  - `npm run check:links`
  - `npm run build`
  - `git diff --check`
  - `npx --yes projscan doctor --format markdown`
- Verification report: `.agentloop/reports/2026-06-11-06-17-verification-report.md`
- Handoff summary: `.agentloop/handoffs/2026-06-11-06-18-pr-summary.md`
- Worked well:
  - Reusing `inspectTaskDirectory` kept `check-gates` aligned with the existing task doctor behavior without a second parser.
- Improve:
  - Consider exposing diagnostic counts in `ci-summary` gate sections if CI users need a compact task-hygiene signal.

## 2026-06-11: Cover Invalid Artifact Output Extensions

- Task contract: `.agentloop/tasks/2026-06-11-cover-invalid-artifact-output-extensions.md`
- Trigger:
  - The output-path resolver rejected wrong extensions, but the CLI regression suite only covered paths outside the configured artifact directories.
  - Because public docs describe the extension requirement, the CLI boundary needed explicit test coverage.
- Product change:
  - Added CLI tests for `agentloop report --out` with a non-`.html` path inside `.agentloop/reports/`.
  - Added CLI tests for `agentloop badge --out` with a non-`.svg` path inside `.agentloop/reports/`.
  - Added CLI tests for `agentloop ci-summary --write --out` with a non-`.md` path inside `.agentloop/reports/`.
  - Added CLI tests for `agentloop release-notes --write --out` with a non-`.md` path inside `.agentloop/handoffs/`.
  - No production code changed; the existing resolver already returned `OUTPUT_PATH_INVALID` with `reason: wrong-extension`.
  - Added an unreleased changelog note for the later `0.28.0` batch.
- Verification completed:
  - Focused test: `npm test -- tests/html-report.test.ts tests/badge.test.ts tests/ci-summary.test.ts tests/release-notes.test.ts`
  - Full `npm test`
  - `npm run lint`
  - `npm run typecheck`
  - `npm run check:links`
  - `npm run build`
  - `git diff --check`
  - `npx --yes projscan doctor --format markdown`
- Verification report: `.agentloop/reports/2026-06-11-06-06-verification-report.md`
- Handoff summary: `.agentloop/handoffs/2026-06-11-06-07-pr-summary.md`
- Worked well:
  - The new coverage confirmed the earlier safety implementation without widening scope or touching release metadata.
- Improve:
  - Keep future safety affordances covered at both directory and file-type boundaries when they write local artifacts.

## 2026-06-11: Constrain Explicit Artifact Output Paths

- Task contract: `.agentloop/tasks/2026-06-11-constrain-explicit-artifact-output-paths.md`
- Trigger:
  - `agentloop report --out`, `agentloop badge --out`, `agentloop ci-summary --write --out`, and `agentloop release-notes --write --out` accepted explicit paths outside their configured AgentLoop artifact directories.
  - That weakened the local-first file-write model because generated artifacts could be directed anywhere the process had write access.
- Product change:
  - Added a shared `OutputPathError` and output artifact path resolver in `src/core/artifacts.ts`.
  - Restricted report and badge outputs to `.agentloop/reports/` with `.html` and `.svg` extensions.
  - Restricted written CI summaries to `.agentloop/reports/` with `.md` extension.
  - Restricted written release notes to `.agentloop/handoffs/` with `.md` extension.
  - JSON mode now returns `OUTPUT_PATH_INVALID` with `requestedPath`, `expectedDir`, `expectedExtension`, and `reason`.
  - Updated docs and the unreleased changelog for the later `0.28.0` release batch.
- Verification completed:
  - Red focused test first: `npm test -- tests/html-report.test.ts tests/badge.test.ts tests/ci-summary.test.ts tests/release-notes.test.ts` failed because all four commands still exited 0 for outside output paths.
  - Focused green test: `npm test -- tests/html-report.test.ts tests/badge.test.ts tests/ci-summary.test.ts tests/release-notes.test.ts`
  - Full `npm test`
  - `npm run lint`
  - `npm run typecheck`
  - `npm run check:links`
  - `npm run build`
  - `git diff --check`
  - `npx --yes projscan doctor --format markdown`
- Verification report: `.agentloop/reports/2026-06-11-05-57-verification-report.md`
- Handoff summary: `.agentloop/handoffs/2026-06-11-05-58-pr-summary.md`
- Worked well:
  - A shared resolver keeps path policy consistent across generated artifact commands and protects direct core callers too.
- Improve:
  - Consider adding explicit wrong-extension CLI tests if future work touches output path validation again.

## 2026-06-11: Require `--write` With `--out`

- Task contract: `.agentloop/tasks/2026-06-11-require-write-when-output-path-is-provided.md`
- Trigger:
  - `agentloop ci-summary --out <path>` and `agentloop release-notes --out <path>` accepted an output path but wrote nothing unless `--write` was also passed.
  - That silent ignore could mislead CI scripts or agents into thinking a requested artifact existed.
- Product change:
  - Added a shared CLI option validator for `--out`/`--write`.
  - `ci-summary` and `release-notes` now fail before reading config or writing files when `--out` is passed without `--write`.
  - JSON mode returns `OUT_REQUIRES_WRITE` with the requested path and required option.
  - Human mode keeps the error on stderr through the existing top-level CLI error handler.
  - Updated CI-summary and release-notes docs plus the unreleased changelog.
- Verification completed:
  - Red focused test first: `npm test -- tests/ci-summary.test.ts tests/release-notes.test.ts` failed because both commands exited 0 while ignoring `--out`.
  - Focused green test: `npm test -- tests/ci-summary.test.ts tests/release-notes.test.ts`
  - Full `npm test`
  - `npm run lint`
  - `npm run typecheck`
  - `npm run check:links`
  - `npm run build`
  - `git diff --check`
  - `npx --yes projscan doctor --format markdown`
- Verification report: `.agentloop/reports/2026-06-11-05-44-verification-report.md`
- Handoff summary: `.agentloop/handoffs/2026-06-11-05-45-pr-summary.md`
- Worked well:
  - The same validator can cover future write-only output options without duplicating JSON error rendering.
- Improve:
  - Audit `badge --out` and `report --out` separately for whether they should keep arbitrary explicit output paths or require configured artifact directories.

## 2026-06-11: Add Baseframe Labs Ownership Metadata

- Task contract: `.agentloop/tasks/2026-06-11-add-baseframe-labs-ownership-metadata.md`
- Trigger:
  - AgentLoopKit now belongs under Baseframe Labs, but npm package metadata did not identify the public project owner.
  - The README needed a concise user-facing Baseframe Labs mention without adding release history or internal planning notes.
- Product change:
  - Added `author.name` and `author.url` to `package.json`.
  - Added a short Baseframe Labs line to the README introduction and linked Baseframe Labs in the "What It Is" section.
  - Added Vitest coverage that fails if the package author metadata is removed.
  - Recorded the change under `CHANGELOG.md` Unreleased for the later `0.28.0` release batch.
- Verification completed:
  - Red focused test first: `npm test -- tests/package-metadata.test.ts` failed because `package.json` had no `author` field.
  - Focused green test: `npm test -- tests/package-metadata.test.ts`
  - Full `npm test`
  - `npm run lint`
  - `npm run typecheck`
  - `npm run check:links`
  - `npm run build`
  - `git diff --check`
  - `npx --yes projscan doctor --format markdown`
- Verification report: `.agentloop/reports/2026-06-11-05-34-verification-report.md`
- Handoff summary: `.agentloop/handoffs/2026-06-11-05-36-pr-summary.md`
- Worked well:
  - The package metadata test gives npm-facing ownership a small regression guard.
- Improve:
  - After the Baseframe Labs app page goes live, decide whether `homepage` should remain the GitHub README or move to the product page.

## 2026-06-10: Archive Completed Task Contracts

- Task contract: `.agentloop/tasks/2026-06-10-archive-completed-task-contracts.md`
- Trigger:
  - After stale proposed tasks were archived, `agentloop task doctor` still reported 103 completed or legacy task contracts in the active task folder.
  - The active folder should show current or intentionally deferred work, not historical implementation evidence.
- Product change:
  - Used `agentloop task status <path> done` to normalize legacy `completed` and `verified` task statuses.
  - Used `agentloop task archive <path>` to move 103 completed or legacy contracts into `.agentloop/tasks/archive/`.
  - Preserved the two deferred future distribution tasks for Scoop/WinGet and VS Code/Open VSX.
  - Did not change runtime CLI behavior, package metadata, README content, or release state.
- Verification completed:
  - Active task folder assertion: pass; only `2026-06-10-add-scoop-winget-manifests.md` and `2026-06-10-explore-vscode-open-vsx-extension.md` remain outside `README.md` and `archive/`.
  - `node dist/cli/index.js task doctor --json`
  - `node dist/cli/index.js status --json`
  - `npx pnpm@10.12.1 check:links`
  - `git diff --check`
  - `npx --yes projscan doctor --format markdown`
- Verification report: `.agentloop/reports/2026-06-10-22-18-verification-report.md`
- Handoff summary: `.agentloop/handoffs/2026-06-10-22-19-pr-summary.md`
- Worked well:
  - The read-only `task doctor` output gave an exact file list for safe one-by-one archival through AgentLoopKit itself.
- Improve:
  - A future guarded cleanup helper could generate an archive plan, but bulk mutation should stay opt-in and dry-run-first.

## 2026-06-10: Clean Completed Trusted Publishing Task

- Task contract: `.agentloop/tasks/archive/2026-06-10-verify-npm-trusted-publishing.md`
- Trigger:
  - `agentloop status` correctly surfaced the newest open task, but that task had already been satisfied by the `v0.27.0` release.
  - Public distribution docs still included product-panel notes that belonged in internal planning files, not maintainer-facing release-channel guidance.
  - Archiving the trusted-publishing task exposed older June 9 `proposed` tasks that had already shipped or been superseded by later releases.
- Product change:
  - Marked the trusted-publishing task as `done` with release proof.
  - Replaced the public product-panel notes in `docs/distribution-channels.md` with factual channel rules.
  - Updated the backlog note so future agents see trusted publishing as proven, not pending.
  - Archived 12 stale June 9 proposed tasks after checking shipped evidence for contributor guidance, monorepo guidance, markdown link checking, README visuals, active task commands, product-panel records, and historical release candidates.
  - Left deferred future distribution tasks in place for Scoop/WinGet and VS Code/Open VSX because those are still future work.
- Verification completed:
  - `npx pnpm@10.12.1 check:links`
  - `git diff --check`
  - `node dist/cli/index.js task doctor --json`: pass with the known remaining legacy/terminal task-folder warnings.
  - `node dist/cli/index.js status --json`: pass; no active task and no latest open task remain.
  - `node dist/cli/index.js npm-status --expect-current`
  - `npx --yes projscan doctor --format markdown`
- Verification report: `.agentloop/reports/2026-06-10-22-12-verification-report.md`
- Handoff summary: `.agentloop/handoffs/2026-06-10-22-12-pr-summary.md`
- Archive action: moved the completed trusted-publishing task plus 12 stale June 9 proposals into `.agentloop/tasks/archive/`.
- Worked well:
  - The `latestTask` split made stale release work visible without pretending it was active.
- Improve:
  - Add a future report view that summarizes stale completed release tasks without requiring manual scans.

## 2026-06-10: Ignore Terminal Task Fallbacks

- Task contract: `.agentloop/tasks/archive/2026-06-10-ignore-completed-tasks-in-status-fallback.md`
- Trigger:
  - Archiving completed tasks after `v0.26.4` exposed that unpinned fallback selection could resurface old completed tasks as active work.
  - A maintainer saw npm's package page report an older visual version, so the registry was checked directly.
- Product changes:
  - Added one shared fallback task selector for status, next action, gates, handoffs, HTML reports, CI summaries, and release notes.
  - Ignored unpinned fallback tasks marked `done`, `completed`, or `verified`.
  - Kept explicitly pinned `done` tasks visible so agents recommend `agentloop task archive <path>`.
  - Updated README and docs to say fallback commands use the newest open task.
  - Archived three completed AgentLoopKit task contracts from the active task folder.
- Verification completed:
  - Red focused tests first: status, handoff, and gate fallback tests failed on the stale completed-task behavior.
  - Focused green tests: `npx --yes pnpm@10.12.1 test tests/next.test.ts tests/status.test.ts tests/pr-summary.test.ts tests/check-gates.test.ts`: pass, 4 files and 24 tests.
  - `npx --yes pnpm@10.12.1 lint`: pass.
  - `npx --yes pnpm@10.12.1 typecheck`: pass.
  - `npx --yes pnpm@10.12.1 test`: pass, 33 files and 151 tests.
  - `npx --yes pnpm@10.12.1 check:links`: pass, 627 Markdown files checked.
  - `git diff --check`: pass.
  - `npx --yes pnpm@10.12.1 build`: pass.
  - `npx --yes projscan doctor --format markdown`: pass, A 97/100 with one informational unused-export note in `scripts/smoke-packed-release.mjs`.
  - `node dist/cli/index.js verify --task .agentloop/tasks/2026-06-10-ignore-completed-tasks-in-status-fallback.md ...`: pass.
  - `npm view agentloopkit version versions --json`: pass, latest `0.26.4`.
- Verification report: `.agentloop/reports/2026-06-10-20-36-verification-report.md`
- Handoff summary: `.agentloop/handoffs/2026-06-10-20-37-pr-summary.md`
- Archive action: moved the completed task from `.agentloop/tasks/2026-06-10-ignore-completed-tasks-in-status-fallback.md` to `.agentloop/tasks/archive/2026-06-10-ignore-completed-tasks-in-status-fallback.md`.
- Worked well:
  - The status bug reproduced quickly with a newer finished task and an older open task.
  - Centralizing fallback selection kept all evidence commands aligned.
- Confusing:
  - Previous tests used task Markdown without status lines. The fallback now treats a task contract as selectable only when it has a real status line.
- Improve:
  - Consider a future `agentloop task doctor` command that flags task files missing status lines or stuck in old terminal states.

## 2026-06-10: Release 0.26.5 Terminal Fallback Patch

- Task contract: `.agentloop/tasks/archive/2026-06-10-prepare-0-26-5-terminal-fallback-release.md`
- Trigger:
  - The terminal fallback cleanup changed user-facing CLI behavior and needed an immediate npm/GitHub release.
- Release proof:
  - GitHub release `v0.26.5`: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.26.5>.
  - GitHub release asset `agentloopkit-0.26.5.tgz` SHA-256: `64fe8d8bc6c64b0d5699b85dbc962d64c6d2423b2ac01b13aad537f75cd0edc8`.
  - CI workflow `27298341631`: pass.
  - npm Publish workflow `27298446341`: pass, published `agentloopkit@0.26.5`.
  - Docker/GHCR workflow `27298446331`: pass.
  - MCP Registry workflow `27298526436`: pass.
  - `npm view agentloopkit version versions --json`: pass, latest `0.26.5`.
  - `node dist/cli/index.js npm-status --expect-current`: pass.
  - Fresh temp `npx --package agentloopkit@0.26.5` smoke: both binaries reported `0.26.5`; `agentloop init --dry-run` completed.
- Verification run:
  - Release verification report: `.agentloop/reports/2026-06-10-20-42-verification-report.md`, overall status pass.
  - Post-release handoff summary: `.agentloop/handoffs/2026-06-10-20-51-pr-summary.md`.
  - Release smoke: pass.
  - Dry-run npm publish: pass.
  - Projscan: A, 97/100, with the existing informational unused-export note for `scripts/smoke-packed-release.mjs`.
- Worked well:
  - Trusted publishing, GHCR, and MCP Registry completed from the GitHub release without local tokens.
- Improve:
  - Generate public release notes after fetching tags so the range starts at the latest release tag.

## 2026-06-10: Refresh Roadmap Current Release State For 0.26.5

- Task contract: `.agentloop/tasks/archive/2026-06-10-refresh-roadmap-current-release-state-for-0-26-5.md`
- Trigger:
  - Post-release docs were current, but `ROADMAP.md` still said the current release was `0.26.4`.
- Product change:
  - Updated the public roadmap current-state block to `v0.26.5`, `agentloopkit@0.26.5`, and `0.26.5` release-channel availability.
- Verification completed:
  - `npx --yes pnpm@10.12.1 check:links`
  - `git diff --check`
  - `node dist/cli/index.js npm-status --expect-current`
  - `npx --yes projscan doctor --format markdown`
  - `node dist/cli/index.js verify --task .agentloop/tasks/2026-06-10-refresh-roadmap-current-release-state-for-0-26-5.md ...`: pass.
- Verification report: `.agentloop/reports/2026-06-10-20-56-verification-report.md`
- Handoff summary: `.agentloop/handoffs/2026-06-10-20-58-pr-summary.md`
- Archive action: moved the completed task to `.agentloop/tasks/archive/2026-06-10-refresh-roadmap-current-release-state-for-0-26-5.md`.
- Worked well:
  - The stale current-state scan separated real stale copy from historical 0.26.4 evidence.
- Improve:
  - Consider a future release-status lint that scans current-state sections after every release.

## 2026-06-10: Archive Completed MCP Registry Task

- Task contract: `.agentloop/tasks/archive/2026-06-10-publish-mcp-registry-entry.md`
- Trigger:
  - `agentloop status` still surfaced the MCP Registry task as a review-state fallback after the registry workflow had passed.
- Evidence:
  - MCP Registry workflow `27298526436`: pass for `0.26.5`.
  - npm latest is `0.26.5`, and `npx --yes agentloopkit@0.26.5 mcp-server` is the documented install command.
- Action:
  - Marked `.agentloop/tasks/2026-06-10-publish-mcp-registry-entry.md` as `done`.
  - Archived it to `.agentloop/tasks/archive/2026-06-10-publish-mcp-registry-entry.md`.

## 2026-06-10: Release Channels Roadmap And README Cleanup

- Task contract: `.agentloop/tasks/2026-06-10-plan-release-channels-roadmap.md`
- Product cycle: `.agentloop/research/interview-cycle-104.md`
- Trigger:
  - `agentloopkit@0.24.0` was published on npm.
  - npm trusted publishing was configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`.
  - README still contained internal npm catch-up and auth-state language, which is wrong because the README ships to npm.
- Product changes:
  - Removed release-ops state from README.
  - Updated current release docs to say npm latest is `0.24.0`.
  - Added `docs/distribution-channels.md`.
  - Added backlog entries and proposed task contracts for npm trusted-publishing verification, Homebrew, Docker/GHCR, GitHub Action, MCP server, MCP Registry, VS Code/Open VSX, Scoop, and WinGet.
- Verification planned:
  - `npx pnpm@10.12.1 check:links`
  - `npm run typecheck`
  - `npm test`
  - `npm run build`
  - `npx projscan doctor --format markdown`
  - `agentloop npm-status --expect-current`
- Verification completed:
  - `npx pnpm@10.12.1 check:links`: pass, 573 Markdown files checked
  - `git diff --check`: pass
  - README stale-release scan: pass, no npm-lag/auth-state phrases found
  - `npm run typecheck`: pass
  - `npm test`: pass, 29 files and 121 tests
  - `npm run build`: pass
  - `npx projscan doctor --format markdown`: pass, A 100/100
  - `node dist/cli/index.js npm-status --expect-current`: pass, local `0.24.0` matches npm latest `0.24.0`
  - `npm view agentloopkit version versions --json`: pass, latest `0.24.0`
  - `npx --yes agentloopkit@0.24.0 version`: pass, reported `0.24.0`
  - `node dist/cli/index.js verify --task .agentloop/tasks/2026-06-10-plan-release-channels-roadmap.md`: pass
- Summary generated: `.agentloop/handoffs/2026-06-10-11-10-pr-summary.md`
- Verification report generated: `.agentloop/reports/2026-06-10-11-09-verification-report.md`
- Run-specific report, handoff, and `.agentloop/state.json` were kept out of the source commit because they contain local run state.
- Worked well: using AgentLoopKit made the scope clear enough to separate README cleanup from future channel implementation.
- Confusing: historical release artifacts are useful internally but should not leak into the public README.
- Improve: add a release-doc checklist item that scans README for maintainer-only phrases before every release.

## 2026-06-10: Unreadable Directory Init Bugfix

- Task contract: `.agentloop/tasks/2026-06-10-skip-unreadable-directories-during-project-detection.md`
- Trigger:
  - Running `npx agentloopkit init` from a macOS home directory failed with `EPERM: operation not permitted, scandir '/Users/abhyoh/.Trash'`.
- Product changes:
  - Added a regression test for project detection with an unreadable `.Trash` directory.
  - Changed recursive file discovery to skip unreadable directories instead of aborting.
  - Prepared patch release `0.24.1`.
- Verification completed:
  - Red test first: `npx pnpm@10.12.1 test tests/project-detection.test.ts` failed on `EACCES: permission denied, scandir .../.Trash`.
  - Focused green test: `npx pnpm@10.12.1 test tests/project-detection.test.ts`: pass, 6 tests.
  - Built CLI smoke: `agentloop init --dry-run` passed in a temp directory with unreadable `.Trash`.
  - `npm run lint`: pass
  - `npm run typecheck`: pass
  - `npm test`: pass, 29 files and 122 tests
  - `npx pnpm@10.12.1 check:links`: pass, 574 Markdown files checked
  - `node scripts/prepublish-check.mjs`: pass
  - `git diff --check`: pass
  - `npm run build`: pass
  - `npx projscan doctor --format markdown`: pass, A 100/100
  - `npm pack --pack-destination /tmp --silent`: pass, produced `/tmp/agentloopkit-0.24.1.tgz`
  - `npm publish --access public --dry-run`: pass
  - packed tarball `agentloop version`: pass, reported `0.24.1`
  - packed tarball `agentloop init --dry-run` with unreadable `.Trash`: pass
- Release verification:
  - GitHub release `v0.24.1`: published at `https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.24.1`
  - GitHub Publish workflow run `27266562238`: pass, published `agentloopkit@0.24.1` through trusted publishing
  - `npm view agentloopkit version versions --json`: pass, latest `0.24.1`
  - `node dist/cli/index.js npm-status --expect-current`: pass
  - clean temp `npm exec --yes --package=agentloopkit@0.24.1 -- agentloop version`: pass, reported `0.24.1`
  - clean temp `npm exec --yes --package=agentloopkit@0.24.1 -- agentloopkit version`: pass, reported `0.24.1`
  - clean temp `npx --yes agentloopkit@0.24.1 init --dry-run` with unreadable `.Trash`: pass
- Tarball SHA-256: `a3af9b4433ea72cdf1d7a045565d6cea408ec70a5d35973000de6a5ea331eb40`
- Worked well: the test reproduced the install crash before the fix.
- Confusing: `init` can be run outside a repository, but the recommended user path remains running it inside a repo.
- Improve: add a clearer future warning when `init` runs from a likely home directory.

## 2026-06-10: Bound Home Directory Init

- Task contract: `.agentloop/tasks/2026-06-10-bound-project-detection-scans.md`
- Trigger:
  - A real first-run attempt from `~` installed `agentloopkit@0.24.1` and then sat without output for about 50 seconds.
  - The root cause was fallback project detection recursively walking a large metadata-free directory.
- Product changes:
  - Bounded fallback project detection to a shallow capped scan after direct metadata checks fail.
  - Added a home-directory guard so non-dry `agentloop init` refuses to write files into `~` unless `--force` is passed.
  - Kept `agentloop init --dry-run` allowed from `~` so users can inspect planned files without writes.
  - Updated README and getting-started docs to say `init` should run from the target repo root.
  - Prepared patch release `0.24.2`.
- Verification completed:
  - Red project-detection test: `npx pnpm@10.12.1 test tests/project-detection.test.ts` failed because a deeply nested docs file still classified the directory as `docs-only`.
  - Red init safety test: `npx pnpm@10.12.1 test tests/init.test.ts` failed because home-directory init still wrote the harness.
  - Focused green tests: project-detection and init tests passed, 12 focused tests total.
  - Source CLI from `~`: `init --dry-run` returned in about 2 seconds; non-dry `init` refused with the home-directory message.
  - `npm run lint`: pass.
  - `npm run typecheck`: pass.
  - `npm test`: pass, 29 files and 125 tests.
  - `npx pnpm@10.12.1 check:links`: pass, 575 Markdown files checked.
  - `node scripts/prepublish-check.mjs`: pass.
  - `git diff --check`: pass.
  - `npm run build`: pass.
  - `npx projscan doctor --format markdown`: pass, A 100/100.
  - `npm publish --access public --dry-run`: pass.
  - `npm pack --pack-destination /tmp --silent`: pass, produced `/tmp/agentloopkit-0.24.2.tgz`.
  - Packed tarball `agentloop version`: pass, reported `0.24.2`.
  - Packed tarball `agentloop init --dry-run` from `~`: pass, returned in under 2 seconds.
  - Packed tarball non-dry `agentloop init` from `~`: expected refusal with the home-directory message.
- Release verification:
  - GitHub release `v0.24.2`: published at `https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.24.2`
  - GitHub Publish workflow run `27270795542`: pass, published `agentloopkit@0.24.2` through trusted publishing.
  - `npm view agentloopkit version versions --json`: pass, latest `0.24.2`.
  - Published `npx --yes agentloopkit@0.24.2 version`: pass, reported `0.24.2`.
  - Published `npx --yes agentloopkit@0.24.2 init --dry-run` from `~`: pass.
  - Published non-dry `npx --yes agentloopkit@0.24.2 init` from `~`: expected refusal with the home-directory message.
- Tarball SHA-256: `61438ff8e177f48ac815ddbc010acaaf90fdf9de95cf0fe0f78924422a06bfa3`
- Worked well: the fix keeps normal repo init unchanged and makes accidental home-directory use safe.
- Confusing: `--dry-run` still reports 51 planned files from `~`, which is accurate but may surprise users.
- Improve: consider adding a non-fatal note to dry-run output when the current directory is `~`.

## 2026-06-09: MVP Build

- Task contract: original build prompt, implemented directly before dogfood log existed.
- Verification run:
  - `npx pnpm@10.12.1 lint`
  - `npx pnpm@10.12.1 typecheck`
  - `npx pnpm@10.12.1 test`
  - `npx pnpm@10.12.1 build`
  - `npx projscan doctor --format markdown`
  - `npx pnpm@10.12.1 pack`
- Summary generated: `.agentloop/handoffs/2026-06-09-13-21-pr-summary.md`, removed from commit because it contained local machine paths.
- Worked well: deterministic summaries, verification reports, and generated harness made the repo easier to review.
- Confusing: generated run-specific reports should not be committed by default.
- Improve: clarify which `.agentloop` artifacts are reusable templates versus run-specific reports.

## 2026-06-09: Product Panel Iteration System

- Task contract: `.agentloop/tasks/2026-06-09-add-product-panel-iteration-system.md`
- Verification planned:
  - `pnpm run lint`
  - `pnpm run typecheck`
  - `pnpm run test`
  - `pnpm run build`
  - `npx projscan doctor --format markdown`
- Verification completed:
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 test`: pass, 13 files and 26 tests
  - `npx pnpm@10.12.1 build`: pass
  - `npx projscan doctor --format markdown`: A, 100/100
  - `npx pnpm@10.12.1 pack`: pass
  - tarball smoke test for `.agentloop/README.md` and `install-agent all`: pass
  - `agentloop verify`: pass
  - `agentloop summarize --write`: pass
- Product changes:
  - Added internal product panel and target personas.
  - Added simulated interview cycles and backlog.
  - Added `.agentloop/README.md` generation.
  - Added `install-agent all`.
  - Added npm trusted-publishing workflow docs.
- Worked well: task contracts make scope explicit before product iteration.
- Confusing: run-specific verification reports include local paths, so they should not be committed by default.
- Improve: add `agentloop status` after launch polish.

## 2026-06-09: README Launch Visuals And 0.1.1 Follow-Up

- Task contract: `.agentloop/tasks/2026-06-09-add-readme-launch-visuals.md`
- Product cycle: `.agentloop/research/interview-cycle-004.md`
- Verification planned:
  - `npx pnpm@10.12.1 lint`
  - `npx pnpm@10.12.1 typecheck`
  - `npx pnpm@10.12.1 test`
  - `npx pnpm@10.12.1 build`
  - `npx projscan doctor --format markdown`
  - `npx pnpm@10.12.1 pack`
  - `npm publish --access public --dry-run`
  - live npm smoke with `npx --yes agentloopkit version`
- Verification completed:
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 test`: pass, 13 files and 26 tests
  - `npx pnpm@10.12.1 build`: pass
  - `npx projscan doctor --format markdown`: A, 100/100
  - `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.1.1.tgz`
  - `npm publish --access public --dry-run`: pass
  - `npx --yes agentloopkit version`: pass, current published version `0.1.0`
  - `0.1.1` tarball smoke: pass
- Publish status:
  - `npm publish --access public` for `0.1.1` reached npm and then stopped at `EOTP`.
  - Maintainer browser/OTP authentication is required before the patch release can be published.
- Product changes:
  - Added README screenshots rendered with Playwright.
  - Added a VHS terminal demo of the published CLI.
  - Updated release workflow to skip npm publish when a version already exists.
  - Bumped the follow-up release to `0.1.1`.
- Worked well: Playwright screenshots communicate the task, verification, and handoff artifacts faster than prose.
- Confusing: npm `0.1.0` was already live, so README asset polish should ship as a patch release rather than rewriting the first npm release.
- Improve: add a dedicated `agentloop status` command so future demos can show active task, latest report, and next action in one screen.

## 2026-06-09: Status Command

- Task contract: `.agentloop/tasks/2026-06-09-add-status-command.md`
- Product cycle: `.agentloop/research/interview-cycle-005.md`
- Verification planned:
  - `npx pnpm@10.12.1 lint`
  - `npx pnpm@10.12.1 typecheck`
  - `npx pnpm@10.12.1 test`
  - `npx pnpm@10.12.1 build`
  - `npx projscan doctor --format markdown`
  - `npx pnpm@10.12.1 pack`
  - `npm publish --access public --dry-run`
- Verification completed:
  - Red tests first: `tests/status.test.ts` and `tests/version.test.ts` failed before implementation.
  - Focused green tests: `npx pnpm@10.12.1 test tests/status.test.ts tests/version.test.ts`: pass, 2 files and 3 tests
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 test`: pass, 15 files and 29 tests
  - `npx pnpm@10.12.1 build`: pass
  - `npx projscan doctor --format markdown`: A, 100/100
  - `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.2.0.tgz`
  - `npm publish --access public --dry-run`: pass
  - `0.2.0` tarball smoke: pass, `agentloop status --json` and `agentloop version`
  - `agentloop status --json` on this repo: pass, detected active task and suggested `agentloop verify`
  - `agentloop verify`: first failed because repo config used unavailable global `pnpm`; passed after config changed to `npx pnpm@10.12.1`
  - `agentloop status --json` after verification: pass, detected latest report status `pass` and suggested `agentloop summarize --write`
- Product changes:
  - Added `agentloop status` and `agentloop status --json`.
  - Fixed version output to read `package.json`.
  - Added Vitest coverage before implementation.
  - Updated this repo's AgentLoopKit config to use `npx pnpm@10.12.1` so dogfooded verification matches the actual project commands.
- Worked well: red tests caught both the missing command and stale version output.
- Confusing: latest task/report detection is intentionally file-based; future task status lifecycle work can make this more explicit.
- Improve: add richer task status transitions after this release.

## 2026-06-09: Verification Output Excerpts

- Task contract: `.agentloop/tasks/2026-06-09-improve-verification-output-excerpts.md`
- Product cycle: `.agentloop/research/interview-cycle-006.md`
- Verification planned:
  - `npx pnpm@10.12.1 test tests/verification.test.ts`
  - `npx pnpm@10.12.1 lint`
  - `npx pnpm@10.12.1 typecheck`
  - `npx pnpm@10.12.1 test`
  - `npx pnpm@10.12.1 build`
  - `npx projscan doctor --format markdown`
- Verification completed:
  - Red test first: `npx pnpm@10.12.1 test tests/verification.test.ts` failed because long output dropped `END: assertion failed at final line`.
  - Focused green test: `npx pnpm@10.12.1 test tests/verification.test.ts`: pass, 1 file and 3 tests.
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 test`: pass, 15 files and 30 tests
  - `npx pnpm@10.12.1 build`: pass
  - `npx projscan doctor --format markdown`: A, 100/100
  - `agentloop verify`: pass, wrote `.agentloop/reports/2026-06-09-14-57-verification-report.md`
  - `agentloop summarize --write`: pass, wrote `.agentloop/handoffs/2026-06-09-14-57-pr-summary.md`
- Product changes:
  - Verification reports now keep the beginning and ending output when logs are truncated.
  - Added a clear truncation marker with the original output length.
  - Updated docs and decision records.
- Worked well: the failing test reproduced the exact review problem before implementation.
- Confusing: report excerpt limits are still fixed; future work can make them configurable if users ask.
- Run-specific verification and handoff files were generated for dogfooding and kept out of the source commit because they include local state.
- Improve: add a small status hint when the latest verification report failed.

## 2026-06-09: Failed Verification Status Next Action

- Task contract: `.agentloop/tasks/2026-06-09-show-failed-verification-next-action-in-status.md`
- Product cycle: `.agentloop/research/interview-cycle-007.md`
- Verification planned:
  - `npx pnpm@10.12.1 test tests/status.test.ts`
  - `npx pnpm@10.12.1 lint`
  - `npx pnpm@10.12.1 typecheck`
  - `npx pnpm@10.12.1 test`
  - `npx pnpm@10.12.1 build`
  - `npx projscan doctor --format markdown`
- Verification completed:
  - Red test first: `npx pnpm@10.12.1 test tests/status.test.ts` failed because a failed report still led to a next-task path.
  - Focused green test: `npx pnpm@10.12.1 test tests/status.test.ts`: pass, 1 file and 3 tests.
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 test`: pass, 15 files and 30 tests
  - `npx pnpm@10.12.1 build`: pass
  - `npx projscan doctor --format markdown`: A, 100/100
  - `agentloop verify`: pass, wrote `.agentloop/reports/2026-06-09-15-05-verification-report.md`
  - `agentloop summarize --write`: pass, wrote `.agentloop/handoffs/2026-06-09-15-05-pr-summary.md`
- Product changes:
  - `agentloop status` now points back to `agentloop verify` when the latest report failed.
  - Updated status docs and decision records.
- Worked well: the test caught an unsafe next-action ordering bug.
- Confusing: task lifecycle remains file-based; richer transitions still belong in future work.
- Run-specific verification and handoff files were generated for dogfooding and kept out of the source commit because they include local state.
- Improve: make issue and PR templates ask for AgentLoopKit status output.

## 2026-06-09: Contributor Template Evidence Prompts

- Task contract: `.agentloop/tasks/2026-06-09-ask-for-agentloopkit-evidence-in-github-templates.md`
- Product cycle: `.agentloop/research/interview-cycle-008.md`
- Verification planned:
  - `git diff --check`
  - `npx pnpm@10.12.1 lint`
  - `npx pnpm@10.12.1 typecheck`
  - `npx pnpm@10.12.1 test`
  - `npx pnpm@10.12.1 build`
  - `npx projscan doctor --format markdown`
- Verification completed:
  - `git diff --check`: pass
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 test`: pass, 15 files and 29 tests
  - `npx pnpm@10.12.1 build`: pass
  - `npx projscan doctor --format markdown`: A, 100/100
  - `agentloop verify`: pass, wrote `.agentloop/reports/2026-06-09-15-08-verification-report.md`
  - `agentloop summarize --write`: pass, wrote `.agentloop/handoffs/2026-06-09-15-09-pr-summary.md`
- Product changes:
  - Bug reports now ask for `agentloop status` when available.
  - Feature requests identify the affected command, template, policy, or agent workflow.
  - Pull requests ask for task contract, status, verification report, and handoff summary.
- Worked well: templates now reinforce the product's review loop at contribution time.
- Confusing: GitHub labels still need repository-side setup outside the codebase.
- Run-specific verification and handoff files were generated for dogfooding and kept out of the source commit because they include local state.
- Improve: add curated good-first-issue labels after launch.

## 2026-06-09: Publish Workflow Hardening

- Task contract: `.agentloop/tasks/2026-06-09-harden-npm-publish-workflow-after-trusted-publishing-failure.md`
- Product cycle: `.agentloop/research/interview-cycle-009.md`
- Trigger:
  - Published GitHub release `v0.2.0`.
  - GitHub Actions publish workflow passed install, lint, typecheck, test, and build.
  - `npm publish` failed with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`, indicating npm did not authorize the workflow to publish.
- Verification planned:
  - `git diff --check`
  - `npx pnpm@10.12.1 lint`
  - `npx pnpm@10.12.1 typecheck`
  - `npx pnpm@10.12.1 test`
  - `npx pnpm@10.12.1 build`
  - `npx projscan doctor --format markdown`
- Verification completed:
  - `git diff --check`: pass
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 test`: pass, 15 files and 29 tests
  - `npx pnpm@10.12.1 build`: pass
  - `npx projscan doctor --format markdown`: A, 100/100
  - `agentloop verify`: pass, wrote `.agentloop/reports/2026-06-09-15-18-verification-report.md`
  - `agentloop summarize --write`: pass, wrote `.agentloop/handoffs/2026-06-09-15-18-pr-summary.md`
- Product changes:
  - Publish workflow can be run manually after npm trusted publishing is configured.
  - Publish workflow uses explicit `npm publish --access public`.
  - Release notes now state that npm `0.2.0` is pending.
  - Publishing docs explain the observed failure and safe local fallback.
- Worked well: GitHub release automation verified the package before hitting npm authorization.
- Confusing: npm returns a 404 for an authorization/trusted-publisher problem.
- Run-specific verification and handoff files were generated for dogfooding and kept out of the source commit because they include local state.
- Improve: configure npm trusted publishing on npmjs.com, then rerun the Publish workflow.

## 2026-06-09: CI Node 24 Runtime Opt-In

- Task contract: `.agentloop/tasks/2026-06-09-opt-ci-actions-into-node-24-runtime.md`
- Product cycle: `.agentloop/research/interview-cycle-010.md`
- Trigger:
  - `main` CI passed after contributor-template polish.
  - GitHub warned that JavaScript actions were running on deprecated Node.js 20.
- Verification planned:
  - `git diff --check`
  - `npx pnpm@10.12.1 lint`
  - `npx pnpm@10.12.1 typecheck`
  - `npx pnpm@10.12.1 test`
  - `npx pnpm@10.12.1 build`
  - `npx projscan doctor --format markdown`
- Product changes:
  - CI workflow now sets `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true`.
- Worked well: the fix is workflow-only and does not alter the npm package artifact.
- Confusing: GitHub's warning points at action runtime, not the project's `node-version`.
- Run-specific verification and handoff files were generated for dogfooding and kept out of the source commit because they include local state.
- Improve: consider upgrading action major versions when Node 24-native versions are available.

## 2026-06-09: GitHub Actions v6 Upgrade

- Task contract: `.agentloop/tasks/2026-06-09-upgrade-github-actions-to-v6.md`
- Product cycle: `.agentloop/research/interview-cycle-011.md`
- Trigger:
  - `main` CI passed after Node 24 runtime opt-in.
  - GitHub still warned that pinned actions target Node 20.
  - Upstream tags exist for `actions/checkout@v6`, `actions/setup-node@v6`, and `pnpm/action-setup@v6`.
- Verification planned:
  - `git diff --check`
  - `npx pnpm@10.12.1 lint`
  - `npx pnpm@10.12.1 typecheck`
  - `npx pnpm@10.12.1 test`
  - `npx pnpm@10.12.1 build`
  - `npx projscan doctor --format markdown`
- Product changes:
  - CI and Publish workflows now use v6 major action lines.
- Worked well: this keeps launch CI aligned with GitHub's runtime migration.
- Confusing: the action runtime warning can persist even when the project itself uses a supported Node version.
- Run-specific verification and handoff files were generated for dogfooding and kept out of the source commit because they include local state.
- Improve: verify the PR CI annotation disappears before merging.

## 2026-06-09: Good First Contributor Path

- Task contract: `.agentloop/tasks/2026-06-09-add-good-first-contributor-path.md`
- Product cycle: `.agentloop/research/interview-cycle-012.md`
- Trigger:
  - Product-panel review identified contributor entry points as useful launch polish with no npm package risk.
- Verification planned:
  - `git diff --check`
  - `npx pnpm@10.12.1 lint`
  - `npx pnpm@10.12.1 typecheck`
  - `npx pnpm@10.12.1 test`
  - `npx pnpm@10.12.1 build`
  - `npx projscan doctor --format markdown`
- Verification completed:
  - `git diff --check`: pass
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 test`: pass, 15 files and 29 tests
  - `npx pnpm@10.12.1 build`: pass
  - `npx projscan doctor --format markdown`: A, 100/100
- Product changes:
  - Added a maintainer-authored good-first issue template.
  - Added a checked-in GitHub label map.
  - Added a first-contribution path to `CONTRIBUTING.md`.
- Worked well: the task stayed outside runtime code and package contents.
- Confusing: labels still need manual GitHub setup unless a future label-sync tool is introduced.
- Improve: add a public good-first-issues list after real issues exist.

## 2026-06-09: npm Trusted Publishing Recovery Docs

- Task contract: `.agentloop/tasks/2026-06-09-clarify-npm-trusted-publishing-recovery.md`
- Product cycle: `.agentloop/research/interview-cycle-013.md`
- Trigger:
  - GitHub release `v0.2.0` is public, but npm still reports `agentloopkit@0.1.1` as latest.
  - Local browser-auth publish retry failed at npm's auth completion endpoint.
- Verification planned:
  - `git diff --check`
  - `npx pnpm@10.12.1 lint`
  - `npx pnpm@10.12.1 typecheck`
  - `npx pnpm@10.12.1 test`
  - `npx pnpm@10.12.1 build`
  - `npx projscan doctor --format markdown`
- Verification completed:
  - `git diff --check`: pass
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 test`: pass, 15 files and 29 tests
  - `npx pnpm@10.12.1 build`: pass
  - `npx projscan doctor --format markdown`: A, 100/100
- Product changes:
  - Publishing docs now name exact npm trusted publisher fields.
  - Launch checklist records the current `0.2.0` recovery state.
  - Final handoff explains the npm gap without asking for credentials.
- Worked well: the change improves release trust without changing package contents.
- Confusing: npm reports authorization problems as 404 errors in more than one path.
- Improve: configure npm trusted publishing on npmjs.com, then rerun the Publish workflow.

## 2026-06-09: 0.2.1 Release Candidate

- Task contract: `.agentloop/tasks/2026-06-09-prepare-0-2-1-release-candidate.md`
- Product cycle: `.agentloop/research/interview-cycle-014.md`
- Trigger:
  - PR #1 and PR #2 changed package behavior after the public `v0.2.0` GitHub tag.
  - npm latest remains `agentloopkit@0.1.1`.
- Verification planned:
  - `git diff --check`
  - `npx pnpm@10.12.1 lint`
  - `npx pnpm@10.12.1 typecheck`
  - `npx pnpm@10.12.1 test`
  - `npx pnpm@10.12.1 build`
  - `npx projscan doctor --format markdown`
  - `npx pnpm@10.12.1 pack`
  - `npm publish --access public --dry-run`
  - tarball smoke tests
- Verification completed:
  - `git diff --check`: pass
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 test`: pass, 15 files and 31 tests
  - `npx pnpm@10.12.1 build`: pass
  - `npx projscan doctor --format markdown`: A, 100/100
  - `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.2.1.tgz`
  - `npm publish --access public --dry-run`: pass
  - Initial tarball smoke with default npm `test`: fail, because `npm init` creates a failing placeholder test script.
  - Corrected tarball smoke with `--no-test --no-lint --no-typecheck --no-build --command "node -e ..."`: pass
  - `npx --yes --package ./agentloopkit-0.2.1.tgz agentloop version`: pass, reported `0.2.1`
- Product changes:
  - Package version is prepared as `0.2.1`.
  - Changelog documents verification excerpt and failed-status safety fixes.
  - Launch checklist and handoff identify `0.2.1` as prepared, not published.
- Worked well: the tarball proved version, status, and custom verification behavior without publishing.
- Confusing: `agentloop verify --command` still runs configured checks unless disabled with flags.
- Improve: publish only after npm trusted publishing is configured or local browser authentication succeeds.

## 2026-06-09: 0.2.1 GitHub Release And npm Publish Check

- Task contract: `.agentloop/tasks/2026-06-09-prepare-0-2-1-release-candidate.md`
- Product cycle: `.agentloop/research/interview-cycle-015.md`
- Trigger:
  - Maintainer requested a GitHub release after the local `0.2.1` release candidate was prepared.
  - Local `npm publish --access public` browser-auth retry failed at npm's auth completion endpoint.
- Verification completed before release:
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 test`: pass, 15 files and 31 tests
  - `npx pnpm@10.12.1 build`: pass
  - `npx projscan doctor --format markdown`: A, 100/100
- Release actions:
  - Created GitHub release `v0.2.1`.
  - Updated the public release notes after the publish workflow result to state that npm latest remains `0.1.1`.
  - Watched Publish workflow run `27212907210`.
- Publish workflow result:
  - GitHub Actions passed install, lint, typecheck, tests, build, and `prepublishOnly`.
  - `npm publish --access public` failed with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`.
  - `npm view agentloopkit version versions --json` still reports latest `0.1.1` with versions `0.1.0` and `0.1.1`.
- Worked well: release notes now tell the truth about GitHub release status versus npm availability.
- Confusing: npm uses 404 wording for a permission/trusted-publisher failure.
- Improve: configure npm trusted publishing on npmjs.com for owner `abhiyoheswaran1`, repository `AgentLoopKit`, workflow `publish.yml`, allowed action `npm publish`.

## 2026-06-09: Handoff Command Alias

- Task contract: `.agentloop/tasks/2026-06-09-add-handoff-command-alias.md`
- Product cycle: `.agentloop/research/interview-cycle-016.md`
- Trigger:
  - Product panel identified a wording mismatch: the methodology says handoff, but the write command was `agentloop summarize --write`.
  - npm publishing remains blocked by npm-side authorization, so this became the next repo-side launch polish item.
- Verification completed:
  - Red test first: `npx pnpm@10.12.1 test tests/handoff.test.ts` failed with `unknown command 'handoff'`.
  - Status red test: `npx pnpm@10.12.1 test tests/status.test.ts` failed because status still suggested `agentloop summarize --write`.
  - Focused green tests: `npx pnpm@10.12.1 test tests/handoff.test.ts tests/status.test.ts`: pass, 2 files and 5 tests
  - `git diff --check`: pass
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 test`: pass, 16 files and 33 tests
  - `npx pnpm@10.12.1 build`: pass
  - `npx projscan doctor --format markdown`: A, 100/100
  - `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.3.0.tgz`
  - Tarball smoke: pass, `agentloop handoff --json` wrote a handoff file from an isolated temp repo
  - `npm publish --access public --dry-run`: pass
  - `agentloop verify`: pass, wrote `.agentloop/reports/2026-06-09-16-37-verification-report.md`
  - `agentloop handoff --task .agentloop/tasks/2026-06-09-add-handoff-command-alias.md --json`: pass, wrote `.agentloop/handoffs/2026-06-09-16-37-pr-summary.md`
- Product changes:
  - Added `agentloop handoff` as a write-by-default wrapper around deterministic PR summaries.
  - Kept `agentloop summarize` read-only unless `--write` is passed.
  - Updated `agentloop status` to suggest `agentloop handoff` after task and passing verification evidence exist.
  - Prepared `agentloopkit@0.3.0` on `main` because the change landed after the public `v0.2.1` GitHub tag.
- Worked well: the alias made the loop read naturally without adding a second summary implementation.
- Confusing:
  - Repeating `create-task --constraint` style flags kept only the last value.
  - Latest task detection picked an older same-day task by filename order until the handoff command was rerun with `--task`.
- Improve:
  - Fix repeated create-task option accumulation.
  - Improve active task detection beyond filename sorting.

## 2026-06-09: Repeated create-task Flags

- Task contract: `.agentloop/tasks/2026-06-09-fix-repeated-create-task-flags.md`
- Product cycle: `.agentloop/research/interview-cycle-017.md`
- Trigger:
  - Cycle 16 dogfooding showed that repeated `create-task --constraint` style flags kept only the last value.
  - The CLI help says these flags can repeat, so the generated contract contradicted the command contract.
- Root cause:
  - `create-task` used a custom Commander parser that accepted only the current value.
  - Commander passes the previous aggregate as a second argument, but the parser ignored it.
- Verification completed:
  - Reproduction in a temp repo: only the last repeated constraint, non-goal, acceptance criterion, and verification command appeared.
  - Red test first: `npx pnpm@10.12.1 test tests/create-task.test.ts` failed because earlier repeated values were missing.
  - Focused green test: `npx pnpm@10.12.1 test tests/create-task.test.ts`: pass
  - `git diff --check`: pass
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 test`: pass, 17 files and 34 tests
  - `npx pnpm@10.12.1 build`: pass
  - `npx projscan doctor --format markdown`: A, 100/100
  - `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.3.0.tgz`
  - Tarball smoke: pass, repeated create-task flags were preserved from the packed CLI
  - `npm publish --access public --dry-run`: pass
- Product changes:
  - Repeated `--constraint`, `--non-goal`, `--acceptance`, and `--verify-command` values now append.
  - `agentloopkit@0.3.0` remains the next release candidate because npm publishing is still blocked by npm-side authorization.
- Worked well: the fix stayed at the parser boundary and did not alter task contract Markdown.
- Confusing: task contract creation does not yet support repeated likely-file or forbidden-file flags in non-interactive mode.
- Improve:
  - Add non-interactive flags for likely files and files not to touch.
  - Improve active task detection beyond filename sorting.

## 2026-06-09: CI CLI Test Harness Fix

- Task contract: `.agentloop/tasks/2026-06-09-fix-repeated-create-task-flags.md`
- Trigger:
  - GitHub CI run `27214329125` failed after commit `36d41f2`.
  - Product tests passed locally, but CI failed when CLI tests invoked `npx tsx` from temp directories.
- Root cause:
  - Tests ran `npx tsx ...` with `cwd` set to temp repos.
  - npm treated those temp repos as package roots and tried to install `tsx` during tests.
  - Concurrent installs hit a cache/esbuild file error in CI.
- Verification completed:
  - Focused CLI tests after fix: `npx pnpm@10.12.1 test tests/create-task.test.ts tests/handoff.test.ts tests/status.test.ts tests/version.test.ts`: pass, 4 files and 7 tests
  - `git diff --check`: pass
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 test`: pass, 17 files and 34 tests
  - `npx pnpm@10.12.1 build`: pass
  - `npx projscan doctor --format markdown`: A, 100/100
- Product changes:
  - CLI tests now run the repo-local `node_modules/.bin/tsx` binary instead of `npx tsx`.
- Worked well: the CI failure exposed a test harness dependency on networked `npx` behavior.
- Improve: add a small shared `runCli` helper for future CLI tests.

## 2026-06-09: Active Task Detection

- Task contract: `.agentloop/tasks/2026-06-09-improve-active-task-detection.md`
- Product cycle: `.agentloop/research/interview-cycle-018.md`
- Trigger:
  - Cycle 16 dogfooding showed `agentloop handoff` could select an older same-day task by filename order.
  - `status` and PR summaries used duplicated filename-sort helpers.
- Verification completed:
  - Red tests first: `npx pnpm@10.12.1 test tests/status.test.ts tests/pr-summary.test.ts` failed because older alphabetically later task files were selected.
  - Focused green tests: `npx pnpm@10.12.1 test tests/status.test.ts tests/pr-summary.test.ts`: pass, 2 files and 7 tests
  - `git diff --check`: pass
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 test`: pass, 17 files and 36 tests
  - `npx pnpm@10.12.1 build`: pass
  - `npx projscan doctor --format markdown`: A, 100/100
  - `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.3.0.tgz`
  - Tarball smoke: pass, packed `agentloop status --json` selected the newer modified task
- Product changes:
  - Added a shared latest Markdown artifact selector.
  - `agentloop status` and deterministic handoffs now choose newest modified Markdown artifacts and ignore `README.md`.
  - Filename order remains the tie-breaker when mtimes match.
- Worked well: the fix removed duplicate latest-file logic without adding task state.
- Improve: add explicit task lifecycle later so "active" can be user-controlled instead of inferred.

## 2026-06-09: create-task Area Flags

- Task contract: `.agentloop/tasks/2026-06-09-add-create-task-area-flags.md`
- Product cycle: `.agentloop/research/interview-cycle-019.md`
- Trigger:
  - Non-interactive task creation could not fill likely files or files not to touch.
  - Those fields are core scoping fields in task contracts.
- Verification completed:
  - Red test first: `npx pnpm@10.12.1 test tests/create-task.test.ts` failed with `unknown option '--likely-file'`.
  - Focused green test: `npx pnpm@10.12.1 test tests/create-task.test.ts`: pass
  - `git diff --check`: pass
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 test`: pass, 17 files and 36 tests
  - `npx pnpm@10.12.1 build`: pass
  - `npx projscan doctor --format markdown`: A, 100/100
  - `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.3.0.tgz`
  - Tarball smoke: pass, packed `create-task` wrote repeated likely and forbidden file entries
  - `npm publish --access public --dry-run`: pass
- Product changes:
  - Added repeatable `create-task --likely-file`.
  - Added repeatable `create-task --forbidden-file`.
  - Updated README, getting-started docs, and task-contract docs.
- Worked well: the core task renderer already supported the fields, so the fix stayed in the CLI surface.
- Improve: task lifecycle remains the next higher-value product item after npm publishing repair.

## 2026-06-09: create-task Alias Flags and npm OTP Recovery

- Task contract: `.agentloop/tasks/2026-06-09-document-npm-otp-publish-blocker.md`
- Product cycle: `.agentloop/research/interview-cycle-020.md`
- Trigger:
  - Local `npm publish --access public` for `agentloopkit@0.3.0` passed the package checks, then npm stopped at `EOTP`.
  - Dogfooding a docs task failed because `create-task` rejected natural flags such as `--desired-outcome`.
- Root cause:
  - Non-interactive `create-task` only accepted the shorter internal names `--outcome` and `--verify-command`.
  - Rollback notes and assumptions were only reachable from the interactive prompt.
- Verification completed:
  - Dogfood reproduction: `node dist/cli/index.js create-task ... --desired-outcome ...` failed with `unknown option '--desired-outcome'`.
  - Red test first: `npx pnpm@10.12.1 test tests/create-task.test.ts` failed with `unknown option '--problem-statement'`.
  - Focused green test: `npx pnpm@10.12.1 test tests/create-task.test.ts`: pass, 2 tests
  - Dogfood command after fix: `npx tsx src/cli/index.ts create-task ... --problem-statement ... --desired-outcome ... --verification ... --rollback ...`: pass
  - `git diff --check`: pass
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 test`: pass, 17 files and 37 tests
  - `npx pnpm@10.12.1 build`: pass
  - `npx projscan doctor --format markdown`: A, 100/100
  - `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.3.0.tgz`
  - Tarball smoke: pass, packed `create-task` accepted the alias flags and wrote the expected task contract fields
  - `npm publish --access public --dry-run`: pass
  - GitHub release `v0.3.0`: created with attached `agentloopkit-0.3.0.tgz`
  - GitHub Publish workflow `27215993837`: package checks passed, final `npm publish` failed with `E404`
  - Stale manual Publish workflow `27215293502`: cancelled because it targeted an older `0.3.0` commit
- Product changes:
  - Added `--problem-statement`, `--desired-outcome`, `--assumption`, `--verification`, and `--rollback` to non-interactive task creation.
  - Kept existing shorter flags working.
  - Updated README, getting-started docs, task-contract docs, generated task README, npm publishing docs, and final handoff.
- Worked well: dogfooding exposed a CLI naming mismatch before release notes could freeze it.
- Confusing:
  - npm local publish may pass package checks and still stop at account authentication.
  - The manual GitHub Publish workflow can remain queued even when CI runs quickly.
  - GitHub Actions can still fail at npm authorization after passing every package check.
- Improve:
  - Configure npm trusted publishing or complete local browser/OTP publish before creating another npm-aligned release.
  - Add a task lifecycle command after publish recovery if no P0 release blocker remains.

## 2026-06-09: Active Task Lifecycle Command

- Task contract: `.agentloop/tasks/2026-06-09-add-active-task-lifecycle-command.md`
- Product cycle: `.agentloop/research/interview-cycle-021.md`
- Verification report: `.agentloop/reports/2026-06-09-17-26-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-09-17-26-pr-summary.md`
- Trigger:
  - `status` and handoffs inferred the active task from newest Markdown file modification time.
  - Product-panel Cycle 21 identified that long autonomous sessions need an explicit active task pointer without turning AgentLoopKit into project management software.
- Red tests:
  - `npx pnpm@10.12.1 test tests/task-state.test.ts tests/status.test.ts tests/pr-summary.test.ts tests/handoff.test.ts` failed because `src/core/task-state.ts` did not exist and status/handoff still selected the newest task.
- Verification completed:
  - Focused green test: `npx pnpm@10.12.1 test tests/task-state.test.ts tests/status.test.ts tests/pr-summary.test.ts tests/handoff.test.ts`: pass, 4 files and 15 tests
  - `git diff --check`: pass
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 test`: pass, 18 files and 43 tests
  - `npx pnpm@10.12.1 build`: pass
  - `npx projscan doctor --format markdown`: A, 100/100
  - `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.3.0.tgz`
  - Tarball smoke: pass, packed `agentloop task set`, `status --json`, and `task clear` behaved as expected
  - `npm publish --access public --dry-run`: pass
  - `agentloop verify --task .agentloop/tasks/2026-06-09-add-active-task-lifecycle-command.md`: pass
  - `agentloop handoff --json`: pass, wrote the handoff above and used the pinned task
- Product changes:
  - Added `agentloop task set <path>`, `agentloop task current`, and `agentloop task clear`.
  - Added `.agentloop/state.json` as a transparent active task pointer. `clear` removes the file.
  - Updated `status` and deterministic handoffs to prefer the explicit active task when it points to an existing Markdown task inside `.agentloop/tasks/`.
  - Preserved newest-task fallback when no active task is pinned.
  - Updated README, docs, generated templates, repo harness, changelog, decisions, and final handoff.
- Worked well:
  - A one-file state model improved determinism without adding task boards, accounts, or persistence outside the repo.
  - Dogfooding showed `status --json` and `handoff` now cite the intended task.
- Confusing:
  - The package version remains `0.3.0` because this task avoided package metadata. A release-prep task should bump the next version before another GitHub or npm release.
- Improve:
  - Add a release-prep task for `0.4.0` after npm trusted publishing is configured or local browser/OTP publish works.
  - Consider `agentloop task current` in agent install guidance after more dogfooding.

## 2026-06-09: 0.4.0 Active Task Release Candidate

- Task contract: `.agentloop/tasks/2026-06-09-prepare-0-4-0-active-task-release.md`
- Product cycle: `.agentloop/research/interview-cycle-022.md`
- Verification report: `.agentloop/reports/2026-06-09-17-33-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-09-17-33-pr-summary.md`
- Trigger:
  - `main` contained the active task command after GitHub release `v0.3.0`.
  - Package metadata still needed to move to a new release candidate before another GitHub release.
- Verification completed:
  - `npx tsx src/cli/index.ts task set .agentloop/tasks/2026-06-09-prepare-0-4-0-active-task-release.md --json`: pass
  - `npx tsx src/cli/index.ts version`: pass, reported `0.4.0`
  - `git diff --check`: pass
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 test`: pass, 18 files and 43 tests
  - `npx pnpm@10.12.1 build`: pass
  - `npx projscan doctor --format markdown`: A, 100/100
  - `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.4.0.tgz`
  - Tarball smoke: pass, packed `agentloop version` reported `0.4.0` and `agentloop task set/clear` worked
  - `npm publish --access public --dry-run`: pass
  - `agentloop verify --task .agentloop/tasks/2026-06-09-prepare-0-4-0-active-task-release.md`: pass
  - `agentloop handoff --json`: pass, wrote the handoff above and used the pinned `0.4.0` task
  - `agentloop task clear --json`: pass, removed `.agentloop/state.json`
  - GitHub release `v0.4.0`: created with attached `agentloopkit-0.4.0.tgz`
  - GitHub Publish workflow `27217477927`: package checks passed, final `npm publish` failed with `E404`
- Product changes:
  - Bumped package metadata to `0.4.0`.
  - Moved active task lifecycle changelog notes into `0.4.0`.
  - Updated README, npm publishing docs, launch checklist, final handoff, backlog, and product-panel records.
- Worked well:
  - Release prep stayed metadata-only and did not change product behavior.
  - `agentloop task set` made dogfood verification and handoff cite the intended release task.
- Confusing:
  - npm latest remains `0.1.1` until npm trusted publishing or local browser/OTP authentication succeeds.
- Improve:
  - Configure npm trusted publishing or complete local browser/OTP publish before creating another npm-aligned release.
  - Keep future release notes explicit about npm availability until `npm view agentloopkit version` proves the publish.

## 2026-06-09: Task List Command

- Task contract: `.agentloop/tasks/2026-06-09-add-task-list-command.md`
- Product cycle: `.agentloop/research/interview-cycle-023.md`
- Verification report: `.agentloop/reports/2026-06-09-17-46-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-09-17-47-pr-summary.md`
- Trigger:
  - Users could pin an active task, but they had no first-class command to inspect task contracts before choosing one.
  - Product-panel Cycle 23 kept the scope to read-only discovery instead of task-board features.
- Red tests:
  - `npx pnpm@10.12.1 test tests/task-state.test.ts` failed because `listTasks` was missing and `agentloop task list` was an unknown command.
- Verification completed:
  - Focused green test: `npx pnpm@10.12.1 test tests/task-state.test.ts`: pass, 1 file and 5 tests
  - `npx tsx src/cli/index.ts task list --json`: pass, listed task contracts without creating `.agentloop/state.json`
  - `npx tsx src/cli/index.ts task set .agentloop/tasks/2026-06-09-add-task-list-command.md --json`: pass
  - `npx tsx src/cli/index.ts task list`: pass, showed the active task first
  - `git diff --check`: pass
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 test`: pass, 18 files and 45 tests
  - `npx pnpm@10.12.1 build`: pass
  - `npx projscan doctor --format markdown`: A, 100/100
  - `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.4.0.tgz`
  - Tarball smoke: pass, packed `init`, `create-task`, `task list`, `task set`, and `task clear` behaved as expected in a fresh repo
  - `npm publish --access public --dry-run`: pass
  - `agentloop verify --task .agentloop/tasks/2026-06-09-add-task-list-command.md`: pass
  - `agentloop handoff`: pass, wrote the handoff above
  - `agentloop task clear --json`: pass, removed `.agentloop/state.json`
- Product changes:
  - Added `agentloop task list` and `agentloop task list --json`.
  - Listed Markdown task contracts except `README.md`.
  - Marked active tasks and sorted active first, then newest modified task.
  - Updated README, task/status docs, generated harness docs, and agent templates.
- Worked well:
  - The command made task discovery deterministic without adding project management state.
  - Dogfooding caught the need to regenerate the handoff after clearing temporary active-task state.
- Confusing:
  - Sorting by modification time works for local task discovery, but future archive/status lifecycle work may need stronger filtering.
- Improve:
  - Consider a read-only `task show <path>` before adding any richer lifecycle state.

## 2026-06-09: 0.5.0 Task List Release Candidate

- Task contract: `.agentloop/tasks/2026-06-09-prepare-0-5-0-task-list-release.md`
- Product cycle: `.agentloop/research/interview-cycle-024.md`
- Verification report: `.agentloop/reports/2026-06-09-17-54-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-09-17-54-pr-summary.md`
- Trigger:
  - `agentloop task list` landed on `main` after the `v0.4.0` tag.
  - Package metadata still reported `0.4.0`, which would make release artifacts ambiguous.
- Verification completed:
  - `npx tsx src/cli/index.ts version`: pass, reported `0.5.0`
  - `git diff --check`: pass
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 test`: pass, 18 files and 45 tests
  - `npx pnpm@10.12.1 build`: pass
  - `npx projscan doctor --format markdown`: A, 100/100
  - `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.5.0.tgz`
  - Tarball smoke: pass, packed `agentloop version` reported `0.5.0` and `agentloop task list` behaved as expected
  - `npm publish --access public --dry-run`: pass
  - `agentloop verify --task .agentloop/tasks/2026-06-09-prepare-0-5-0-task-list-release.md`: pass
  - `agentloop task clear --json`: pass, removed `.agentloop/state.json`
  - `agentloop handoff`: pass, wrote the handoff above
  - CI run `27218787075`: pass on commit `bf746f5`
  - GitHub release `v0.5.0`: created with attached `agentloopkit-0.5.0.tgz`
  - GitHub Publish workflow `27218845454`: package checks passed, final `npm publish` failed with `E404`
  - Local `npm publish --access public` for `0.5.0`: typecheck pass, Vitest pass with 18 files and 45 tests, build pass, then npm stopped at `EOTP`
  - npm registry check: latest remains `0.1.1`; available versions are `0.1.0` and `0.1.1`
- Product changes:
  - Bumped package metadata to `0.5.0`.
  - Moved task-list changelog notes into `0.5.0`.
  - Updated README, launch checklist, npm publishing docs, final handoff, backlog, and product-panel records.
- Worked well:
  - The release candidate keeps tag, source, package metadata, and tarball contents aligned.
- Confusing:
  - npm latest still remains `0.1.1` until npm accepts a real publish.
- Improve:
  - Configure npm trusted publishing or complete local browser/OTP publish before claiming npm `0.5.0` availability.

## 2026-06-09: Task Show Command

- Task contract: `.agentloop/tasks/2026-06-09-add-task-show-command.md`
- Product cycle: `.agentloop/research/interview-cycle-025.md`
- Verification report: `.agentloop/reports/2026-06-09-18-09-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-09-18-09-pr-summary.md`
- Trigger:
  - `agentloop task list` made task discovery deterministic.
  - Agents still needed shell-specific file reads to inspect a selected task contract.
- Red tests:
  - `npx pnpm@10.12.1 test tests/task-state.test.ts` failed because `readTaskContract` did not exist and `agentloop task show` was an unknown command.
- Verification completed:
  - Focused green test: `npx pnpm@10.12.1 test tests/task-state.test.ts`: pass, 1 file and 8 tests
  - `npx tsx src/cli/index.ts task show .agentloop/tasks/2026-06-09-add-task-show-command.md`: pass
  - `npx tsx src/cli/index.ts task show .agentloop/tasks/2026-06-09-add-task-show-command.md --json`: pass
  - `git diff --check`: pass
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 test`: pass, 18 files and 48 tests
  - `npx pnpm@10.12.1 build`: pass
  - `npx projscan doctor --format markdown`: A, 100/100
  - `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.5.0.tgz`
  - Tarball smoke: pass, packed `agentloop task show` returned Markdown and JSON content without writing `.agentloop/state.json`
  - `agentloop verify --task .agentloop/tasks/2026-06-09-add-task-show-command.md`: pass
  - `agentloop task clear --json`: pass, removed `.agentloop/state.json`
  - `agentloop handoff`: pass, wrote the handoff above
- Product changes:
  - Added `agentloop task show <path>` and `agentloop task show <path> --json`.
  - Reused existing `.agentloop/tasks` path safety rules.
  - Updated README, task/status docs, generated harness docs, and agent templates.
- Worked well:
  - The list/show/set sequence gives agents a local preflight loop without adding task management features.
- Improve:
  - Consider a future `task show --current` only if dogfooding shows path copying remains noisy.

## 2026-06-09: 0.6.0 Task Show Release Candidate

- Task contract: `.agentloop/tasks/2026-06-09-prepare-0-6-0-task-show-release.md`
- Product cycle: `.agentloop/research/interview-cycle-026.md`
- Verification report: `.agentloop/reports/2026-06-09-18-15-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-09-18-15-pr-summary.md`
- Trigger:
  - `agentloop task show` landed on `main` after the `v0.5.0` tag.
  - Package metadata still reported `0.5.0`, which would make release artifacts ambiguous.
- Verification completed:
  - `npx tsx src/cli/index.ts version`: pass, reported `0.6.0`
  - `git diff --check`: pass
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 test`: pass, 18 files and 48 tests
  - `npx pnpm@10.12.1 build`: pass
  - `npx projscan doctor --format markdown`: A, 100/100
  - `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.6.0.tgz`
  - Tarball smoke: pass, packed `agentloop version` reported `0.6.0` and `agentloop task show` behaved as expected
  - `npm publish --access public --dry-run`: pass
  - `agentloop verify --task .agentloop/tasks/2026-06-09-prepare-0-6-0-task-show-release.md`: pass
  - `agentloop task clear --json`: pass, removed `.agentloop/state.json`
  - `agentloop handoff`: pass, wrote the handoff above
- Product changes:
  - Bumped package metadata to `0.6.0`.
  - Moved task-show changelog notes into `0.6.0`.
  - Updated README, launch checklist, npm publishing docs, final handoff, backlog, and product-panel records.
- Worked well:
  - The release candidate keeps tag, source, package metadata, and tarball contents aligned.
- Improve:
  - After the GitHub release, record the publish workflow result and npm registry state.

## 2026-06-09: README Visual Refresh for 0.6.0

- Task contract: `.agentloop/tasks/2026-06-09-refresh-readme-visuals-for-0-6-0.md`
- Product cycle: `.agentloop/research/interview-cycle-027.md`
- Verification report: `.agentloop/reports/2026-06-09-18-26-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-09-18-27-pr-summary.md`
- Trigger:
  - The README visuals existed, but the VHS tape still depended on npm output while npm latest remains behind the current source.
  - The Playwright screenshots had old verification counts and did not show the current task list/show workflow.
- Verification completed:
  - `npx prettier --check ...`: pass for edited Markdown and HTML files
  - `git diff --check`: pass
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 test`: pass, 18 files and 48 tests
  - `npx pnpm@10.12.1 build`: pass
  - `npx projscan doctor --format markdown`: A, 100/100
  - `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.6.0.tgz`
  - Packed CLI smoke: pass, `agentloop version` reported `0.6.0` and `agentloop task show --json` returned the smoke task
  - Playwright screenshot render: pass for `agentloopkit-showcase.png` and `agentloopkit-verification.png`
  - VHS render: pass for `agentloopkit-cli.gif`
  - `agentloop verify --task .agentloop/tasks/2026-06-09-refresh-readme-visuals-for-0-6-0.md`: pass
  - `agentloop task clear --json`: pass, removed `.agentloop/state.json`
  - `agentloop handoff`: pass, wrote the handoff above
- Product changes:
  - Refreshed README hero and verification screenshots with Playwright.
  - Regenerated the README terminal GIF with VHS from a locally packed `0.6.0` tarball.
  - Updated README copy to state the source-versus-npm version split directly.
  - Recorded product-panel cycle 27 and backlog scoring.
- Worked well:
  - Packing the local build inside the VHS tape avoids stale npm output while preserving an end-user-like install path.
  - The screenshots now show task inspection and current verification counts.
- Confusing:
  - The tape hardcodes the current tarball name, so future version bumps should update the tape before rerendering.
- Improve:
  - Consider a tiny asset-render script later if README screenshot regeneration becomes frequent.

## 2026-06-09: 0.6.0 GitHub Release and npm Auth Result

- Release: `v0.6.0`
- Commit: `284cd2a2f1730213527370884d3efa1931ae9158`
- GitHub release: https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.6.0
- Attached asset: `agentloopkit-0.6.0.tgz`
- CI run: `27220632864`
- Publish workflow run: `27220705510`
- npm registry check:
  - latest: `0.1.1`
  - versions: `0.1.0`, `0.1.1`
- Verification completed:
  - GitHub CI for `284cd2a`: pass
  - GitHub release creation: pass
  - GitHub Publish workflow package checks: pass
  - GitHub Publish workflow final `npm publish`: failed with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`
  - Local `npm whoami`: pass, reported `abhiyoheswaran`
  - Local `npm publish --access public`: typecheck pass, Vitest pass with 18 files and 48 tests, build pass, then npm stopped at `EOTP`
- Product changes:
  - GitHub now has a public `v0.6.0` release with npm-pending notes.
  - Launch checklist, npm publishing docs, and final handoff record the actual npm blocker.
- Worked well:
  - GitHub release and tarball distribution are available while npm auth remains blocked.
- Improve:
  - Configure npm trusted publishing for `abhiyoheswaran1/AgentLoopKit` and workflow `publish.yml`, or complete local browser/OTP auth for `0.6.0`.

## 2026-06-09: Monorepo Doctor Awareness

- Task contract: `.agentloop/tasks/2026-06-09-add-monorepo-doctor-awareness.md`
- Product cycle: `.agentloop/research/interview-cycle-028.md`
- Verification report: `.agentloop/reports/2026-06-09-18-40-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-09-18-40-pr-summary.md`
- Trigger:
  - `doctor` reported project type and scripts but did not warn when AgentLoopKit was running at a workspace root.
  - Teams using workspaces need a visible reminder that root-level verification may not cover every package.
- Red tests:
  - `npx pnpm@10.12.1 test tests/project-detection.test.ts tests/doctor.test.ts` failed because `detectMonorepo` did not exist and doctor did not include a `Monorepo` check.
- Verification completed:
  - Focused green test: `npx pnpm@10.12.1 test tests/project-detection.test.ts tests/doctor.test.ts`: pass, 2 files and 8 tests
  - CLI smoke in a temp workspace root: pass, `doctor --json` reported `package.json workspaces`, `pnpm-workspace.yaml`, and `turbo.json`
  - `git diff --check`: pass
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 test`: pass, 18 files and 51 tests
  - `npx pnpm@10.12.1 build`: pass
  - `npx projscan doctor --format markdown`: A, 100/100
  - `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.6.0.tgz`
  - Packed CLI smoke: pass, `agentloop doctor --json` reported package workspaces and `nx.json`
  - `agentloop verify --task .agentloop/tasks/2026-06-09-add-monorepo-doctor-awareness.md`: pass
  - `agentloop task clear --json`: pass, removed `.agentloop/state.json`
  - `agentloop handoff`: pass, wrote the handoff above
- Product changes:
  - Added `detectMonorepo` for package workspaces, `pnpm-workspace.yaml`, `turbo.json`, `nx.json`, `lerna.json`, and `rush.json`.
  - Added a `Monorepo` doctor check that warns instead of failing.
  - Updated README, getting-started docs, changelog, roadmap, backlog, and product-panel record.
- Worked well:
  - Detection stayed transparent and did not change config schema or project type semantics.
- Improve:
  - Add per-package verification guidance later without building a workspace orchestrator.

## 2026-06-09: 0.7.0 Monorepo Doctor Release Candidate

- Task contract: `.agentloop/tasks/2026-06-09-prepare-0-7-0-monorepo-doctor-release.md`
- Product cycle: `.agentloop/research/interview-cycle-029.md`
- Verification report: `.agentloop/reports/2026-06-09-18-48-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-09-18-48-pr-summary.md`
- Trigger:
  - Monorepo doctor awareness landed after the `v0.6.0` tag.
  - Package metadata still reported `0.6.0`, which already points at the task-show release.
- Verification completed:
  - `npx tsx src/cli/index.ts version`: pass, reported `0.7.0`
  - Packed CLI smoke: pass, packed `agentloop version` reported `0.7.0` and `agentloop doctor --json` reported package workspaces plus `lerna.json`
  - `git diff --check`: pass
  - `npx prettier --check ...`: pass for edited release metadata files
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 test`: pass, 18 files and 51 tests
  - `npx pnpm@10.12.1 build`: pass
  - `npx projscan doctor --format markdown`: A, 100/100
  - `npm publish --access public --dry-run`: pass
  - `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.7.0.tgz`
  - VHS render: pass for `agentloopkit-cli.gif` using the `0.7.0` tarball name
  - `agentloop verify --task .agentloop/tasks/2026-06-09-prepare-0-7-0-monorepo-doctor-release.md`: pass
  - `agentloop task clear --json`: pass, removed `.agentloop/state.json`
  - `agentloop handoff`: pass, wrote the handoff above
- Product changes:
  - Bumped package metadata to `0.7.0`.
  - Moved monorepo doctor notes into a `0.7.0` changelog entry.
  - Updated README, VHS tape, launch checklist, npm publishing docs, final handoff, backlog, and product-panel release records.
- Worked well:
  - The release candidate keeps the new doctor behavior separate from the already-published `v0.6.0` GitHub release.
- Improve:
  - After the GitHub release, record the Publish workflow result and npm registry state.

## 2026-06-09: 0.7.0 GitHub Release and npm Auth Result

- Release: `v0.7.0`
- Commit: `512ef6b3ccb7a6d982ecac40927ba6638ce88373`
- GitHub release: https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.7.0
- Attached asset: `agentloopkit-0.7.0.tgz`
- CI run: `27221802324`
- Publish workflow run: `27221868983`
- npm registry check:
  - latest: `0.1.1`
  - versions: `0.1.0`, `0.1.1`
- Verification completed:
  - GitHub CI for `512ef6b`: pass
  - GitHub release creation: pass
  - GitHub Publish workflow package checks: pass
  - GitHub Publish workflow final `npm publish`: failed with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`
  - Local `npm whoami`: pass, reported `abhiyoheswaran`
  - Local `npm publish --access public`: typecheck pass, Vitest pass with 18 files and 51 tests, build pass, then npm stopped at `EOTP`
- Product changes:
  - GitHub now has a public `v0.7.0` release with npm-pending notes.
  - Launch checklist, npm publishing docs, final handoff, backlog, and release notes record the actual npm blocker.
- Worked well:
  - The release tarball is available from GitHub while npm auth remains blocked.
- Improve:
  - Configure npm trusted publishing for `abhiyoheswaran1/AgentLoopKit` and workflow `publish.yml`, or complete local browser/OTP auth for `0.7.0`.

## 2026-06-09: Per-Package Monorepo Verification Guidance

- Task contract: `.agentloop/tasks/2026-06-09-add-per-package-monorepo-verification-guidance.md`
- Product cycle: `.agentloop/research/interview-cycle-031.md`
- Verification report: `.agentloop/reports/2026-06-09-18-59-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-09-19-02-pr-summary.md`
- Trigger:
  - `agentloop doctor` now warns on monorepo markers, but generated harness docs did not tell agents how to handle package-level checks.
  - Product panel chose guidance over workspace orchestration.
- Red test:
  - `npx pnpm@10.12.1 test tests/init.test.ts` failed because generated templates did not mention package-specific verification.
- Verification completed:
  - Focused green test: `npx pnpm@10.12.1 test tests/init.test.ts`: pass, 1 file and 3 tests
  - `npx prettier --check ...`: pass for edited Markdown, templates, and test file
  - `git diff --check`: pass
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 test`: pass, 18 files and 51 tests
  - `npx pnpm@10.12.1 build`: pass
  - `npx projscan doctor --format markdown`: A, 100/100
  - Built CLI temp init smoke: pass, generated harness files include package-specific verification guidance
  - `agentloop verify --task .agentloop/tasks/2026-06-09-add-per-package-monorepo-verification-guidance.md`: pass
  - Playwright README screenshot render: pass for hero and verification PNGs
  - VHS README terminal render: pass for `agentloopkit-cli.gif`
- Product changes:
  - Generated harness commands now warn agents not to treat root checks as full monorepo proof.
  - Generated workspace README and task README include package-level command examples.
  - README and getting-started docs state that AgentLoopKit does not infer package graphs or run workspace commands automatically.
- Worked well:
  - The change improves monorepo trust without adding a workspace runner, dependency, or config schema change.
- Confusing:
  - A smoke command initially used a nonexistent `--cwd` flag; running the built CLI from inside the temp directory matched actual CLI behavior.
- Improve:
  - Consider adding package-specific command suggestions to `doctor` later while keeping command execution explicit.

## 2026-06-09: Monorepo Doctor Verification Suggestions

- Task contract: `.agentloop/tasks/2026-06-09-add-monorepo-doctor-verification-suggestions.md`
- Product cycle: `.agentloop/research/interview-cycle-032.md`
- Verification report: `.agentloop/reports/2026-06-09-19-07-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-09-19-08-pr-summary.md`
- Trigger:
  - Generated monorepo guidance landed, but `agentloop doctor` itself still only named workspace markers.
  - Product panel chose a message-only improvement over a workspace runner.
- Red test:
  - `npx pnpm@10.12.1 test tests/doctor.test.ts` failed because the Monorepo check message did not mention package-specific verification commands.
- Verification completed:
  - Focused green test: `npx pnpm@10.12.1 test tests/doctor.test.ts`: pass, 1 file and 3 tests
  - `npx prettier --check ...`: pass after formatting backlog and task contract
  - `git diff --check`: pass
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 test`: pass, 18 files and 51 tests
  - `npx pnpm@10.12.1 build`: pass
  - `npx projscan doctor --format markdown`: A, 100/100
  - Built CLI doctor JSON smoke: pass, Monorepo warning includes package-specific verification guidance
  - `npx pnpm@10.12.1 pack`: pass
  - Packed CLI doctor JSON smoke: pass
  - `agentloop verify --task .agentloop/tasks/2026-06-09-add-monorepo-doctor-verification-suggestions.md`: pass
- Product changes:
  - The Monorepo doctor warning now tells users to add package-specific verification commands to the task contract.
  - The warning includes `pnpm --filter`, `npm --workspace`, and package-local examples.
  - JSON output keeps the same structure.
- Worked well:
  - The feature makes `doctor` more actionable without executing new commands.
- Improve:
  - Consider markdown link checking next; it improves launch trust without adding product scope.

## 2026-06-09: Markdown Link Checking

- Task contract: `.agentloop/tasks/2026-06-09-add-markdown-link-checking.md`
- Product cycle: `.agentloop/research/interview-cycle-033.md`
- Verification report: `.agentloop/reports/2026-06-09-19-14-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-09-19-14-pr-summary.md`
- Trigger:
  - The README, docs, examples, and internal agent-loop artifacts now form a large launch surface.
  - CI did not catch broken local Markdown links.
- Red test:
  - `npx pnpm@10.12.1 test tests/markdown-links.test.ts` failed because `src/core/markdown-links.ts` did not exist.
- Verification completed:
  - Focused green test: `npx pnpm@10.12.1 test tests/markdown-links.test.ts`: pass, 1 file and 4 tests
  - `npx prettier --check ...`: pass after formatting new files
  - `git diff --check`: pass
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 test`: pass, 19 files and 55 tests
  - `npx pnpm@10.12.1 check:links`: pass, 246 Markdown files checked
  - `npx pnpm@10.12.1 build`: pass
  - `npx projscan doctor --format markdown`: A, 100/100
  - `npx pnpm@10.12.1 pack`: pass
  - `agentloop verify --task .agentloop/tasks/2026-06-09-add-markdown-link-checking.md`: pass
- Product changes:
  - Added a dependency-free local Markdown link checker.
  - Added `pnpm check:links`.
  - Added CI coverage for local Markdown links.
  - Updated contributor and launch checklists.
- Worked well:
  - The checker validates local docs without network calls or new dependencies.
- Improve:
  - Consider task status transitions next if scope remains small.

## 2026-06-09: 0.8.0 Launch-Quality Release Candidate

- Task contract: `.agentloop/tasks/2026-06-09-prepare-0-8-0-launch-quality-release.md`
- Product cycle: `.agentloop/research/interview-cycle-034.md`
- Verification report: `.agentloop/reports/2026-06-09-19-21-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-09-19-21-pr-summary.md`
- Trigger:
  - Monorepo guidance, actionable doctor warnings, and Markdown link checking landed after `v0.7.0`.
  - Package metadata still reported `0.7.0`.
- Verification completed:
  - `npx tsx src/cli/index.ts version`: pass, reported `0.8.0`
  - `npx prettier --check ...`: pass for release metadata files
  - `git diff --check`: pass
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 test`: pass, 19 files and 55 tests
  - `npx pnpm@10.12.1 check:links`: pass, 251 Markdown files checked
  - `npx pnpm@10.12.1 build`: pass
  - `npx projscan doctor --format markdown`: A, 100/100
  - `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.8.0.tgz`
  - `npm publish --access public --dry-run`: pass
  - Packed CLI smoke: pass, `agentloop version` reported `0.8.0` and `doctor --json` included package-specific verification guidance
  - `agentloop verify --task .agentloop/tasks/2026-06-09-prepare-0-8-0-launch-quality-release.md`: pass
  - VHS README terminal render: pass for `agentloopkit-cli.gif` using the `0.8.0` tarball name
- Product changes:
  - Bumped package metadata to `0.8.0`.
  - Moved unreleased launch-quality notes into the `0.8.0` changelog section.
  - Updated README source note and VHS tape.
  - Updated launch checklist, npm publishing docs, final handoff, backlog, and product-panel records.
- Worked well:
  - The release candidate keeps GitHub tarballs aligned with the current launch-quality source.
- Improve:
  - After the GitHub release, record CI, Publish workflow, local npm publish, and registry status.

## 2026-06-09: 0.8.0 GitHub Release and npm Auth Result

- Release: `v0.8.0`
- Commit: `a6a4f2f9e1309e70868cb76d51503f803afa1966`
- GitHub release: https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.8.0
- Attached asset: `agentloopkit-0.8.0.tgz`
- CI run: `27223604805`
- Publish workflow run: `27223669061`
- npm registry check:
  - latest: `0.1.1`
  - versions: `0.1.0`, `0.1.1`
- Verification completed:
  - GitHub CI for `a6a4f2f`: pass
  - GitHub release creation: pass
  - GitHub Publish workflow package checks: pass
  - GitHub Publish workflow final `npm publish`: failed with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`
  - Local `npm whoami`: pass, reported `abhiyoheswaran`
  - Local `npm publish --access public`: typecheck pass, Vitest pass with 19 files and 55 tests, build pass, then npm stopped at `EOTP`
- Product changes:
  - GitHub now has a public `v0.8.0` release with npm-pending notes.
  - Launch checklist, npm publishing docs, final handoff, backlog, and release notes record the actual npm blocker.
- Worked well:
  - The release tarball is available from GitHub while npm auth remains blocked.
- Improve:
  - Configure npm trusted publishing for `abhiyoheswaran1/AgentLoopKit` and workflow `publish.yml`, or complete local browser/OTP auth for `0.8.0`.

## 2026-06-09: Task Status Transitions

- Task contract: `.agentloop/tasks/2026-06-09-add-task-status-transitions.md`
- Product cycle: `.agentloop/research/interview-cycle-036.md`
- Verification report: `.agentloop/reports/2026-06-09-19-40-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-09-19-41-pr-summary.md`
- Trigger:
  - Agents can pin, list, and read task contracts, but status still required hand-editing Markdown.
  - The product panel wanted a lifecycle command without a task database or dashboard.
- Red test:
  - `npx pnpm@10.12.1 test tests/task-state.test.ts` failed because `updateTaskStatus` did not exist and `agentloop task status` was unknown.
- Verification completed:
  - Focused green test: `npx pnpm@10.12.1 test tests/task-state.test.ts`: pass, 1 file and 11 tests
  - `git diff --check`: pass
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 test`: pass, 19 files and 58 tests
  - `npx pnpm@10.12.1 check:links`: pass, 255 Markdown files checked
  - `npx pnpm@10.12.1 build`: pass
  - `npx projscan doctor --format markdown`: A, 100/100
  - `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.8.0.tgz`
  - Packed CLI smoke: pass, `agentloop task status` updated a temp task to `done`
  - Playwright README screenshot render: pass for hero and verification PNGs
  - VHS README terminal render: pass for `agentloopkit-cli.gif` with the new status command
  - `agentloop verify --task .agentloop/tasks/2026-06-09-add-task-status-transitions.md`: pass
- Product changes:
  - Added `agentloop task status <path> <status>`.
  - Added a fixed status set: `proposed`, `in-progress`, `blocked`, `review`, and `done`.
  - Added JSON output for status updates.
  - Updated README, docs, generated harness files, and agent templates.
  - Refreshed README Playwright screenshots and VHS GIF.
- Worked well:
  - The new command lets agents keep task state current without adding hidden state beyond the existing active-task pointer.
- Improve:
  - Prepare a new release candidate after this feature, because `v0.8.0` already points at the previous launch-quality release.

## 2026-06-09: 0.9.0 Task Status Release Candidate

- Task contract: `.agentloop/tasks/2026-06-09-prepare-0-9-0-task-status-release.md`
- Product cycle: `.agentloop/research/interview-cycle-037.md`
- Verification report: `.agentloop/reports/2026-06-09-19-51-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-09-19-52-pr-summary.md`
- Trigger:
  - Task status transitions landed on `main` after the `v0.8.0` release.
  - Version metadata and release docs still pointed at `0.8.0`.
- Verification completed:
  - `npx tsx src/cli/index.ts version`: pass, reported `0.9.0`
  - `git diff --check`: pass
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 test`: pass, 19 files and 58 tests
  - `npx pnpm@10.12.1 check:links`: pass, 259 Markdown files checked
  - `npx pnpm@10.12.1 build`: pass
  - `npx projscan doctor --format markdown`: A, 100/100
  - `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.9.0.tgz`
  - `npm publish --access public --dry-run`: pass
  - Packed CLI smoke: pass, `agentloop version` reported `0.9.0` and `agentloop task status` updated a temp task to `done`
  - Playwright README screenshot render: pass for hero and verification PNGs
  - VHS README terminal render: pass for `agentloopkit-cli.gif` using the `0.9.0` tarball name
  - `agentloop verify --task .agentloop/tasks/2026-06-09-prepare-0-9-0-task-status-release.md`: pass
- Product changes:
  - Bumped package metadata to `0.9.0`.
  - Added a `0.9.0` changelog entry.
  - Updated README source note and VHS tape.
  - Updated launch checklist, npm publishing docs, final handoff, backlog, and product-panel records.
- Worked well:
  - Separating the feature commit from the release commit kept history easier to audit.
- Improve:
  - After the GitHub release, record CI, Publish workflow, local npm publish, and registry status.

## 2026-06-09: 0.9.0 GitHub Release and npm Auth Result

- Task contract: `.agentloop/tasks/2026-06-09-document-0-9-0-release-status.md`
- Product cycle: `.agentloop/research/interview-cycle-038.md`
- Verification report: `.agentloop/reports/2026-06-09-19-58-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-09-19-58-pr-summary.md`
- Release: `v0.9.0`
- Commit: `0bcd98988f10dbdb05a086c2af2582a90a125664`
- GitHub release: https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.9.0
- Attached asset: `agentloopkit-0.9.0.tgz`
- Tarball SHA-256: `698e76183afd614ee310f9ff4538a9832b3206edce5bb124b54c20a2a37bf6e1`
- CI run: `27225285803`
- Publish workflow run: `27225348061`
- npm registry check:
  - latest: `0.1.1`
  - versions: `0.1.0`, `0.1.1`
- Verification completed:
  - GitHub CI for `0bcd989`: pass
  - GitHub release creation: pass
  - GitHub Publish workflow package checks: pass
  - GitHub Publish workflow final `npm publish`: failed with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`
  - npm registry check: pass, latest remains `0.1.1`
  - `git diff --check`: pass
  - `npx pnpm@10.12.1 check:links`: pass, 263 Markdown files checked
  - `agentloop verify --task .agentloop/tasks/2026-06-09-document-0-9-0-release-status.md`: pass
- Product changes:
  - GitHub now has a public `v0.9.0` release with npm-pending notes.
  - Launch checklist, npm publishing docs, final handoff, backlog, and release notes record the actual npm blocker.
- Worked well:
  - The release tarball is available from GitHub while npm auth remains blocked.
- Improve:
  - Configure npm trusted publishing for `abhiyoheswaran1/AgentLoopKit` and workflow `publish.yml`, or complete local browser/OTP auth for `0.9.0`.

## 2026-06-09: Shell Completions

- Task contract: `.agentloop/tasks/2026-06-09-add-shell-completions.md`
- Product cycle: `.agentloop/research/interview-cycle-039.md`
- Verification report: `.agentloop/reports/2026-06-09-20-07-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-09-20-09-pr-summary.md`
- Trigger:
  - Repeat CLI users now have task listing, task reading, active task pinning, status changes, status, verify, and handoff commands.
  - The growing command surface needs tab completion without a dotfile installer or new dependency.
- Red test:
  - `npx pnpm@10.12.1 test tests/completion.test.ts` failed before implementation because `src/core/completions.ts` did not exist.
- Verification completed:
  - Focused green test: `npx pnpm@10.12.1 test tests/completion.test.ts`: pass, 1 file and 6 tests
  - `git diff --check`: pass
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 test`: pass, 20 files and 64 tests
  - `npx pnpm@10.12.1 check:links`: pass, 265 Markdown files checked
  - `npx pnpm@10.12.1 build`: pass
  - `npx projscan doctor --format markdown`: A, 100/100
  - `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.9.0.tgz`
  - Packed CLI smoke: pass for zsh, bash, fish, and unsupported-shell failure output
  - `agentloop verify --task .agentloop/tasks/2026-06-09-add-shell-completions.md`: pass
- Product changes:
  - Added `agentloop completion <bash|zsh|fish>`.
  - Added static bash, zsh, and fish completion scripts.
  - Completion covers top-level commands, task subcommands, task status values, completion shells, and install-agent names.
  - Updated README and getting-started docs.
- Worked well:
  - The command gives repeat users CLI polish while keeping the security story simple: print only, no shell profile mutation.
- Improve:
  - Prepare a new release candidate after this feature, because `v0.9.0` already points at the task-status release.

## 2026-06-09: 0.10.0 Shell Completions Release Candidate

- Task contract: `.agentloop/tasks/2026-06-09-prepare-0-10-0-shell-completions-release.md`
- Product cycle: `.agentloop/research/interview-cycle-040.md`
- Verification report: `.agentloop/reports/2026-06-09-20-16-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-09-20-18-pr-summary.md`
- Trigger:
  - Shell completions landed on `main` after the `v0.9.0` release.
  - Package metadata, changelog, README status, and visual assets needed to match the new source state.
- Verification completed:
  - `npx tsx src/cli/index.ts version`: pass, reported `0.10.0`
  - Playwright README screenshot render: pass for `agentloopkit-showcase.png` and `agentloopkit-verification.png`
  - VHS README terminal render: pass for `agentloopkit-cli.gif` using the `0.10.0` tarball name and showing `agentloop completion zsh`
  - `git diff --check`: pass
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 test`: pass, 20 files and 64 tests
  - `npx pnpm@10.12.1 check:links`: pass, 269 Markdown files checked
  - `npx pnpm@10.12.1 build`: pass
  - `npx projscan doctor --format markdown`: A, 100/100
  - `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.10.0.tgz`
  - `npm publish --access public --dry-run`: pass
  - Packed CLI smoke: pass, `agentloop version` reported `0.10.0` and completions rendered for zsh, bash, and fish
  - `agentloop verify --task .agentloop/tasks/2026-06-09-prepare-0-10-0-shell-completions-release.md`: pass
- Product changes:
  - Bumped package metadata to `0.10.0`.
  - Added a `0.10.0` changelog entry.
  - Updated README source note, quickstart command list, and visual alt text.
  - Refreshed Playwright screenshots and VHS GIF.
  - Updated launch checklist, npm publishing docs, final handoff, backlog, and product-panel records.
- Worked well:
  - The release candidate keeps the GitHub source, tarball, README, and visual assets aligned.
- Improve:
  - After the GitHub release, record CI, Publish workflow, local npm publish, and registry status.

## 2026-06-09: 0.10.0 GitHub Release and npm Auth Result

- Task contract: `.agentloop/tasks/2026-06-09-document-0-10-0-release-status.md`
- Product cycle: `.agentloop/research/interview-cycle-041.md`
- Verification report: `.agentloop/reports/2026-06-09-20-26-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-09-20-26-pr-summary.md`
- Release: `v0.10.0`
- Commit: `c7bfbc55aacbacd9ff3c93713790786644f6698c`
- GitHub release: https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.10.0
- Attached asset: `agentloopkit-0.10.0.tgz`
- Tarball SHA-256: `c5966164b6c32e781c87ad180f994dfb50e3a2459b043d271d766c2aa424228f`
- CI run: `27226743041`
- Publish workflow run: `27226815977`
- npm registry check:
  - latest: `0.1.1`
  - versions: `0.1.0`, `0.1.1`
- Verification completed:
  - GitHub CI for `c7bfbc5`: pass
  - GitHub release creation: pass
  - GitHub Publish workflow package checks: pass
  - GitHub Publish workflow final `npm publish`: failed with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`
  - npm registry check: pass, latest remains `0.1.1`
- Product changes:
  - GitHub now has a public `v0.10.0` release with npm-pending notes.
  - Launch checklist, npm publishing docs, final handoff, backlog, and release notes record the actual npm blocker.
- Worked well:
  - The release tarball is available from GitHub while npm auth remains blocked.
- Improve:
  - Configure npm trusted publishing for `abhiyoheswaran1/AgentLoopKit` and workflow `publish.yml`, or complete local browser/OTP auth for `0.10.0`.

## 2026-06-09: Task Archive Command

- Task contract: `.agentloop/tasks/2026-06-09-add-task-archive-command.md`
- Product cycle: `.agentloop/research/interview-cycle-042.md`
- Verification report: `.agentloop/reports/2026-06-09-20-40-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-09-20-41-pr-summary.md`
- Trigger:
  - Completed task contracts stayed in `.agentloop/tasks/` and continued to appear in normal task lists.
  - The product panel chose a single-file archive command over a task database, dashboard, bulk action, or delete command.
- Red tests:
  - `npx pnpm@10.12.1 test tests/task-state.test.ts` failed because `archiveTask` did not exist and `agentloop task archive` was unknown.
  - `npx pnpm@10.12.1 test tests/completion.test.ts` failed because task completions did not include `archive`.
- Verification completed:
  - Focused green test: `npx pnpm@10.12.1 test tests/task-state.test.ts`: pass, 1 file and 14 tests
  - Focused completion test: `npx pnpm@10.12.1 test tests/completion.test.ts`: pass, 1 file and 6 tests
  - `git diff --check`: pass
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 test`: pass, 20 files and 67 tests
  - `npx pnpm@10.12.1 check:links`: pass, 279 Markdown files checked
  - `npx pnpm@10.12.1 build`: pass
  - `npx projscan doctor --format markdown`: A, 100/100
  - Built CLI smoke: pass, archived a temp task, removed it from list output, and cleared active state
  - `agentloop verify --task .agentloop/tasks/2026-06-09-add-task-archive-command.md`: pass
- Product changes:
  - Added `agentloop task archive <path>`.
  - Added a core archive helper that preserves Markdown content, refuses destination collisions, and clears stale active state when needed.
  - Kept normal `task list` focused by moving archived files under `.agentloop/tasks/archive/`.
  - Updated shell completions, README, docs, harness files, and agent templates.
- Worked well:
  - The command improves task hygiene without adding a database or deleting history.
- Improve:
  - Prepare a new release candidate after this feature, because `v0.10.0` already points at shell completions.

## 2026-06-09: 0.11.0 Task Archive Release Candidate

- Task contract: `.agentloop/tasks/2026-06-09-prepare-0-11-0-task-archive-release.md`
- Product cycle: `.agentloop/research/interview-cycle-043.md`
- Verification report: `.agentloop/reports/2026-06-09-20-53-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-09-20-55-pr-summary.md`
- Trigger:
  - `agentloop task archive <path>` landed on `main` after the `v0.10.0` release.
  - Package metadata, changelog, README status, and visual assets needed to match the task archive workflow.
- Verification completed:
  - `npx tsx src/cli/index.ts version`: pass, reported `0.11.0`
  - `node dist/cli/index.js version`: pass, reported `0.11.0`
  - Playwright README screenshot render: pass for `agentloopkit-showcase.png` and `agentloopkit-verification.png`
  - VHS README terminal render: pass for `agentloopkit-cli.gif` using the `0.11.0` tarball name and showing `agentloop task archive`
  - `git diff --check`: pass
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 test`: pass, 20 files and 67 tests
  - `npx pnpm@10.12.1 check:links`: pass, 283 Markdown files checked
  - `npx pnpm@10.12.1 build`: pass
  - `npx projscan doctor --format markdown`: A, 100/100
  - `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.11.0.tgz`
  - `npm publish --access public --dry-run`: pass
  - Packed CLI smoke: pass, `agentloop version` reported `0.11.0`, `task archive` moved a smoke task, `task list --json` returned no active tasks, and `task current --json` returned null
  - npm registry proof: latest `0.1.1`, versions `0.1.0` and `0.1.1`
  - `agentloop verify --task .agentloop/tasks/2026-06-09-prepare-0-11-0-task-archive-release.md`: pass
- Product changes:
  - Bumped package metadata to `0.11.0`.
  - Added a `0.11.0` changelog entry.
  - Updated README source note, command flow, and visual alt text.
  - Refreshed Playwright screenshots and VHS GIF.
  - Updated launch checklist, npm publishing docs, final handoff, backlog, and product-panel records.
- Worked well:
  - The release candidate keeps the task archive workflow visible in README assets without adding new scope.
- Improve:
  - After the GitHub release, record CI, Publish workflow, npm registry state, and tarball digest.

## 2026-06-09: 0.11.0 GitHub Release and npm Auth Result

- Task contract: `.agentloop/tasks/2026-06-09-document-0-11-0-release-status.md`
- Product cycle: `.agentloop/research/interview-cycle-044.md`
- Verification report: `.agentloop/reports/2026-06-09-21-06-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-09-21-07-pr-summary.md`
- Release: `v0.11.0`
- Commit: `caf98b012ccfa26930c59934e6d5e4104f5bdc7d`
- GitHub release: https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.11.0
- Attached asset: `agentloopkit-0.11.0.tgz`
- Tarball SHA-256: `3d9d312e8e824cce5a4d961388d64782254800532e442a2486a1273555690677`
- CI run: `27228808126`
- Publish workflow run: `27228991068`
- npm registry check:
  - latest: `0.1.1`
  - versions: `0.1.0`, `0.1.1`
- Verification completed:
  - GitHub CI for `caf98b0`: pass
  - GitHub release creation: pass
  - GitHub release asset upload: pass, digest matches local SHA-256
  - GitHub Publish workflow package checks: pass
  - GitHub Publish workflow final `npm publish`: failed with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`
  - npm registry check: pass, latest remains `0.1.1`
- Product changes:
  - GitHub now has a public `v0.11.0` release with npm-pending notes.
  - Launch checklist, npm publishing docs, final handoff, backlog, and release notes record the actual npm blocker.
- Worked well:
  - The release tarball is available from GitHub while npm auth remains blocked.
- Improve:
  - Configure npm trusted publishing for `abhiyoheswaran1/AgentLoopKit` and workflow `publish.yml`, or complete local browser/OTP auth for `0.11.0`.

## 2026-06-09: create-task JSON Output

- Task contract: `.agentloop/tasks/2026-06-09-add-create-task-json-output.md`
- Product cycle: `.agentloop/research/interview-cycle-045.md`
- Verification report: `.agentloop/reports/2026-06-09-21-19-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-09-21-24-pr-summary.md`
- Trigger:
  - Dogfooding tried `agentloop create-task --json` during release automation and the command rejected the option.
  - Nearby task commands already support JSON output.
- Red test:
  - `npx pnpm@10.12.1 test tests/create-task.test.ts` failed because `create-task` rejected `--json`.
- Verification completed:
  - Focused green test: `npx pnpm@10.12.1 test tests/create-task.test.ts`: pass, 1 file and 3 tests
  - `git diff --check`: pass
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 test`: pass, 20 files and 68 tests
  - `npx pnpm@10.12.1 check:links`: pass, 289 Markdown files checked
  - `npx pnpm@10.12.1 build`: pass
  - `npx projscan doctor --format markdown`: A, 100/100
  - Built CLI smoke: pass, `create-task --json` returned `task.path` and `task.markdown`
  - `agentloop verify --task .agentloop/tasks/2026-06-09-add-create-task-json-output.md`: pass
- Product changes:
  - Added `agentloop create-task --json`.
  - Kept default text output unchanged.
  - Updated README, task-contract docs, getting-started docs, and generated task README guidance.
- Worked well:
  - The change removes brittle parsing for agents without changing task storage.
- Improve:
  - Package this in the next release candidate because `v0.11.0` already points at task archiving.

## 2026-06-09: 0.12.0 Release Candidate

- Task contract: `.agentloop/tasks/2026-06-09-prepare-0-12-0-create-task-json-release.md`
- Product cycle: `.agentloop/research/interview-cycle-046.md`
- Verification report: `.agentloop/reports/2026-06-09-21-35-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-09-21-35-pr-summary.md`
- Trigger:
  - `create-task --json` is implemented on `main`, but package metadata, README visuals, and release notes still pointed at `0.11.0`.
  - README screenshots showed 67 tests while the suite now has 68.
- Verification completed:
  - Source CLI version: `npx tsx src/cli/index.ts version`: pass, reported `0.12.0`
  - Built CLI version: `node dist/cli/index.js version`: pass, reported `0.12.0`
  - Playwright README screenshot render: pass for `agentloopkit-showcase.png` and `agentloopkit-verification.png`
  - VHS README terminal render: pass for `agentloopkit-cli.gif` using the `0.12.0` tarball name and showing `create-task --json`
  - `git diff --check`: pass
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 test`: pass, 20 files and 68 tests
  - `npx pnpm@10.12.1 check:links`: pass, 295 Markdown files checked
  - `npx pnpm@10.12.1 build`: pass
  - `npx projscan doctor --format markdown`: A, 100/100
  - `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.12.0.tgz`
  - `npm publish --access public --dry-run`: pass
  - Packed CLI smoke: pass, `agentloop version` reported `0.12.0` and `create-task --json` returned `task.path` and `task.markdown`
  - npm registry proof: latest `0.1.1`, versions `0.1.0` and `0.1.1`
- Tarball SHA-256: `13c69f4016dc2eb1876e4469fe7f51d1c1f75f4edb04936b10bc5410ab491903`
- Product changes:
  - Bumped package metadata to `0.12.0`.
  - Added a `0.12.0` changelog entry.
  - Updated README source note and refreshed README visual assets.
  - Updated launch checklist, npm publishing docs, final handoff, backlog, and product-panel records.
- Worked well:
  - The `create-task --json` release is small, easy to explain, and improves agent scripting without changing defaults.
- Improve:
  - After the GitHub release, record CI, Publish workflow, npm registry state, and tarball digest.

## 2026-06-09: 0.12.0 GitHub Release and npm Auth Result

- Task contract: `.agentloop/tasks/2026-06-09-document-0-12-0-release-status.md`
- Product cycle: `.agentloop/research/interview-cycle-047.md`
- Verification report: `.agentloop/reports/2026-06-09-21-42-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-09-21-42-pr-summary.md`
- Release: `v0.12.0`
- Commit: `8652219715a85fc14596e9b892a0d3dca0d0f9c1`
- GitHub release: https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.12.0
- Attached asset: `agentloopkit-0.12.0.tgz`
- Tarball SHA-256: `13c69f4016dc2eb1876e4469fe7f51d1c1f75f4edb04936b10bc5410ab491903`
- CI run: `27230968980`
- Publish workflow run: `27231031745`
- npm registry check:
  - latest: `0.1.1`
  - versions: `0.1.0`, `0.1.1`
- Verification completed:
  - GitHub CI for `8652219`: pass
  - GitHub release creation: pass
  - GitHub release asset upload: pass, digest matches local SHA-256
  - GitHub Publish workflow package checks: pass
  - GitHub Publish workflow final `npm publish`: failed with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`
  - npm registry check: pass, latest remains `0.1.1`
- Product changes:
  - GitHub now has a public `v0.12.0` release with npm-pending notes.
  - Launch checklist, npm publishing docs, final handoff, backlog, and release notes record the actual npm blocker.
- Worked well:
  - The release tarball is available from GitHub while npm auth remains blocked.
- Improve:
  - Configure npm trusted publishing for `abhiyoheswaran1/AgentLoopKit` and workflow `publish.yml`, or complete local browser/OTP auth for `0.12.0`.

## 2026-06-09: check-gates Command

- Task contract: `.agentloop/tasks/2026-06-09-add-check-gates-command.md`
- Product cycle: `.agentloop/research/interview-cycle-048.md`
- Verification report: `.agentloop/reports/2026-06-09-21-52-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-09-21-53-pr-summary.md`
- Trigger:
  - Product panel selected `check-gates` as the next low-risk P1 after `v0.12.0`.
  - Agents needed one local command to check review evidence without running tests or calling an LLM.
- Red test:
  - `npx pnpm@10.12.1 test tests/check-gates.test.ts` failed because `agentloop check-gates` did not exist.
- Verification completed:
  - Focused green test: `npx pnpm@10.12.1 test tests/check-gates.test.ts`: pass, 1 file and 2 tests
  - Completion focused test: `npx pnpm@10.12.1 test tests/completion.test.ts`: pass, 1 file and 6 tests
  - `git diff --check`: pass
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 test`: pass, 21 files and 70 tests
  - `npx pnpm@10.12.1 check:links`: pass, 304 Markdown files checked
  - `npx pnpm@10.12.1 build`: pass
  - `npx projscan doctor --format markdown`: A, 100/100
  - Built CLI smoke: pass, missing evidence returned `overallStatus: fail` and `agentloop create-task`
  - Dogfood `agentloop check-gates --json`: pass, overall status `pass` with task, verification, handoff, harness, policy, and git gates
  - `agentloop verify --task .agentloop/tasks/2026-06-09-add-check-gates-command.md`: pass
- Product changes:
  - Added `agentloop check-gates` and `agentloop check-gates --json`.
  - Added gate checks for task contract, verification report, handoff summary, repo harness, safety policies, and git context.
  - Updated README, getting-started docs, gate-check docs, generated harness guidance, shell completions, and agent templates.
- Worked well:
  - The command gives review readiness without turning AgentLoopKit into a policy engine.
- Improve:
  - Consider `--strict` later if users want warnings to fail in CI.

## 2026-06-09: 0.13.0 Release Candidate

- Task contract: `.agentloop/tasks/2026-06-09-prepare-0-13-0-check-gates-release.md`
- Product cycle: `.agentloop/research/interview-cycle-049.md`
- Verification report: `.agentloop/reports/2026-06-09-22-04-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-09-22-06-pr-summary.md`
- Trigger:
  - `check-gates` is implemented on `main`, but package metadata, README visuals, and release docs still pointed at `0.12.0`.
  - README screenshots showed 68 tests while the suite now has 70.
- Verification completed:
  - Source CLI version: `npx tsx src/cli/index.ts version`: pass, reported `0.13.0`
  - Built CLI version: `node dist/cli/index.js version`: pass, reported `0.13.0`
  - Playwright README screenshot render: pass for `agentloopkit-showcase.png` and `agentloopkit-verification.png`
  - VHS README terminal render: pass for `agentloopkit-cli.gif` using the `0.13.0` tarball name and showing `check-gates`
  - `git diff --check`: pass
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 test`: pass, 21 files and 70 tests
  - `npx pnpm@10.12.1 check:links`: pass, 306 Markdown files checked
  - `npx pnpm@10.12.1 build`: pass
  - `npx projscan doctor --format markdown`: A, 100/100
  - `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.13.0.tgz`
  - `npm publish --access public --dry-run`: pass
  - Packed CLI smoke: pass, `agentloop version` reported `0.13.0`, missing evidence returned `agentloop create-task`, and task plus verification plus handoff made `check-gates` pass
  - npm registry proof: latest `0.1.1`, versions `0.1.0` and `0.1.1`
- Tarball SHA-256: `2c04fd3eba66fe662fb6fe97037b3950099d228b3759d2b418dcb57debef7e18`
- Product changes:
  - Bumped package metadata to `0.13.0`.
  - Added a `0.13.0` changelog entry.
  - Refreshed README source note, screenshots, and VHS terminal demo for `check-gates`.
  - Updated launch checklist, npm publishing docs, final handoff, backlog, and product-panel records.
- Worked well:
  - The packed artifact proves both `check-gates` failure and pass paths in a fresh repo.
- Improve:
  - After the GitHub release, record CI, Publish workflow, npm registry state, and release asset digest.

## 2026-06-09: 0.13.0 GitHub Release and npm Auth Result

- Task contract: `.agentloop/tasks/2026-06-09-document-0-13-0-release-status.md`
- Product cycle: `.agentloop/research/interview-cycle-050.md`
- Verification report: `.agentloop/reports/2026-06-09-22-15-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-09-22-15-pr-summary.md`
- Release: `v0.13.0`
- Commit: `193916c23450c6c619c7732c80c8f339ce875109`
- GitHub release: https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.13.0
- Attached asset: `agentloopkit-0.13.0.tgz`
- Tarball SHA-256: `2c04fd3eba66fe662fb6fe97037b3950099d228b3759d2b418dcb57debef7e18`
- CI run: `27232669795`
- Publish workflow run: `27232852066`
- npm registry check:
  - latest: `0.1.1`
  - versions: `0.1.0`, `0.1.1`
- Verification completed:
  - GitHub CI for `193916c`: pass
  - GitHub release creation: pass
  - GitHub release asset upload: pass, digest matches local SHA-256
  - GitHub Publish workflow package checks: pass
  - GitHub Publish workflow final `npm publish`: failed with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`
  - Local `npm publish --access public`: package checks passed, then npm stopped at `EOTP` for browser/OTP authentication
  - npm registry check: pass, latest remains `0.1.1`
- Product changes:
  - GitHub now has a public `v0.13.0` release with npm-pending notes.
  - Release notes explain that npm may jump from `0.1.1` to `0.13.0` because intermediate versions were GitHub-only while npm publish was blocked.
  - Launch checklist, npm publishing docs, final handoff, backlog, and release notes record the actual npm blocker.
- Worked well:
  - The release tarball is available from GitHub while npm auth remains blocked.
- Improve:
  - Complete local browser/OTP auth for `0.13.0`, or configure npm trusted publishing for `abhiyoheswaran1/AgentLoopKit` and workflow `publish.yml`.

## 2026-06-09: check-gates Strict Mode

- Task contract: `.agentloop/tasks/2026-06-09-add-check-gates-strict-mode.md`
- Product cycle: `.agentloop/research/interview-cycle-051.md`
- Verification report: `.agentloop/reports/2026-06-09-22-27-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-09-22-28-pr-summary.md`
- Trigger:
  - CI users could run `check-gates`, but warning-only results still exited `0`.
  - Product panel chose a one-flag strict mode instead of a policy DSL.
- Red test:
  - `npx pnpm@10.12.1 test tests/check-gates.test.ts` failed because JSON had no `strict` field and strict behavior did not exist.
- Verification completed:
  - Focused green test: `npx pnpm@10.12.1 test tests/check-gates.test.ts`: pass, 1 file and 3 tests
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 check:links`: pass, 314 Markdown files checked
  - `npx projscan doctor --format markdown`: A, 100/100
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 test`: pass, 21 files and 71 tests
  - `npx pnpm@10.12.1 build`: pass
  - Built CLI smoke: pass, default warning exited `0`; strict warning exited `1`; JSON recorded `strict`
  - `agentloop verify --task .agentloop/tasks/2026-06-09-add-check-gates-strict-mode.md`: pass
- Product changes:
  - Added `agentloop check-gates --strict`.
  - Preserved default warning behavior.
  - Added `strict` to JSON output and strict-mode text to Markdown output.
  - Updated README, getting-started docs, gate-check docs, generated harness guidance, backlog, and final handoff.
- Worked well:
  - Strict mode gives CI a deterministic failure path without changing local defaults.
- Improve:
  - Add GitHub Actions recipes for `agentloop verify`, `agentloop handoff`, and `agentloop check-gates --strict` in a later cycle.

## 2026-06-09: 0.14.0 Release Candidate

- Task contract: `.agentloop/tasks/2026-06-09-prepare-0-14-0-strict-gates-release.md`
- Product cycle: `.agentloop/research/interview-cycle-052.md`
- Verification report: `.agentloop/reports/2026-06-09-22-40-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-09-22-42-pr-summary.md`
- Trigger:
  - `check-gates --strict` is on `main`, but `v0.13.0` does not contain it.
  - Product panel chose a catch-up `0.14.0` release candidate instead of reusing the existing tag.
- Verification completed:
  - Source CLI version: `npx tsx src/cli/index.ts version`: pass, reported `0.14.0`
  - Built CLI version: `node dist/cli/index.js version`: pass, reported `0.14.0`
  - Playwright README screenshot render: pass for `agentloopkit-showcase.png` and `agentloopkit-verification.png`
  - VHS README terminal render: pass for `agentloopkit-cli.gif` using the `0.14.0` tarball name and showing `check-gates --strict`
  - `git diff --check`: pass
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 test`: pass, 21 files and 71 tests
  - `npx pnpm@10.12.1 check:links`: pass, 320 Markdown files checked
  - `npx pnpm@10.12.1 build`: pass
  - `npx projscan doctor --format markdown`: A, 100/100
  - `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.14.0.tgz`
  - `npm publish --access public --dry-run`: pass
  - Packed CLI smoke: pass, `agentloop version` reported `0.14.0`, and `check-gates --strict --json` passed with task, verification, and handoff evidence
  - Packed strict warning smoke: pass, `check-gates --strict --json` exited `1` with warning-only evidence
  - `agentloop verify --task .agentloop/tasks/2026-06-09-prepare-0-14-0-strict-gates-release.md`: pass
  - npm registry proof: latest `0.1.1`, versions `0.1.0` and `0.1.1`
- Tarball SHA-256: `1cb8b7dc178e6668839577a780943710e8d8689eb0f7a6599b027e9226e30b78`
- Product changes:
  - Bumped package metadata to `0.14.0`.
  - Added a `0.14.0` changelog entry.
  - Refreshed README source note, screenshots, and VHS terminal demo for strict gates.
  - Updated launch checklist, npm publishing docs, final handoff, backlog, and product-panel records.
- Worked well:
  - The packed artifact proves strict pass and warning-failure paths from the npm tarball.
- Improve:
  - After the GitHub release, record CI, Publish workflow, npm registry state, and release asset digest.

## 2026-06-09: 0.14.0 GitHub Release and npm Auth Result

- Task contract: `.agentloop/tasks/2026-06-09-document-0-14-0-release-status.md`
- Product cycle: `.agentloop/research/interview-cycle-053.md`
- Verification report: `.agentloop/reports/2026-06-09-22-48-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-09-22-48-pr-summary.md`
- Release: `v0.14.0`
- Commit: `a739f834e42d6d2b8f1e96af6bddf49f62ae39c5`
- GitHub release: https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.14.0
- Attached asset: `agentloopkit-0.14.0.tgz`
- Tarball SHA-256: `1cb8b7dc178e6668839577a780943710e8d8689eb0f7a6599b027e9226e30b78`
- CI run: `27234655492`
- Publish workflow run: `27234726013`
- npm registry check:
  - latest: `0.1.1`
  - versions: `0.1.0`, `0.1.1`
- Verification completed:
  - GitHub CI for `a739f83`: pass
  - GitHub release creation: pass
  - GitHub release asset upload: pass, digest matches local SHA-256
  - GitHub Publish workflow package checks: pass
  - GitHub Publish workflow final `npm publish`: failed with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`
  - npm registry check: pass, latest remains `0.1.1`
  - Release-status docs verification: pass, Markdown links checked 324 files and projscan reported A 100/100
- Product changes:
  - GitHub now has a public `v0.14.0` release with npm-pending notes.
  - Release notes explain that npm may jump from `0.1.1` to `0.14.0` because intermediate versions were GitHub-only while npm publish was blocked.
  - Launch checklist, npm publishing docs, final handoff, backlog, and release notes record the actual npm blocker.
- Worked well:
  - The release tarball is available from GitHub while npm auth remains blocked.
- Improve:
  - Complete local browser/OTP auth for `0.14.0`, or configure npm trusted publishing for `abhiyoheswaran1/AgentLoopKit` and workflow `publish.yml`.

## 2026-06-09: GitHub Actions CI Recipes

- Task contract: `.agentloop/tasks/2026-06-09-add-github-actions-ci-recipes.md`
- Product cycle: `.agentloop/research/interview-cycle-054.md`
- Verification report: `.agentloop/reports/2026-06-09-22-55-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-09-22-55-pr-summary.md`
- Trigger:
  - `verify`, `handoff`, and `check-gates --strict` exist, but docs did not show safe pull request CI usage.
  - Product panel chose docs and examples instead of a workflow installer.
- Verification completed:
  - Tarball install recipe smoke: pass, local packed `agentloopkit-0.14.0.tgz` installed and `npx --no-install agentloop version` reported `0.14.0`
  - `git diff --check`: pass
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 check:links`: pass, 330 Markdown files checked
  - `npx projscan doctor --format markdown`: A, 100/100
  - `npx pnpm@10.12.1 test`: pass, 21 files and 71 tests
  - `npx pnpm@10.12.1 build`: pass
  - `agentloop verify --task .agentloop/tasks/2026-06-09-add-github-actions-ci-recipes.md`: pass
- Product changes:
  - Added `docs/github-actions.md`.
  - Added `examples/github-actions/README.md`.
  - Linked CI recipes from README, getting-started docs, and check-gates docs.
  - Updated generated harness guidance with strict gate and CI artifact notes.
- Worked well:
  - The docs keep npm status honest by pinning the GitHub release tarball while npm latest is behind.
- Improve:
  - Consider an optional workflow generator only after the docs recipes prove useful.

## 2026-06-09: Stack-Specific Starter Recipes

- Task contract: `.agentloop/tasks/2026-06-09-add-stack-specific-starter-recipes.md`
- Product cycle: `.agentloop/research/interview-cycle-055.md`
- Verification report: `.agentloop/reports/2026-06-09-23-00-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-09-23-01-pr-summary.md`
- Trigger:
  - Examples existed, but they did not give enough copy-pasteable verification guidance.
  - Product panel chose docs recipes instead of a framework runner.
- Verification completed:
  - `git diff --check`: pass
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 check:links`: pass, 335 Markdown files checked
  - `npx projscan doctor --format markdown`: A, 100/100
  - `npx pnpm@10.12.1 test`: pass, 21 files and 71 tests
  - `npx pnpm@10.12.1 build`: pass
  - `agentloop verify --task .agentloop/tasks/2026-06-09-add-stack-specific-starter-recipes.md`: pass
- Product changes:
  - Added `docs/stack-recipes.md`.
  - Updated Next.js, Node API, Python service, docs-only, and empty-repo examples.
  - Linked stack recipes from README and getting-started docs.
  - Added monorepo recipe guidance without adding package graph inference.
- Worked well:
  - Recipes make task contracts more concrete without changing CLI behavior.
- Improve:
  - Add more framework recipes later for Remix, SvelteKit, Django, and FastAPI.

## 2026-06-09: CI Context In Verification Reports

- Task contract: `.agentloop/tasks/2026-06-09-add-ci-context-to-verification-reports.md`
- Product cycle: `.agentloop/research/interview-cycle-056.md`
- Verification report: `.agentloop/reports/2026-06-09-23-16-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-09-23-16-pr-summary.md`
- Trigger:
  - CI-generated verification reports did not show which workflow run created them.
  - Product panel chose allowlisted report provenance instead of a dashboard, workflow installer, or environment dump.
- Verification completed:
  - Red tests first: `npx pnpm@10.12.1 test tests/verification.test.ts` failed because reports lacked `CI Context`.
  - Focused green test: `npx pnpm@10.12.1 test tests/verification.test.ts`: pass, 1 file and 6 tests.
  - `git diff --check`: pass
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 test`: pass, 21 files and 74 tests
  - `npx pnpm@10.12.1 check:links`: pass, 337 Markdown files checked
  - `npx pnpm@10.12.1 build`: pass
  - `npx projscan doctor --format markdown`: first flagged a secret-looking test fixture key, then passed after the fixture was renamed
  - GitHub CI run `27236246488`: failed because the local-report omission test inherited real GitHub Actions environment variables.
  - Simulated GitHub Actions focused test after isolation fix: pass, 1 file and 6 tests.
  - Full verification after isolation fix: lint, typecheck, test, check:links, build, and projscan passed.
  - `agentloop verify --task .agentloop/tasks/2026-06-09-add-ci-context-to-verification-reports.md`: pass
  - `agentloop handoff --task .agentloop/tasks/2026-06-09-add-ci-context-to-verification-reports.md`: pass
- Product changes:
  - Verification reports now include allowlisted GitHub Actions provenance when run in GitHub Actions.
  - Generic `CI=true` runs now record `Generic CI`.
  - Local reports omit CI metadata.
  - Docs explain that AgentLoopKit does not read `.env` files or print arbitrary environment variables.
- Worked well:
  - Projscan caught a misleading test fixture name before commit.
- Confusing:
  - The first active-task output showed `proposed` because status changed immediately after pinning. Future docs could recommend changing status before pinning when both commands run together.
  - CI env can leak into tests unless local-mode tests pass `env: {}` explicitly.
- Improve:
  - Prepare the next release candidate after npm publishing is repaired or after the next feature batch.

## 2026-06-09: 0.15.0 Release Candidate

- Task contract: `.agentloop/tasks/2026-06-09-prepare-0-15-0-ci-context-release.md`
- Product cycle: `.agentloop/research/interview-cycle-057.md`
- Trigger:
  - CI context is on `main`, but package metadata and public tarball pins still pointed at `0.14.0`.
  - Product panel chose a `0.15.0` GitHub release candidate while keeping npm status explicit.
- Verification completed:
  - Source CLI version: `npx tsx src/cli/index.ts version`: pass, reported `0.15.0`
  - Built CLI version: `node dist/cli/index.js version`: pass, reported `0.15.0`
  - VHS README terminal render: pass for `agentloopkit-cli.gif` using the `0.15.0` tarball name
  - Playwright README screenshot render: pass for `agentloopkit-showcase.png` and `agentloopkit-verification.png`
  - `git diff --check`: pass
  - `npx pnpm@10.12.1 lint`: pass
  - `npx pnpm@10.12.1 typecheck`: pass
  - `npx pnpm@10.12.1 test`: pass, 21 files and 74 tests
  - `npx pnpm@10.12.1 check:links`: pass, 341 Markdown files checked
  - `npx pnpm@10.12.1 build`: pass
  - `npx projscan doctor --format markdown`: A, 100/100
  - `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.15.0.tgz`
  - `npm publish --access public --dry-run`: pass
  - Packed CLI smoke: pass, `agentloop version` reported `0.15.0`, `init` created 50 files, and `verify --json --no-*` wrote a not-run report
  - Packed CI-context smoke: pass, `verify --json --no-*` included GitHub Actions workflow, event, ref, commit, run URL, and run attempt
  - Tarball SHA-256 before release: `e92f28382d16cccbebd027bbbcb5324f60de088e49bb611482b1e205f673f965`
  - npm registry proof before release: latest `0.1.1`, versions `0.1.0` and `0.1.1`
- Product changes:
  - Bumped package metadata to `0.15.0`.
  - Added a `0.15.0` changelog entry.
  - Updated README and CI recipes to pin the future `v0.15.0` GitHub tarball while npm is behind.
  - Refreshed README visual sources and generated assets with the current 74-test count.
  - Updated npm publishing docs, launch checklist, backlog, and final handoff status.
- Worked well:
  - Packed-tarball smoke tested both the normal init/verify path and the new CI-context path.
- Improve:
  - After the GitHub release is created, record the Publish workflow result and npm registry proof without claiming npm availability.

## 2026-06-09: 0.15.0 GitHub Release and npm Auth Result

- Task contract: `.agentloop/tasks/2026-06-09-document-0-15-0-release-status.md`
- Product cycle: `.agentloop/research/interview-cycle-058.md`
- Release: `v0.15.0`
- GitHub release: https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.15.0
- Attached asset: `agentloopkit-0.15.0.tgz`
- Tarball SHA-256: `e92f28382d16cccbebd027bbbcb5324f60de088e49bb611482b1e205f673f965`
- Publish workflow: `27237034367`
- npm registry proof after release:
  - latest: `0.1.1`
  - versions: `0.1.0`, `0.1.1`
- Verification completed:
  - GitHub CI run `27236965749`: passed for commit `6e6b0cf`
  - Publish workflow run `27237034367`: install, lint, typecheck, tests, build, npm upgrade, npm version check, and `prepublishOnly` passed
  - Final publish step failed with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`
- Product changes:
  - GitHub now has a public `v0.15.0` release with npm-pending notes.
  - Release notes include the tarball SHA, local checks, CI run, and npm-pending status.
  - Docs record that npm may jump from `0.1.1` to `0.15.0` after authorization is repaired.
- Worked well:
  - The release artifact gives CI users a current tarball while npm remains behind.
- Improve:
  - Configure npm trusted publishing for `abhiyoheswaran1/AgentLoopKit` and workflow `publish.yml`, or complete local browser/OTP auth for `0.15.0`.

## 2026-06-09: Doctor Risk File Details

- Task contract: `.agentloop/tasks/2026-06-09-show-doctor-risk-file-details.md`
- Product cycle: `.agentloop/research/interview-cycle-059.md`
- Trigger:
  - `doctor` reported only a total risk-file count, which made first-run output less useful for agents and reviewers.
  - Product panel chose a small safety/trust improvement over broader policy-pack or dashboard work.
- Verification completed:
  - Red test: `npx pnpm@10.12.1 test tests/doctor.test.ts` failed because category-level `Risk files:` checks were missing.
  - Focused green test: `npx pnpm@10.12.1 test tests/doctor.test.ts tests/safety.test.ts` passed, 2 files and 6 tests.
  - False-positive red test: `npx pnpm@10.12.1 test tests/safety.test.ts` failed because Markdown docs such as `docs/migration-guide.md` were treated as risk files.
  - Focused scanner test after refinement: `npx pnpm@10.12.1 test tests/doctor.test.ts tests/safety.test.ts` passed, 2 files and 7 tests.
  - `git diff --check`: pass.
  - Prettier check on touched files: pass.
  - `npx pnpm@10.12.1 lint`: pass.
  - `npx pnpm@10.12.1 typecheck`: pass.
  - `npx pnpm@10.12.1 test`: pass, 21 files and 76 tests.
  - `npx pnpm@10.12.1 check:links`: pass, 349 Markdown files checked.
  - `npx pnpm@10.12.1 build`: pass.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `agentloop verify --task .agentloop/tasks/2026-06-09-show-doctor-risk-file-details.md --command "npx projscan doctor --format markdown"`: pass, wrote `.agentloop/reports/2026-06-09-23-44-verification-report.md`.
  - `agentloop handoff --task .agentloop/tasks/2026-06-09-show-doctor-risk-file-details.md --report .agentloop/reports/2026-06-09-23-44-verification-report.md`: pass, wrote `.agentloop/handoffs/2026-06-09-23-45-pr-summary.md`.
- Product changes:
  - `doctor` keeps the aggregate `Potential risk files` check.
  - `doctor` now adds category-level risk checks with capped path examples.
  - Semantic risk categories skip Markdown documentation to avoid noisy template and policy false positives.
  - Env files are reported as paths only. AgentLoopKit does not read `.env` contents or scan secrets.
- Worked well:
  - The live `doctor --json` smoke caught a noisy scanner edge case before commit.
- Improve:
  - Consider adding a short `doctor` doc page if risk category heuristics need more examples.

## 2026-06-09: Real Config Schema URL

- Task contract: `.agentloop/tasks/2026-06-09-use-real-config-schema-url.md`
- Product cycle: `.agentloop/research/interview-cycle-060.md`
- Trigger:
  - Generated configs and the packaged schema pointed at `https://agentloopkit.dev/schema/agentloop.config.schema.json`.
  - The repo does not prove that the custom domain hosts the schema, while GitHub already hosts the schema file.
- Verification completed:
  - Red focused test: `npx pnpm@10.12.1 test tests/config.test.ts tests/schema.test.ts tests/init.test.ts` failed because defaults, generated config, and schema `$id` still used `agentloopkit.dev`.
  - Focused green test: `npx pnpm@10.12.1 test tests/config.test.ts tests/schema.test.ts tests/init.test.ts` passed, 3 files and 6 tests.
  - `git diff --check`: pass.
  - Prettier check on touched files: pass.
  - `npx pnpm@10.12.1 lint`: pass.
  - `npx pnpm@10.12.1 typecheck`: pass.
  - `npx pnpm@10.12.1 test`: pass, 21 files and 76 tests.
  - `npx pnpm@10.12.1 check:links`: pass, 353 Markdown files checked.
  - `npx pnpm@10.12.1 build`: pass.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `agentloop verify --task .agentloop/tasks/2026-06-09-use-real-config-schema-url.md --command "npx projscan doctor --format markdown"`: pass, wrote `.agentloop/reports/2026-06-09-23-52-verification-report.md`.
  - `agentloop handoff --task .agentloop/tasks/2026-06-09-use-real-config-schema-url.md --report .agentloop/reports/2026-06-09-23-52-verification-report.md`: pass, wrote `.agentloop/handoffs/2026-06-09-23-52-pr-summary.md`.
- Product changes:
  - Default config, generated config template, repo config, and schema `$id` now use the GitHub raw schema URL.
  - Docs explain that the CLI validates locally and does not fetch the schema URL at runtime.
  - The package still ships `schema/agentloop.config.schema.json`.
- Worked well:
  - A small test set covered all places where the schema URL can drift.
- Improve:
  - Revisit a branded schema domain only after the domain actually serves the schema file.

## 2026-06-10: 0.15.1 Patch Release Candidate

- Task contract: `.agentloop/tasks/2026-06-09-prepare-0-15-1-trust-polish-release.md`
- Product cycle: `.agentloop/research/interview-cycle-061.md`
- Trigger:
  - Doctor risk-file detail reporting and real config schema URL fixes are on `main`.
  - Package metadata and GitHub tarball pins still pointed at `0.15.0`.
  - Product panel chose `0.15.1` instead of `0.16.0` because this is patch-level trust polish.
- Verification run:
  - `npx tsx src/cli/index.ts version`: pass, reported `0.15.1`.
  - `git diff --check`: pass.
  - `npx pnpm@10.12.1 lint`: pass.
  - `npx pnpm@10.12.1 typecheck`: pass.
  - `npx pnpm@10.12.1 test`: pass, 21 files and 76 tests.
  - `npx pnpm@10.12.1 check:links`: pass, 359 Markdown files checked.
  - `npx pnpm@10.12.1 build`: pass.
  - `node dist/cli/index.js version`: pass, reported `0.15.1`.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `npx pnpm@10.12.1 pack`: pass, produced `agentloopkit-0.15.1.tgz`.
  - `npm publish --access public --dry-run`: pass, including `prepublishOnly`.
  - Packed tarball smoke test: pass, `agentloop version` reported `0.15.1`, `init --json` created files, `doctor --json` accepted the generated setup, and generated config used the GitHub raw schema URL.
  - npm registry proof: latest remains `0.1.1`; versions remain `0.1.0` and `0.1.1`.
  - AgentLoop verification report: `.agentloop/reports/2026-06-10-00-06-verification-report.md`, overall status `pass`.
  - AgentLoop handoff: `.agentloop/handoffs/2026-06-10-00-08-pr-summary.md`.
- Product changes:
  - Bump package metadata to `0.15.1`.
  - Add a `0.15.1` changelog entry.
  - Update current GitHub tarball pins from `v0.15.0` to `v0.15.1`.
  - Keep npm availability status explicit until registry proof changes.
- Worked well:
  - `init --json` made the packed-package smoke test fully noninteractive.
  - projscan stayed green after release-doc and visual-asset changes.
- Improve:
  - Record GitHub release and publish-workflow status after the release step.

## 2026-06-10: 0.15.1 GitHub Release and npm Auth Result

- Task contract: `.agentloop/tasks/2026-06-10-document-0-15-1-release-status.md`
- Product cycle: `.agentloop/research/interview-cycle-062.md`
- Release: `v0.15.1`
- GitHub release: https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.15.1
- Attached asset: `agentloopkit-0.15.1.tgz`
- Tarball SHA-256: `56b3ac5b212d24c2214e73a59c5e5fd08fe9f62a0e17956ec5c07cbad7672490`
- CI:
  - Push CI run `27239114873`: pass.
  - Publish workflow run `27239176000`: package checks passed, then npm rejected `npm publish --access public` with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`.
- npm registry proof:
  - `npm view agentloopkit version`: `0.1.1`
  - `npm view agentloopkit versions --json`: `0.1.0`, `0.1.1`
- AgentLoop verification report: `.agentloop/reports/2026-06-10-00-14-verification-report.md`, overall status `pass`.
- AgentLoop handoff: `.agentloop/handoffs/2026-06-10-00-14-pr-summary.md`.
- Worked well:
  - GitHub release notes include verification evidence and npm-pending language.
  - The workflow failure remained scoped to npm authorization; package checks passed before publish.
- Improve:
  - Configure npm trusted publishing for `abhiyoheswaran1/AgentLoopKit` and workflow `publish.yml`, or complete local browser/OTP auth for `0.15.1`.
  - Do not cut another version for this same npm authorization blocker.

## 2026-06-10: Public Roadmap Refresh

- Task contract: `.agentloop/tasks/2026-06-10-refresh-public-roadmap-after-0-15-1.md`
- Product cycle: `.agentloop/research/interview-cycle-063.md`
- Trigger:
  - `ROADMAP.md` still listed task status transitions and shell completion as future work after both had shipped.
  - README publishing status did not state that npm is still behind the latest GitHub release.
- Product changes:
  - Rewrote `ROADMAP.md` around shipped work, current npm blocker, near-term local-first improvements, later options, and non-goals.
  - Updated README publishing status to say npm currently serves `0.1.1` while GitHub release `v0.15.1` is current.
- Verification run:
  - `npx pnpm@10.12.1 check:links`: pass, 367 Markdown files checked.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `git diff --check`: pass.
  - AgentLoop verification report: `.agentloop/reports/2026-06-10-00-19-verification-report.md`, overall status `pass`.
  - AgentLoop handoff: `.agentloop/handoffs/2026-06-10-00-19-pr-summary.md`.
- Improve:
  - Keep public docs aligned after future releases without cutting extra versions for docs-only release-status changes.

## 2026-06-10: PR Summary Change Areas

- Task contract: `.agentloop/tasks/2026-06-10-classify-pr-summary-change-areas.md`
- Product cycle: `.agentloop/research/interview-cycle-064.md`
- Trigger:
  - PR summaries listed changed files but did not group them by reviewer concern.
  - Reviewers still had to infer source, tests, docs, CI, config, AgentLoop artifacts, and risk-sensitive paths.
- Product changes:
  - Added deterministic `Change Areas` grouping and `Review Focus` hints to PR summaries.
  - Updated PR-summary docs and README copy for path-only classification.
  - Added an `Unreleased` changelog entry.
  - Refreshed README VHS and Playwright assets after the handoff output and test count changed.
- Verification run:
  - Red focused test: `npx pnpm@10.12.1 test tests/pr-summary.test.ts` failed because `## Change Areas` was missing.
  - Focused green test: `npx pnpm@10.12.1 test tests/pr-summary.test.ts`: pass, 1 file and 5 tests.
  - `npx pnpm@10.12.1 lint`: pass.
  - `npx pnpm@10.12.1 typecheck`: pass.
  - `npx pnpm@10.12.1 test`: pass, 21 files and 77 tests.
  - `npx pnpm@10.12.1 check:links`: pass, 371 Markdown files checked.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `npx pnpm@10.12.1 build`: pass.
  - AgentLoop verification report: `.agentloop/reports/2026-06-10-00-27-verification-report.md`, overall status `pass`.
  - AgentLoop handoff: `.agentloop/handoffs/2026-06-10-00-28-pr-summary.md`.
- Improve:
  - Keep classification path-only until users need configurable categories.

## 2026-06-10: Local HTML Evidence Report

- Task contract: `.agentloop/tasks/2026-06-10-add-static-html-report-export.md`
- Product cycle: `.agentloop/research/interview-cycle-065.md`
- Trigger:
  - Task contracts, verification reports, and handoffs existed as separate Markdown files.
  - Reviewers and CI users could benefit from one local HTML evidence artifact.
- Product changes:
  - Added `agentloop report`.
  - Added a static HTML renderer with escaped local evidence.
  - Added compact JSON output for agents and CI.
  - Ignored bundled handoff templates when selecting the latest generated handoff.
  - Updated README, docs, generated harness templates, GitHub Actions recipes, and README visual assets.
- Dogfooding:
  - Created and pinned this task with AgentLoopKit.
  - Ran `agentloop report --json` against this repo and caught that JSON output was too noisy.
  - Added a failing test for compact JSON output, then fixed the CLI.
- Verification run:
  - Focused red test for compact JSON output: failed because `html` was included.
  - Focused green test: `npx pnpm@10.12.1 test tests/html-report.test.ts`: pass, 1 file and 3 tests.
  - `git diff --check`: pass.
  - `npx pnpm@10.12.1 lint`: pass.
  - `npx pnpm@10.12.1 typecheck`: pass.
  - `npx pnpm@10.12.1 test`: pass, 22 files and 80 tests.
  - `npx pnpm@10.12.1 check:links`: pass, 374 Markdown files checked.
  - `npx pnpm@10.12.1 build`: pass.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - AgentLoop verification report: `.agentloop/reports/2026-06-10-00-46-verification-report.md`, overall status `pass`.
  - AgentLoop handoff: `.agentloop/handoffs/2026-06-10-00-47-pr-summary.md`.
  - AgentLoop HTML report: `.agentloop/reports/2026-06-10-00-47-agentloop-report.html`.
- Improve:
  - Consider generated evidence badges after npm publishing is stable.

## 2026-06-10: Local Evidence Badges

- Task contract: `.agentloop/tasks/2026-06-10-add-local-evidence-badges.md`
- Product cycle: `.agentloop/research/interview-cycle-066.md`
- Trigger:
  - Reports and HTML evidence helped reviewers, but README snippets, PR descriptions, and CI artifact lists still needed a compact local status signal.
  - The product panel rejected hosted badge services and command execution inside badge generation.
- Product changes:
  - Added `agentloop badge`.
  - Added dependency-free SVG badge rendering from existing verification or gate evidence.
  - Added `--source verification`, `--source gates`, `--strict`, `--out`, and `--json`.
  - Updated shell completions, README, badge docs, GitHub Actions examples, generated harness templates, roadmap, changelog, decisions, final handoff, and README visual assets.
- Dogfooding:
  - Created and pinned the task with AgentLoopKit, then marked it `done`.
  - Ran `npx tsx src/cli/index.ts badge --json`: pass, wrote `.agentloop/reports/agentloop-verification.svg`.
  - Ran `npx tsx src/cli/index.ts badge --source gates --strict --json`: pass, wrote `.agentloop/reports/agentloop-gates.svg`.
  - Rendered README PNG screenshots with Playwright.
  - Rendered the README terminal GIF with VHS.
- Verification run:
  - Focused red test: `npx pnpm@10.12.1 test tests/badge.test.ts` failed before `src/core/badge.ts` existed.
  - Focused green test: `npx pnpm@10.12.1 test tests/badge.test.ts`: pass, 1 file and 3 tests.
  - `git diff --check`: pass.
  - `npx pnpm@10.12.1 lint`: pass.
  - `npx pnpm@10.12.1 typecheck`: pass.
  - `npx pnpm@10.12.1 test`: pass, 23 files and 83 tests.
  - `npx pnpm@10.12.1 check:links`: pass, 379 Markdown files checked.
  - `npx pnpm@10.12.1 build`: pass.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `npm pack --dry-run`: pass, produced the `agentloopkit@0.15.1` package preview.
  - AgentLoop verification report: `.agentloop/reports/2026-06-10-00-59-verification-report.md`, overall status `pass`.
  - AgentLoop handoff: `.agentloop/handoffs/2026-06-10-01-00-pr-summary.md`.
  - AgentLoop HTML report: `.agentloop/reports/2026-06-10-01-00-agentloop-report.html`.
- Worked well:
  - A missing verification report cannot produce a pass badge.
  - `agentloop badge --json` gives CI and agents a compact machine-readable result without embedding SVG contents.
- Improve:
  - Decide the next public npm release number now that npm already serves `0.1.1` and GitHub has higher release tags.

## 2026-06-10: 0.16.0 npm Catch-Up Release Candidate

- Task contract: `.agentloop/tasks/2026-06-10-prepare-0-16-0-badge-release.md`
- Product cycle: `.agentloop/research/interview-cycle-067.md`
- Trigger:
  - `main` contains `agentloop badge` after public GitHub release `v0.15.1`.
  - npm previously lagged at `0.1.1`, and publishing `0.15.1` now would make npm source disagree with the `v0.15.1` GitHub tag.
- Product changes:
  - Bumped package metadata to `0.16.0`.
  - Moved unreleased changelog entries into `0.16.0`.
  - Updated README, publishing docs, launch checklist, roadmap, final handoff, and GitHub Actions examples with the one-time npm catch-up explanation.
  - Updated the VHS README source and regenerated the terminal GIF against `agentloopkit-0.16.0.tgz`.
- Verification run:
  - `npx tsx src/cli/index.ts version`: pass, reported `0.16.0`.
  - `git diff --check`: pass.
  - `npx pnpm@10.12.1 lint`: pass.
  - `npx pnpm@10.12.1 typecheck`: pass.
  - `npx pnpm@10.12.1 test`: pass, 23 files and 83 tests.
  - `npx pnpm@10.12.1 check:links`: pass, 383 Markdown files checked.
  - `npx pnpm@10.12.1 build`: pass.
  - `node dist/cli/index.js version`: pass, reported `0.16.0`.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `npm pack --dry-run`: pass, previewed `agentloopkit@0.16.0`.
  - `npm publish --access public --dry-run`: pass, including `prepublishOnly`.
  - `npm publish --access public`: package checks passed, then npm stopped with `EOTP` for browser/OTP authentication.
  - npm registry proof after the publish attempt: latest remains `0.1.1`; versions remain `0.1.0` and `0.1.1`.
  - GitHub release: https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.16.0
  - GitHub release asset: `agentloopkit-0.16.0.tgz`
  - GitHub release tarball SHA-256: `687dac923ee3976e4975641a20844ece4ce41c2123794423c46cd72091f8cb18`
  - GitHub Publish workflow run `27241996432`: package checks passed, then npm rejected `npm publish --access public` with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`.
  - Packed tarball smoke: first assertion used the wrong `doctor --json` shape; corrected smoke test passed with `agentloop version` reporting `0.16.0`, `init --json` creating files, `doctor --json` returning no serious errors, and `badge --json` writing a missing-verification badge.
  - AgentLoop verification report: `.agentloop/reports/2026-06-10-01-10-verification-report.md`, overall status `pass`.
  - AgentLoop handoff: `.agentloop/handoffs/2026-06-10-01-11-pr-summary.md`.
  - AgentLoop HTML report: `.agentloop/reports/2026-06-10-01-11-agentloop-report.html`.
- Worked well:
  - The product-panel release decision prevented reusing stale public tags.
  - `npm publish --dry-run` proved package contents and prepublish checks before the real registry publish.
- Improve:
  - After npm and GitHub release steps, record registry proof, release URL, CI result, and tarball digest.

## 2026-06-10: Template Version Guidance

- Task contract: `.agentloop/tasks/2026-06-10-add-template-version-guidance.md`
- Product cycle: `.agentloop/research/interview-cycle-068.md`
- Trigger:
  - Generated AgentLoop harnesses had no local marker showing which template generation created them.
  - Future template changes need a warning path that does not overwrite edited repo guidance.
- Product changes:
  - Added `.agentloop/manifest.json` generation during `agentloop init`.
  - Added current template version constants.
  - Added `agentloop doctor` warning-only checks for current, missing, stale, invalid, and newer template manifests.
  - Added `docs/template-migrations.md`.
  - Updated README, getting-started docs, configuration docs, generated workspace README, roadmap, changelog, decisions, final handoff, and backlog.
- Dogfooding:
  - Added `.agentloop/manifest.json` to this repo's own harness.
  - Ran `npx tsx src/cli/index.ts doctor --json` and verified `Template manifest` returned `pass` with `template version 1 is current`.
  - Marked the task contract `done` and cleared active task state.
- Verification run:
  - Focused red test: `npx pnpm@10.12.1 test tests/init.test.ts tests/doctor.test.ts` failed before manifest generation and doctor checks existed.
  - Focused green test: `npx pnpm@10.12.1 test tests/init.test.ts tests/doctor.test.ts`: pass, 2 files and 9 tests.
  - `git diff --check`: pass.
  - `npx pnpm@10.12.1 lint`: pass.
  - `npx pnpm@10.12.1 typecheck`: pass.
  - `npx pnpm@10.12.1 test`: pass, 23 files and 85 tests.
  - `npx pnpm@10.12.1 check:links`: pass, 388 Markdown files checked.
  - `npx pnpm@10.12.1 build`: pass.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - AgentLoop verification report: `.agentloop/reports/2026-06-10-01-25-verification-report.md`, overall status `pass`.
  - AgentLoop handoff: `.agentloop/handoffs/2026-06-10-01-25-pr-summary.md`.
  - AgentLoop HTML report: `.agentloop/reports/2026-06-10-01-25-agentloop-report.html`.
- Worked well:
  - The manifest adds provenance without touching `agentloop.config.json`.
  - `doctor` keeps template metadata problems as warnings, so old repos are not broken.
- Improve:
  - Policy pack customization can build on this provenance later, but it should remain explicit and reviewable.

## 2026-06-10: Local Policy Inspection And 0.17.0 Preparation

- Task contract: `.agentloop/tasks/2026-06-10-expose-policy-guidance-through-cli.md`
- Product cycle: `.agentloop/research/interview-cycle-069.md`
- Trigger:
  - Generated policies existed under `.agentloop/policies/`, but agents and humans needed a direct CLI path to inspect them.
  - `main` moved after the public `v0.16.0` release, so the next package line must not reuse `0.16.0`.
- Product changes:
  - Added read-only `agentloop policy list`.
  - Added read-only `agentloop policy show <policy>`.
  - Added JSON output for policy list and show.
  - Restricted policy lookup to known Markdown files under `.agentloop/policies/`.
  - Added `docs/policies.md`.
  - Updated README, getting-started docs, generated harness templates, agent templates, completions, roadmap, changelog, decisions, backlog, launch checklist, publishing docs, and README VHS source.
  - Bumped package metadata to `0.17.0`.
- Dogfooding:
  - Created and pinned the task with AgentLoopKit, then marked it `in-progress`.
  - Focused red test: `npx pnpm@10.12.1 test tests/policy.test.ts` failed before `src/core/policy.ts` existed.
  - Focused green test: `npx pnpm@10.12.1 test tests/policy.test.ts`: pass, 1 file and 4 tests.
  - Completion red test: `npx pnpm@10.12.1 test tests/completion.test.ts` failed because static completions did not include `policy`.
  - Focused policy and completion tests: `npx pnpm@10.12.1 test tests/policy.test.ts tests/completion.test.ts`: pass, 2 files and 10 tests.
- Verification run:
  - Live CLI smoke: `npx tsx src/cli/index.ts version`: pass, reported `0.17.0`.
  - Live CLI smoke: `npx tsx src/cli/index.ts policy list --json`: pass, listed local policy files.
  - Live CLI smoke: `npx tsx src/cli/index.ts policy show security`: pass, printed `# Security Policy`.
  - Live CLI smoke: `npx tsx src/cli/index.ts policy show ../AGENTS.md`: pass, exited `1` with `Policy not found`.
  - `git diff --check`: pass.
  - `npx pnpm@10.12.1 lint`: pass.
  - `npx pnpm@10.12.1 typecheck`: pass.
  - `npx pnpm@10.12.1 test`: pass, 24 files and 89 tests.
  - `npx pnpm@10.12.1 check:links`: pass, 393 Markdown files checked.
  - `npx pnpm@10.12.1 build`: pass.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `npm pack`: pass, produced `agentloopkit-0.17.0.tgz`.
  - `npm publish --access public --dry-run`: pass, including `prepublishOnly`.
  - Packed tarball smoke: first assertion used the wrong `init --json` shape; corrected smoke passed with `agentloop version` reporting `0.17.0`, `init --json` creating `.agentloop/policies/security-policy.md`, `policy list --json` listing `security-policy`, `policy show security` printing the policy, and traversal-style lookup failing.
  - README terminal GIF regenerated with VHS from `docs/assets/readme/agentloopkit-cli.tape`.
  - README screenshots regenerated with Playwright from committed HTML sources.
  - AgentLoop verification report: `.agentloop/reports/2026-06-10-01-40-verification-report.md`, overall status `pass`.
  - AgentLoop handoff: `.agentloop/handoffs/2026-06-10-01-42-pr-summary.md`.
  - AgentLoop HTML report: `.agentloop/reports/2026-06-10-01-42-agentloop-report.html`.
  - AgentLoop badge: `.agentloop/reports/agentloop-verification.svg`.
  - `agentloop check-gates --strict --json`: pass.
  - Marked the task contract `done` and cleared active task state.
  - GitHub CI run `27243118355`: pass.
  - GitHub release: https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.17.0
  - GitHub release asset: `agentloopkit-0.17.0.tgz`
  - GitHub release tarball SHA-256: `8b7bb6ae9307e79cf97e20e405a1cef6a4aefcc48466d865758cc87f3439d49c`
  - GitHub Publish workflow run `27243165066`: package checks passed, then npm rejected `npm publish --access public` with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`.
  - npm registry proof after release: latest remains `0.1.1`; versions remain `0.1.0` and `0.1.1`.
- Worked well:
  - Policy lookup stayed read-only and local.
  - The command exposes generated guidance without claiming compliance or building a policy engine.
- Improve:
  - After verification, decide whether to publish a `v0.17.0` GitHub release and record npm auth status without claiming npm availability.

## 2026-06-10: 0.17.0 GitHub Release And npm Auth Result

- Task contract: `.agentloop/tasks/2026-06-10-record-0-17-0-release-status.md`
- Product cycle: `.agentloop/research/interview-cycle-070.md`
- Release:
  - GitHub release: https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.17.0
  - Attached asset: `agentloopkit-0.17.0.tgz`
  - SHA-256: `8b7bb6ae9307e79cf97e20e405a1cef6a4aefcc48466d865758cc87f3439d49c`
- Publish status:
  - CI run `27243118355`: pass.
  - Publish workflow run `27243165066`: package checks passed, then npm rejected `npm publish --access public` with `E404`.
  - npm registry proof: latest remains `0.1.1`; versions remain `0.1.0` and `0.1.1`.
- Verification run:
  - `git diff --check`: pass.
  - `npx pnpm@10.12.1 check:links`: pass, 397 Markdown files checked.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - AgentLoop verification report: `.agentloop/reports/2026-06-10-01-48-verification-report.md`, overall status `pass`.
  - AgentLoop handoff: `.agentloop/handoffs/2026-06-10-01-48-pr-summary.md`.
- Worked well:
  - Release notes and docs separate GitHub tarball availability from npm availability.
- Improve:
  - Complete npm browser/OTP auth or trusted publishing before claiming `npx agentloopkit@0.17.0` support.

## 2026-06-10: Local Policy Drift Status And 0.18.0 Preparation

- Task contract: `.agentloop/tasks/2026-06-10-add-policy-drift-status.md`
- Product cycle: `.agentloop/research/interview-cycle-071.md`
- Trigger:
  - `agentloop policy list` and `agentloop policy show` made policy files visible, but teams and agents still could not tell whether local policies matched bundled templates.
  - A local exact-tarball publish attempt for `0.17.0` reached npm and stopped at `EOTP`, so npm still requires browser/OTP auth or trusted publishing.
- Product changes:
  - Added read-only `agentloop policy status`.
  - Added `agentloop policy status --json`.
  - Reports policy files as `current`, `modified`, `missing`, or `extra`.
  - Compares only local `.agentloop/policies/*.md` files and bundled templates.
  - Updated shell completions, README, policy docs, getting-started docs, generated harness templates, agent templates, roadmap, changelog, decisions, launch checklist, publishing docs, final handoff, and README visual sources.
  - Bumped package metadata to `0.18.0`.
- Dogfooding:
  - Created and pinned the task with AgentLoopKit, then marked it `in-progress`.
  - The first dogfood task creation attempt used unsupported `--avoid-file`; the supported flag is `--forbidden-file`.
  - Ran `agentloop policy status --json` in this repo and confirmed all eight local policies report `current`.
- Verification run:
  - Focused red test: `npx pnpm@10.12.1 test tests/policy.test.ts tests/completion.test.ts` failed before `getPolicyStatus`, `policy status`, and completion entries existed.
  - Focused green test: `npx pnpm@10.12.1 test tests/policy.test.ts tests/completion.test.ts`: pass, 2 files and 12 tests.
  - `git diff --check`: pass.
  - `npx pnpm@10.12.1 lint`: pass.
  - `npx pnpm@10.12.1 typecheck`: pass.
  - `npx pnpm@10.12.1 test`: pass, 24 files and 91 tests.
  - `npx pnpm@10.12.1 check:links`: pass, 403 Markdown files checked.
  - `npx pnpm@10.12.1 build`: pass.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `npm pack`: pass, produced `agentloopkit-0.18.0.tgz`.
  - `npm publish --access public --dry-run`: pass, including `prepublishOnly`.
  - Packed tarball smoke: first assertion treated the expected traversal failure as unexpected; corrected smoke passed with clean policy status, deliberate drift status, and traversal protection.
  - Tarball SHA-256: `7c3b6b7f12c34e57b9bfd70bb4491abd566b37b86bf0c642d9d517a7dcdb4d26`.
  - README terminal GIF regenerated with VHS from `docs/assets/readme/agentloopkit-cli.tape`.
  - README screenshots regenerated with Playwright from committed HTML sources.
  - AgentLoop verification report: `.agentloop/reports/2026-06-10-02-06-verification-report.md`, overall status `pass`.
  - AgentLoop handoff: `.agentloop/handoffs/2026-06-10-02-07-pr-summary.md`.
  - AgentLoop HTML report: `.agentloop/reports/2026-06-10-02-07-agentloop-report.html`.
  - AgentLoop badge: `.agentloop/reports/agentloop-verification.svg`.
  - `agentloop check-gates --strict --json`: pass.
- Worked well:
  - Policy drift status adds practical review value without enforcement or migration behavior.
  - The JSON shape is deterministic enough for agents and CI scripts.
- Improve:
  - After CI passes, publish GitHub release `v0.18.0`, attach `agentloopkit-0.18.0.tgz`, and record the npm publish result without claiming npm availability until the registry proves it.

## 2026-06-10: 0.18.0 GitHub Release And npm Auth Result

- Task contract: `.agentloop/tasks/2026-06-10-add-policy-drift-status.md`
- Product cycle: `.agentloop/research/interview-cycle-071.md`
- Release:
  - GitHub release: https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.18.0
  - Attached asset: `agentloopkit-0.18.0.tgz`
  - SHA-256: `7c3b6b7f12c34e57b9bfd70bb4491abd566b37b86bf0c642d9d517a7dcdb4d26`
- Publish status:
  - CI run `27244057325`: pass.
  - Publish workflow run `27244098928`: package checks passed, then npm rejected `npm publish --access public` with `E404`.
  - Local `npm publish ./agentloopkit-0.18.0.tgz --access public`: reached npm and failed with authorization `E404`.
  - Local `npm whoami`: failed with `E401`, so local npm auth needs a fresh login before another manual publish attempt.
  - npm registry proof: latest remains `0.1.1`; versions remain `0.1.0` and `0.1.1`.
- Worked well:
  - Release notes include the policy-status command, verification evidence, and tarball digest.
  - GitHub tarball distribution is available while npm authorization remains blocked.
- Improve:
  - Re-run `npm login`, confirm `npm whoami`, then publish the exact `0.18.0` tarball or configure npm trusted publishing for `publish.yml`.

## 2026-06-10: 0.18.0 Release Status Cleanup

- Task contract: `.agentloop/tasks/2026-06-10-record-0-18-0-release-status.md`
- Product cycle: `.agentloop/research/interview-cycle-072.md`
- Trigger:
  - Maintainer asked whether jumping from npm `0.1.1` to a higher version means AgentLoopKit will keep skipping versions.
  - npm registry proof still shows latest `0.1.1`, while GitHub release `v0.18.0` is public.
- Product changes:
  - README now states that npm should catch up to `0.18.0` once authentication is fixed, then return to normal sequential semver.
  - Publishing docs now explain why backfilling old npm versions from current `main` would make package metadata misleading.
  - Changelog, roadmap, launch checklist, GitHub Actions docs, GitHub Actions example, final handoff, backlog, and dogfood log now reflect the `v0.18.0` release and npm authorization result.
- Verification run:
  - `git diff --check`: pass.
  - `npx pnpm@10.12.1 test`: pass, 24 files and 91 tests.
  - `npx pnpm@10.12.1 check:links`: pass, 405 Markdown files checked.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - AgentLoop verification report: `.agentloop/reports/2026-06-10-02-19-verification-report.md`, overall status `pass`.
  - AgentLoop handoff: `.agentloop/handoffs/2026-06-10-02-20-pr-summary.md`.
  - `agentloop check-gates --strict --json`: pass.
- Worked well:
  - The README now answers the version-jump concern without asking readers to inspect the full release history.
  - The exact npm publish blocker remains visible instead of being turned into a vague pending status.
- Improve:
  - After a fresh `npm login` or trusted-publishing setup, publish `agentloopkit@0.18.0` and verify with `npm view agentloopkit version`.

## 2026-06-10: Policy Customization Guidance

- Task contract: `.agentloop/tasks/2026-06-10-document-policy-customization-workflow.md`
- Product cycle: `.agentloop/research/interview-cycle-073.md`
- Trigger:
  - `agentloop policy status` can report drift, but maintainers need to know what to do with intentional local policy edits.
  - Future agents need to know that local `.agentloop/policies/*.md` files are repo guidance.
- Product changes:
  - Added a status-action table and customization workflow to `docs/policies.md`.
  - Updated README and template migration docs to treat `modified` as a local decision to review.
  - Updated generated AGENTS, AGENTLOOP, `.agentloop/README.md`, harness command, and review-checklist guidance.
  - Kept the CLI read-only. No policy editor, auto-migration, remote policy pack, compliance score, or enforcement engine was added.
- Verification run:
  - `git diff --check`: pass.
  - `npx pnpm@10.12.1 test`: pass, 24 files and 91 tests.
  - `npx pnpm@10.12.1 check:links`: pass, 409 Markdown files checked.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `agentloop policy status --json`: pass, all eight repo policies reported `current`.
  - AgentLoop verification report: `.agentloop/reports/2026-06-10-02-25-verification-report.md`, overall status `pass`.
  - AgentLoop handoff: `.agentloop/handoffs/2026-06-10-02-26-pr-summary.md`.
  - `agentloop check-gates --strict --json`: pass.
- Worked well:
  - The docs now give maintainers a concrete action for each policy status.
  - The generated harness tells agents to follow local policy files instead of treating customized text as broken.
- Improve:
  - Add deeper policy examples for common repo types after npm publishing is stable.

## 2026-06-10: 0.18.1 Policy Guidance Patch Release Candidate

- Task contract: `.agentloop/tasks/2026-06-10-prepare-0-18-1-policy-guidance-patch-release.md`
- Product cycle: `.agentloop/research/interview-cycle-074.md`
- Trigger:
  - Policy customization guidance changed bundled templates after GitHub release `v0.18.0`.
  - Keeping package metadata at `0.18.0` would make current source diverge from the existing `v0.18.0` tarball.
- Product changes:
  - Bumped package metadata to `0.18.1`.
  - Updated changelog, README, npm publishing docs, launch checklist, GitHub Actions docs, examples, roadmap, final handoff, backlog, and VHS demo source.
  - Regenerated the README terminal GIF with VHS from the `0.18.1` tape.
- Verification run:
  - `agentloop version`: reported `0.18.1`.
  - `git diff --check`: pass.
  - `npx pnpm@10.12.1 lint`: pass.
  - `npx pnpm@10.12.1 typecheck`: pass.
  - `npx pnpm@10.12.1 test`: pass, 24 files and 91 tests.
  - `npx pnpm@10.12.1 check:links`: pass, 413 Markdown files checked.
  - `npx pnpm@10.12.1 build`: pass.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `npm pack`: pass, produced `agentloopkit-0.18.1.tgz`.
  - `npm publish --access public --dry-run`: pass, including `prepublishOnly`.
  - Packed tarball smoke: pass after rerunning with a safely quoted `rg` pattern.
  - Tarball SHA-256: `01f38156e44610021752dadc90fe5d61f63ac210c3778274bce99b11833e972b`.
  - AgentLoop verification report: `.agentloop/reports/2026-06-10-02-34-verification-report.md`, overall status `pass`.
  - AgentLoop handoff: `.agentloop/handoffs/2026-06-10-02-40-pr-summary.md`.
  - GitHub CI run `27245102739`: pass.
  - GitHub release: https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.18.1
  - GitHub release asset: `agentloopkit-0.18.1.tgz`.
  - GitHub Publish workflow run `27245167172`: package checks passed, then npm rejected `npm publish --access public` with `E404`.
  - npm registry proof: latest remains `0.1.1`; versions remain `0.1.0` and `0.1.1`.
- Worked well:
  - The patch release preserves traceability between package metadata and tarball contents.
  - The release remains local-first and docs/template-only.
- Improve:
  - Configure npm trusted publishing or re-authenticate locally, then publish `agentloopkit@0.18.1` and verify with `npm view agentloopkit version`.

## 2026-06-10: Repo-Type Policy Examples

- Task contract: `.agentloop/tasks/2026-06-10-add-repo-type-policy-examples.md`
- Product cycle: `.agentloop/research/interview-cycle-075.md`
- Trigger:
  - Policy customization docs explained the workflow but did not show concrete snippets for common repo types.
  - This was kept outside package contents to avoid another package version while npm publishing is blocked.
- Product changes:
  - Added `docs/policy-examples.md`.
  - Added examples for web apps, APIs/services, Python services, docs-only repos, monorepos, and open-source review workflows.
  - Linked the examples from `docs/policies.md`.
  - Updated roadmap, final handoff, backlog, and product-panel records.
- Verification run:
  - `git diff --check`: pass.
  - `npx pnpm@10.12.1 test`: pass, 24 files and 91 tests.
  - `npx pnpm@10.12.1 check:links`: pass, 418 Markdown files checked.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - AgentLoop verification report: `.agentloop/reports/2026-06-10-02-44-verification-report.md`, overall status `pass`.
  - AgentLoop handoff: `.agentloop/handoffs/2026-06-10-02-45-pr-summary.md`.
  - `agentloop check-gates --strict --json`: pass.
- Worked well:
  - The examples make policy customization concrete without adding a policy-pack system.
  - No package files or runtime code changed.
- Improve:
  - Consider CI summary import next, but keep npm authentication as the main external blocker.

## 2026-06-10: Contributor Playbook Examples

- Task contract: `.agentloop/tasks/2026-06-10-add-contributor-playbook-examples.md`
- Product cycle: `.agentloop/research/interview-cycle-076.md`
- Trigger:
  - The repo had issue templates and a PR template, but maintainers still lacked copyable examples for scoped first issues.
  - `ROADMAP.md` still listed contributor issue examples as near-term launch polish.
- Product changes:
  - Added `docs/contributor-playbook.md`.
  - Added copyable examples for docs link fixes, small Vitest coverage gaps, template wording polish, and example repo updates.
  - Linked the playbook from README and `CONTRIBUTING.md`.
  - Updated changelog, roadmap, backlog, final handoff, and product-panel records.
  - Kept the change docs-only. No runtime code, package metadata, issue bot, label-sync dependency, or npm release metadata changed.
- Verification run:
  - `git diff --check`: pass.
  - `npx pnpm@10.12.1 test`: pass, 24 files and 91 tests.
  - `npx pnpm@10.12.1 check:links`: pass, 425 Markdown files checked.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - AgentLoop verification report: `.agentloop/reports/2026-06-10-02-52-verification-report.md`, overall status `pass`.
  - AgentLoop handoff: `.agentloop/handoffs/2026-06-10-02-53-pr-summary.md`.
  - `agentloop check-gates --strict --json`: pass.
- Worked well:
  - The contributor path now has examples instead of only templates.
  - Clearing `.agentloop/state.json` after dogfooding avoided committing a local active-task pointer.
- Improve:
  - CI summary import is the next useful local-first feature after npm publishing catches up.

## 2026-06-10: 0.19.0 Local CI Summary Command

- Task contract: `.agentloop/tasks/2026-06-10-add-local-ci-summary-command.md`
- Product cycle: `.agentloop/research/interview-cycle-077.md`
- Trigger:
  - GitHub Actions recipes can upload several AgentLoop artifacts, but reviewers need one compact CI log summary.
  - The backlog identified CI summary import as the next local-first improvement after contributor and policy docs.
- Product changes:
  - Added `agentloop ci-summary`.
  - Added `agentloop ci-summary --json` and `agentloop ci-summary --write`.
  - Added `src/core/ci-summary.ts` and `src/cli/commands/ci-summary.ts`.
  - Added tests for GitHub Actions metadata, generic CI, written summaries, completions, and verification-report lookup isolation.
  - Updated `status`, `check-gates`, `summarize`, `report`, and `badge` report lookup so `*-ci-summary.md` does not replace `*-verification-report.md`.
  - Updated README, GitHub Actions docs, examples, generated harness templates, changelog, roadmap, publishing docs, launch checklist, final handoff, backlog, and decision log.
  - Bumped package metadata to `0.19.0`.
  - Regenerated the README terminal GIF with VHS from the `0.19.0` tape.
- Verification run:
  - Red test: `npx pnpm@10.12.1 test tests/ci-summary.test.ts tests/completion.test.ts` failed before `ci-summary` and lookup isolation existed.
  - Focused green tests: `npx pnpm@10.12.1 test tests/ci-summary.test.ts tests/completion.test.ts tests/status.test.ts tests/check-gates.test.ts tests/html-report.test.ts tests/badge.test.ts tests/pr-summary.test.ts`: pass, 7 files and 28 tests.
  - `agentloop version`: reported `0.19.0`.
  - `git diff --check`: pass.
  - `npx pnpm@10.12.1 lint`: pass.
  - `npx pnpm@10.12.1 typecheck`: pass.
  - `npx pnpm@10.12.1 test`: pass, 25 files and 94 tests.
  - `npx pnpm@10.12.1 check:links`: pass, 431 Markdown files checked.
  - `npx pnpm@10.12.1 build`: pass.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `npm pack`: pass, produced `agentloopkit-0.19.0.tgz`.
  - `npm publish --access public --dry-run`: pass, including `prepublishOnly`.
  - Packed tarball smoke: pass; `agentloop version` reported `0.19.0`, `ci-summary --json --write` reported GitHub Actions context, and `status` plus `check-gates` still selected the verification report.
  - Tarball SHA-256: `8d78d22b8b69786bd85b43234815765e2d373d44d05789a20ce3a2d19897e900`.
  - README terminal GIF regenerated with VHS from `docs/assets/readme/agentloopkit-cli.tape`.
  - AgentLoop verification report: `.agentloop/reports/2026-06-10-03-15-verification-report.md`, overall status `pass`.
  - AgentLoop CI summary: `.agentloop/reports/2026-06-10-03-18-ci-summary.md`.
  - AgentLoop handoff: `.agentloop/handoffs/2026-06-10-03-18-pr-summary.md`.
  - GitHub CI run `27246728746`: pass.
  - GitHub release: https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.19.0
  - GitHub release asset: `agentloopkit-0.19.0.tgz`.
  - GitHub Publish workflow run `27246784493`: package checks passed, then npm rejected `npm publish --access public` with `E404`.
- Worked well:
  - Writing a CI summary did not disturb verification-report lookup.
  - The command gives CI logs a compact summary without provider API calls or token access.
- Improve:
  - Configure npm trusted publishing or complete local account authentication, then publish `agentloopkit@0.19.0`.

## 2026-06-10: 0.20.0 Release Notes Command

- Task contract: `.agentloop/tasks/2026-06-10-add-release-notes-command.md`
- Product cycle: `.agentloop/research/interview-cycle-078.md`
- Trigger:
  - GitHub releases have detailed notes, but maintainers still assemble each release summary by hand from changelog, git, verification, and AgentLoop evidence.
  - npm still serves `0.1.1`, so the next release needs an honest catch-up note.
- Product changes:
  - Added `agentloop release-notes`.
  - Added `agentloop release-notes --json` and `agentloop release-notes --write`.
  - Added missing-ref handling so an unavailable `--from` ref is reported instead of pretending the range was read.
  - Added working-tree evidence so release notes warn when local changes are not in the selected git range.
  - Updated shell completions, README, release docs, generated harness templates, launch checklist, roadmap, decisions, and README visual sources.
  - Bumped package metadata to `0.20.0`.
  - Regenerated README Playwright screenshots and the VHS terminal GIF.
- Verification run:
  - Red test: `npx pnpm@10.12.1 test tests/release-notes.test.ts` failed before missing explicit `--from` refs were reported.
  - Focused green tests: `npx pnpm@10.12.1 test tests/release-notes.test.ts tests/completion.test.ts`: pass, 2 files and 9 tests.
  - `npx pnpm@10.12.1 typecheck`: pass.
  - `npx pnpm@10.12.1 lint`: pass.
  - `npx pnpm@10.12.1 check:links`: pass, 434 Markdown files checked.
  - `npx pnpm@10.12.1 test`: pass, 26 files and 97 tests.
  - `npx pnpm@10.12.1 build`: pass.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `npm pack`: pass, produced `agentloopkit-0.20.0.tgz`.
  - `npm publish --access public --dry-run`: pass, including `prepublishOnly`.
  - Packed tarball smoke: pass; `agentloop version` reported `0.20.0`, `release-notes --json --write` wrote a release-note artifact, and `check-gates --strict --json` passed in the smoke repo.
  - Tarball SHA-256: `df8407c7da4440a86a544973bdd052cadb0c0d2b10b1bb67f81548b857fdc201`.
  - README screenshots regenerated with Playwright.
  - README terminal GIF regenerated with VHS from `docs/assets/readme/agentloopkit-cli.tape`.
  - AgentLoop verification report: `.agentloop/reports/2026-06-10-03-45-verification-report.md`, overall status `pass`.
  - GitHub release: https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.20.0
  - GitHub release asset: `agentloopkit-0.20.0.tgz`.
  - GitHub Publish workflow run `27248000123`: package checks passed, then npm rejected `npm publish --access public` with `E404`.
  - npm registry proof: latest remains `0.1.1`; versions remain `0.1.0` and `0.1.1`.
- Worked well:
  - Dogfooding caught the missing-tag behavior before release.
  - The command gives maintainers a release handoff without tag mutation, publishing, network calls, token reads, or LLM output.
- Improve:
  - Configure npm trusted publishing or complete local account authentication, then publish the current GitHub release line.

## 2026-06-10: Unreleased Next Action Command

- Task contract: `.agentloop/tasks/2026-06-10-add-next-action-command.md`
- Product cycle: `.agentloop/research/interview-cycle-079.md`
- Trigger:
  - `agentloop status` already computed a next action, but agents and scripts needed a smaller command that returns only the next local step.
  - Dogfooding showed that a new active task could inherit an older passing verification report, which made the next action too optimistic.
- Product changes:
  - Added `agentloop next`.
  - Added `agentloop next --json`.
  - Reused the existing status engine instead of adding a second decision source.
  - Updated status logic so a verification report older than an in-progress active task no longer counts as current task evidence.
  - Kept review/done task status updates from invalidating the latest verification report.
  - Updated shell completions, README, getting-started docs, status docs, generated harness templates, changelog, decisions, backlog, and README VHS demo source.
  - Regenerated README Playwright screenshots and the VHS terminal GIF.
  - Left package metadata at `0.20.0` and recorded the command under `Unreleased`; `v0.20.0` still needs npm catch-up before another release is cut.
- Verification run:
  - Red test: `npx pnpm@10.12.1 test tests/next.test.ts tests/completion.test.ts` failed before `next` existed.
  - Stale-report red test: `npx pnpm@10.12.1 test tests/next.test.ts` failed before status ignored older reports for newer active tasks.
  - Review/done lifecycle red test: `npx pnpm@10.12.1 test tests/next.test.ts` failed before post-verification task status updates kept report evidence.
  - Focused green tests: `npx pnpm@10.12.1 test tests/next.test.ts tests/status.test.ts tests/completion.test.ts`: pass, 3 files and 16 tests.
  - `npx pnpm@10.12.1 lint`: pass.
  - `npx pnpm@10.12.1 typecheck`: pass.
  - `npx pnpm@10.12.1 test`: pass, 27 files and 102 tests.
  - `npx pnpm@10.12.1 check:links`: pass, 442 Markdown files checked.
  - `npx pnpm@10.12.1 build`: pass.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `git diff --check`: pass.
  - `npm pack`: pass, produced `agentloopkit-0.20.0.tgz` for local smoke testing.
  - Packed tarball smoke: pass; installed `/tmp/agentloopkit-0.20.0.tgz` into a temp repo and `npx agentloop next --json` returned `agentloop create-task`.
  - `npm publish --access public --dry-run`: pass, including `prepublishOnly`.
  - README screenshots regenerated with Playwright.
  - README terminal GIF regenerated with VHS from `docs/assets/readme/agentloopkit-cli.tape`.
  - AgentLoop verification report: `.agentloop/reports/2026-06-10-04-17-verification-report.md`, overall status `pass`.
  - AgentLoop handoff: `.agentloop/handoffs/2026-06-10-04-18-pr-summary.md`.
  - `agentloop check-gates --strict --json`: pass.
- Worked well:
  - `agentloop next` made the stale-report issue visible during dogfooding.
  - Reusing `getAgentLoopStatus` kept the command small and avoided planner scope.
- Improve:
  - After npm catches up to `0.20.0`, cut the next real release with `agentloop next` and normal semver.

## 2026-06-10: Publish Metadata Guard

- Task contract: `.agentloop/tasks/2026-06-10-add-publish-metadata-guard.md`
- Product cycle: `.agentloop/research/interview-cycle-080.md`
- Trigger:
  - Current `main` has unreleased work after `v0.20.0` while package metadata still says `0.20.0`.
  - A direct `npm publish` from `main` would publish contents that do not match the existing `v0.20.0` release notes.
- Product changes:
  - Added `scripts/prepublish-check.mjs`.
  - Wired the check into `prepublishOnly` before typecheck, tests, and build.
  - Added Vitest coverage for failing with real unreleased entries and passing when `Unreleased` is empty.
  - Updated npm publishing docs, README launch notes, changelog, decisions, backlog, and product-panel records.
  - Left `.github/workflows/publish.yml` unchanged.
- Verification run:
  - Red test: `npx pnpm@10.12.1 test tests/prepublish-check.test.ts` failed before the guard script existed.
  - Focused green test: `npx pnpm@10.12.1 test tests/prepublish-check.test.ts`: pass, 1 file and 2 tests.
  - Dogfood guard on current repo: `node scripts/prepublish-check.mjs` failed as intended because `CHANGELOG.md` has unreleased entries.
  - `npx pnpm@10.12.1 lint`: initially failed on Node globals in the `.mjs` script, then passed after declaring the script globals.
  - `npx pnpm@10.12.1 typecheck`: pass.
  - `npx pnpm@10.12.1 test`: pass, 28 files and 104 tests.
  - `npx pnpm@10.12.1 check:links`: pass, 444 Markdown files checked.
  - `npx pnpm@10.12.1 build`: pass.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `npm publish --access public --dry-run`: failed as intended at `prepublishOnly` because `CHANGELOG.md` has unreleased entries.
  - AgentLoop verification report: `.agentloop/reports/2026-06-10-04-25-verification-report.md`, overall status `pass`.
  - AgentLoop handoff: `.agentloop/handoffs/2026-06-10-04-25-pr-summary.md`.
  - `agentloop check-gates --strict --json`: pass.
- Worked well:
  - The guard catches the exact release-safety problem before npm credentials or network publish actions are involved.
- Improve:
  - During the next release prep, move `Unreleased` entries into `0.21.0`, reset `Unreleased`, and verify that the guard passes.

## 2026-06-10: 0.21.0 Release Prep

- Task contract: `.agentloop/tasks/2026-06-10-prepare-v0-21-0-release.md`
- Product cycle: `.agentloop/research/interview-cycle-081.md`
- Trigger:
  - `main` contains `agentloop next` and the prepublish metadata guard after `v0.20.0`.
  - npm still serves `0.1.1`, so the next GitHub/source release needs clear catch-up wording without pretending npm is current.
  - During release notes dogfooding, `release-notes --version <version>` collided with the CLI's global `--version` flag.
- Product changes in progress:
  - Bumped package metadata toward `0.21.0`.
  - Moved release notes from `Unreleased` into a `0.21.0` changelog section and reset `Unreleased`.
  - Added `agentloop release-notes --release-version <version>` for explicit release-note metadata without a global flag collision.
  - Updated README, release docs, npm publishing docs, launch checklist, roadmap, final handoff, and README visual assets for the `0.21.0` release line.
- Verification run so far:
  - Red test: `npx pnpm@10.12.1 test tests/release-notes.test.ts` failed with `unknown option '--release-version'`.
  - Focused green test: `npx pnpm@10.12.1 test tests/release-notes.test.ts`: pass, 1 file and 4 tests.
  - `node scripts/prepublish-check.mjs`: pass.
  - `agentloop release-notes --release-version 0.21.0 --json`: pass, reported version `0.21.0`.
  - `npx pnpm@10.12.1 lint`: pass.
  - `npx pnpm@10.12.1 typecheck`: pass.
  - `npx pnpm@10.12.1 test`: pass, 28 files and 105 tests.
  - `npx pnpm@10.12.1 check:links`: pass, 448 Markdown files checked.
  - `npx pnpm@10.12.1 build`: pass.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `git diff --check`: pass.
  - `npm pack --pack-destination /tmp --silent`: pass, produced `/tmp/agentloopkit-0.21.0.tgz`.
  - `npm publish --access public --dry-run`: pass, including `prepublishOnly`.
  - Packed tarball smoke: pass; after `agentloop init`, `agentloop version` reported `0.21.0`, `release-notes --release-version 0.21.0 --json` reported `0.21.0`, and `next --json` returned `agentloop create-task`.
  - Tarball SHA-256: `3f7c1ee4042f6dd08d2fd2cc2ecdcc039f853f95afb56be666c5497d7a3fe4d5`.
  - AgentLoop verification report: `.agentloop/reports/2026-06-10-04-41-verification-report.md`, overall status `pass`.
  - AgentLoop handoff: `.agentloop/handoffs/2026-06-10-04-42-pr-summary.md`.
- Worked well:
  - Dogfooding the release-note command caught a real CLI ergonomics bug before the GitHub release was cut.
- Improve:
  - Complete full release verification, regenerate final release notes, push the release commit, create the GitHub release, and record npm/GitHub status honestly.

## 2026-06-10: 0.21.0 Release Status

- Task contract: `.agentloop/tasks/2026-06-10-record-v0-21-0-release-status.md`
- Trigger:
  - GitHub release `v0.21.0` is public.
  - The release-triggered GitHub Publish workflow failed at npm authorization after package checks passed.
- Product/status changes:
  - Updated README, npm publishing docs, release notes docs, launch checklist, roadmap, and final handoff to record `v0.21.0` as a public GitHub release.
  - Recorded the GitHub release asset SHA-256: `3f7c1ee4042f6dd08d2fd2cc2ecdcc039f853f95afb56be666c5497d7a3fe4d5`.
  - Recorded GitHub Publish workflow run `27249612803` failing at npm authorization with `E404`.
  - Recorded npm registry proof that latest remains `0.1.1` with versions `0.1.0` and `0.1.1`.
- Verification run:
  - `npm view agentloopkit version versions --json`: pass, latest `0.1.1`.
  - `npx pnpm@10.12.1 check:links`: pass, 453 Markdown files checked.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - AgentLoop verification report: `.agentloop/reports/2026-06-10-04-48-verification-report.md`, overall status `pass`.
  - AgentLoop handoff: `.agentloop/handoffs/2026-06-10-04-49-pr-summary.md`.
- Worked well:
  - GitHub release notes were generated from a clean tree with `agentloop release-notes --release-version 0.21.0`.
- Improve:
  - Repair npm package permissions or trusted publishing, then publish the current release line once and return to normal semver.

## 2026-06-10: Verification Failure Summary

- Task contract: `.agentloop/tasks/2026-06-10-improve-verification-failure-summary.md`
- Product cycle: `.agentloop/research/interview-cycle-082.md`
- Trigger:
  - Failed verification reports preserve output but still require reviewers to scan command sections for the useful failure lines.
  - Product-panel signal favored better failure readability over another release attempt while npm authentication remains external.
- Product changes in progress:
  - Add a `Failure Summary` section only when verification commands fail.
  - Include failed command, exit code, and final useful output lines from the same captured command output.
  - Keep the existing full command output excerpt.
  - Avoid AI diagnosis, stack-trace parsing, network calls, or extra file reads.
- Verification run so far:
  - Red test: `npx pnpm@10.12.1 test tests/verification.test.ts` failed because `## Failure Summary` was missing.
  - Focused green test: `npx pnpm@10.12.1 test tests/verification.test.ts`: pass, 1 file and 7 tests.
  - `npx pnpm@10.12.1 lint`: pass.
  - `npx pnpm@10.12.1 typecheck`: pass.
  - `npx pnpm@10.12.1 test`: pass, 28 files and 106 tests.
  - `npx pnpm@10.12.1 check:links`: pass initially with 455 Markdown files checked, then pass with 457 files after adding task and handoff artifacts.
  - `npx pnpm@10.12.1 build`: pass.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `git diff --check`: pass.
  - `node scripts/prepublish-check.mjs`: failed as intended because `CHANGELOG.md` now has unreleased verification-report entries.
  - AgentLoop verification report: `.agentloop/reports/2026-06-10-04-55-verification-report.md`, overall status `pass`.
  - AgentLoop handoff: `.agentloop/handoffs/2026-06-10-04-57-pr-summary.md`.
- Worked well:
  - The change improves handoff readability while keeping report evidence deterministic.
- Improve:
  - Consider an example failed verification report fixture for documentation screenshots in a later visual refresh.

## 2026-06-10: Verification Task Context

- Task contract: `.agentloop/tasks/2026-06-10-include-task-context-in-verification.md`
- Product cycle: `.agentloop/research/interview-cycle-083.md`
- Trigger:
  - `agentloop verify --task <path>` accepted a task path, but the generated verification report did not include task context.
  - Product-panel signal favored traceability between task contracts and verification reports.
- Product changes:
  - Include task path, title, task type, and status in verification reports generated with `--task`.
  - Report missing task files as unavailable task context without changing command pass/fail status.
  - Report `.env`-style task paths as unavailable without reading them as task contracts.
  - Keep verification command execution unchanged.
- Verification run:
  - Red test: `npx pnpm@10.12.1 test tests/verification.test.ts` failed because `## Task Context` was missing.
  - Focused green test: `npx pnpm@10.12.1 test tests/verification.test.ts`: pass, 1 file and 10 tests.
  - Red safety test: `npx pnpm@10.12.1 test tests/verification.test.ts` failed because `.env` was read as task context.
  - Focused green safety test: `npx pnpm@10.12.1 test tests/verification.test.ts`: pass, 1 file and 11 tests.
  - `npx pnpm@10.12.1 lint`: pass.
  - `npx pnpm@10.12.1 typecheck`: pass.
  - `npx pnpm@10.12.1 test`: pass, 28 files and 110 tests.
  - `npx pnpm@10.12.1 check:links`: pass, 459 Markdown files checked.
  - `npx pnpm@10.12.1 build`: pass.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `git diff --check`: pass.
  - `node scripts/prepublish-check.mjs`: expected fail because `CHANGELOG.md` still has Unreleased entries.
  - `npx tsx src/cli/index.ts verify --task .agentloop/tasks/2026-06-10-include-task-context-in-verification.md`: pass.
- Verification report:
  - `.agentloop/reports/2026-06-10-05-09-verification-report.md`
- Handoff summary:
  - `.agentloop/handoffs/2026-06-10-05-10-pr-summary.md`
- Worked well:
  - The accepted CLI flag now has visible report value.
  - The dogfood report includes `Task Context` near the top and shows the task status as `done`.
- Improve:
  - Consider linking verification reports back to the active handoff in a later small iteration.

## 2026-06-10: README Visual Refresh For Task Context

- Task contract: `.agentloop/tasks/2026-06-10-refresh-readme-visuals-task-context.md`
- Product cycle: `.agentloop/research/interview-cycle-084.md`
- Trigger:
  - README visual assets existed, but the verification screenshot still showed older command evidence and no task context.
  - The VHS tape installed a hardcoded `agentloopkit-0.21.0.tgz` tarball, which would make future asset refreshes brittle.
- Product changes:
  - Refresh the verification screenshot around `agentloop verify --task`.
  - Update stale test counts in the showcase screenshot.
  - Make the VHS tape install the newest local packed tarball.
  - Regenerate Playwright screenshots and the terminal GIF.
- Verification run:
  - `npx playwright screenshot --viewport-size=1440,960 "file://$(pwd | sed 's/ /%20/g')/docs/assets/readme/showcase.html" docs/assets/readme/agentloopkit-showcase.png`: pass.
  - `npx playwright screenshot --viewport-size=1440,960 "file://$(pwd | sed 's/ /%20/g')/docs/assets/readme/verification.html" docs/assets/readme/agentloopkit-verification.png`: pass.
  - `vhs docs/assets/readme/agentloopkit-cli.tape`: pass.
  - `npx pnpm@10.12.1 lint`: pass.
  - `npx pnpm@10.12.1 typecheck`: pass.
  - `npx pnpm@10.12.1 test`: pass, 28 files and 110 tests.
  - `npx pnpm@10.12.1 check:links`: pass, 463 Markdown files checked.
  - `npx pnpm@10.12.1 build`: pass.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `git diff --check`: pass.
  - `node scripts/prepublish-check.mjs`: expected fail because `CHANGELOG.md` still has Unreleased entries.
  - `npx tsx src/cli/index.ts verify --task .agentloop/tasks/2026-06-10-refresh-readme-visuals-task-context.md`: pass.
- Verification report:
  - `.agentloop/reports/2026-06-10-05-22-verification-report.md`
- Handoff summary:
  - `.agentloop/handoffs/2026-06-10-05-23-pr-summary.md`
- Worked well:
  - The verification screenshot now shows task context, command status, and handoff evidence in one frame.
  - The VHS tape no longer needs a package-version edit for each visual refresh.
- Improve:
  - Consider adding a tiny script that regenerates all README assets with one command.

## 2026-06-10: 0.22.0 Release Prep

- Task contract: `.agentloop/tasks/2026-06-10-prepare-v0-22-0-release.md`
- Product cycle: `.agentloop/research/interview-cycle-085.md`
- Trigger:
  - `main` contains release-worthy verification and README evidence work after `v0.21.0`.
  - `package.json` still reported `0.21.0` and `CHANGELOG.md` had Unreleased entries.
  - npm still serves `0.1.1`, and local `npm whoami` returned `E401`.
- Product changes in progress:
  - Bump package metadata to `0.22.0`.
  - Move Unreleased changelog entries into `0.22.0`.
  - Update README, npm publishing docs, GitHub Actions docs, release-note docs, launch checklist, roadmap, and final handoff for the current release line.
  - Prepare a GitHub release tarball if package verification passes.
- Verification run so far:
  - `npm view agentloopkit version versions --json`: latest `0.1.1`, versions `0.1.0` and `0.1.1`.
  - `npm whoami`: expected fail with `E401`, so npm publish is blocked from this shell.
  - `npx pnpm@10.12.1 lint`: pass.
  - `npx pnpm@10.12.1 typecheck`: pass.
  - `npx pnpm@10.12.1 test`: pass, 28 files and 110 tests.
  - `npx pnpm@10.12.1 check:links`: pass, 467 Markdown files checked.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `node scripts/prepublish-check.mjs`: pass.
  - `git diff --check`: pass.
  - `npx pnpm@10.12.1 build`: pass.
  - `node dist/cli/index.js version`: `0.22.0`.
  - `npm publish --access public --dry-run`: pass, including `prepublishOnly`.
  - `npm pack --pack-destination /tmp --silent`: pass, produced `/tmp/agentloopkit-0.22.0.tgz`.
  - Tarball SHA-256 before GitHub release: `5ad3a2b35e430d6d9fa10cad4c6023230fc7f3593a8232370c9c2a8945b6489f`.
  - Initial packed smoke with `check-gates --strict`: expected fail because no handoff summary existed.
  - Corrected packed smoke: pass after `agentloop handoff`; `agentloop version` reported `0.22.0`, `verify --task` passed, `release-notes --release-version 0.22.0 --json` reported `0.22.0`, and `check-gates --strict` passed.
  - `git fetch --tags`: pass, fetched `v0.21.0` for explicit release-note range selection.
  - `npx tsx src/cli/index.ts verify --task .agentloop/tasks/2026-06-10-prepare-v0-22-0-release.md`: pass.
- Verification report:
  - `.agentloop/reports/2026-06-10-05-34-verification-report.md`
- Handoff summary:
  - `.agentloop/handoffs/2026-06-10-05-35-pr-summary.md`

## 2026-06-10: 0.22.0 Release Status Record

- Task contract: `.agentloop/tasks/2026-06-10-record-v0-22-0-release-status.md`
- Product cycle: `.agentloop/research/interview-cycle-086.md`
- Trigger:
  - GitHub release `v0.22.0` is public with attached tarball `agentloopkit-0.22.0.tgz`.
  - GitHub Publish workflow run `27251450540` passed package checks and failed at npm authorization with `E404`.
  - npm still reports latest `0.1.1` with versions `0.1.0` and `0.1.1`.
  - The user asked whether the project should keep skipping versions or release a higher version out of the blue.
- Product changes:
  - Clarify README install status.
  - Record `v0.22.0` release URL, tarball digest, workflow result, and npm registry proof in publishing docs.
  - Mark GitHub `v0.22.0` as published in the launch checklist while leaving npm `0.22.0` unpublished.
  - Update roadmap and final handoff with the release-status evidence.
  - Record the product-panel decision not to publish stale intermediate versions from current `main`.
- Verification run:
  - `npx pnpm@10.12.1 check:links`: pass, 471 Markdown files checked.
  - `git diff --check`: pass.
  - `node scripts/prepublish-check.mjs`: pass.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `npx tsx src/cli/index.ts verify --task .agentloop/tasks/2026-06-10-record-v0-22-0-release-status.md`: pass, wrote `.agentloop/reports/2026-06-10-05-46-verification-report.md`.
  - AgentLoop verification commands: Vitest 28 files and 110 tests, lint, typecheck, and build all passed.
  - `npx tsx src/cli/index.ts handoff --json`: pass, wrote `.agentloop/handoffs/2026-06-10-05-49-pr-summary.md`.
  - `npx tsx src/cli/index.ts task clear --json`: pass, removed the local active-task pointer before commit.
  - Final `npx pnpm@10.12.1 check:links`: pass, 473 Markdown files checked.
  - Final `git diff --check`: pass.
- Worked well:
  - The task contract made the release-status scope narrow: documentation and evidence only.
- Improve:
  - Once npm authorization is repaired, update this log with the successful `npm view agentloopkit version` proof and stop recommending GitHub tarball fallback for current users.

## 2026-06-10: Current GitHub Tarball Usage Docs

- Task contract: `.agentloop/tasks/2026-06-10-document-current-github-tarball-usage.md`
- Product cycle: `.agentloop/research/interview-cycle-087.md`
- Trigger:
  - npm still serves `agentloopkit@0.1.1`.
  - GitHub release `v0.22.0` is public and contains the current CLI.
  - README stated the npm lag but did not give users a tested current-release command.
- Product changes:
  - Add a temporary `npx --yes --package <v0.22.0 tarball> agentloop version` command to README.
  - Add a temporary `npx --yes --package <v0.22.0 tarball> agentloop init` command to README.
  - Add fallback-removal guidance to `docs/npm-publishing.md`.
- Verification run:
  - `npx --yes --package https://github.com/abhiyoheswaran1/AgentLoopKit/releases/download/v0.22.0/agentloopkit-0.22.0.tgz agentloop version`: pass, reported `0.22.0`.
  - `npx --yes --package https://github.com/abhiyoheswaran1/AgentLoopKit/releases/download/v0.22.0/agentloopkit-0.22.0.tgz agentloop init --dry-run --json`: pass, returned generated file paths and `dryRun: true`.
  - `npx pnpm@10.12.1 check:links`: pass, 475 Markdown files checked.
  - `git diff --check`: pass.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `npx tsx src/cli/index.ts verify --task .agentloop/tasks/2026-06-10-document-current-github-tarball-usage.md`: pass, wrote `.agentloop/reports/2026-06-10-05-52-verification-report.md`.
  - AgentLoop verification commands: Vitest 28 files and 110 tests, lint, typecheck, and build all passed.
  - `npx tsx src/cli/index.ts task clear --json`: pass, removed the local active-task pointer before handoff.
  - `npx tsx src/cli/index.ts handoff --json`: pass, wrote `.agentloop/handoffs/2026-06-10-05-53-pr-summary.md`.
  - Final `npx pnpm@10.12.1 check:links`: pass, 477 Markdown files checked.
  - Final `git diff --check`: pass.
- Worked well:
  - The release tarball path gives current behavior without cloning the repo.
- Improve:
  - Remove this fallback from README after npm reports `0.22.0` or newer.

## 2026-06-10: Final Handoff Refresh For 0.22.0

- Task contract: `.agentloop/tasks/2026-06-10-refresh-final-handoff-v0-22-0.md`
- Product cycle: `.agentloop/research/interview-cycle-088.md`
- Trigger:
  - `FINAL_HANDOFF.md` still had current-state sections that pointed at `0.19.0` or assumed `npx agentloopkit init` installed the current CLI.
  - GitHub release `v0.22.0` is public, and npm still serves `0.1.1`.
- Product changes:
  - Update the final handoff backlog and limitations for the current GitHub release.
  - Add launch checklist entries for `v0.20.0`, `v0.21.0`, and `v0.22.0`.
  - Separate current GitHub tarball usage from future npm usage in install instructions.
  - Update launch copy and Next 15 improvements so they name `0.22.0` as the npm catch-up target.
- Verification run:
  - `npx pnpm@10.12.1 check:links`: pass, 479 Markdown files checked.
  - `git diff --check`: pass.
  - `node scripts/prepublish-check.mjs`: pass.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `npx tsx src/cli/index.ts verify --task .agentloop/tasks/2026-06-10-refresh-final-handoff-v0-22-0.md`: pass, wrote `.agentloop/reports/2026-06-10-05-59-verification-report.md`.
  - AgentLoop verification commands: Vitest 28 files and 110 tests, lint, typecheck, and build all passed.
  - `npx tsx src/cli/index.ts task clear --json`: pass, removed the local active-task pointer before handoff.
  - `npx tsx src/cli/index.ts handoff --json`: pass, wrote `.agentloop/handoffs/2026-06-10-05-59-pr-summary.md`.
  - Final `npx pnpm@10.12.1 check:links`: pass, 481 Markdown files checked.
  - Final `git diff --check`: pass.
  - Final stale current-state search in `FINAL_HANDOFF.md`: pass, no `0.19.0` current-target guidance remains.
- Worked well:
  - The stale guidance was confined to current-state handoff sections; historical release evidence could stay intact.
- Improve:
  - Consider a future release-status compaction pass so final handoff files do not grow too large.

## 2026-06-10: Concise Release Status Page

- Task contract: `.agentloop/tasks/2026-06-10-add-release-status-page.md`
- Product cycle: `.agentloop/research/interview-cycle-089.md`
- Trigger:
  - Release status was repeated across several files.
  - Stale current-state guidance had already appeared in the final handoff.
- Product changes:
  - Added `docs/release-status.md` with current GitHub release, npm registry state, tarball fallback, publish blocker, and update rules.
  - Linked the release-status page from README and `docs/npm-publishing.md`.
  - Updated `FINAL_HANDOFF.md` so release-status compaction is listed as shipped rather than future work.
- Verification run:
  - `npx pnpm@10.12.1 check:links`: pass, 484 Markdown files checked.
  - `git diff --check`: pass.
  - `node scripts/prepublish-check.mjs`: pass.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `npx tsx src/cli/index.ts verify --task .agentloop/tasks/2026-06-10-add-release-status-page.md`: pass, wrote `.agentloop/reports/2026-06-10-06-03-verification-report.md`.
  - AgentLoop verification commands: Vitest 28 files and 110 tests, lint, typecheck, and build all passed.
  - `npx tsx src/cli/index.ts task clear --json`: pass, removed the local active-task pointer before handoff.
  - `npx tsx src/cli/index.ts handoff --json`: pass, wrote `.agentloop/handoffs/2026-06-10-06-03-pr-summary.md`.
  - Final `npx pnpm@10.12.1 check:links`: pass, 486 Markdown files checked.
  - Final `git diff --check`: pass.
  - Final stale release-status search: pass.
- Worked well:
  - One compact page should reduce stale launch-state drift.
- Improve:
  - After npm publishes `0.22.0`, update this page first and then remove temporary tarball guidance elsewhere.

## 2026-06-10: PowerShell Shell Completion

- Task contract: `.agentloop/tasks/2026-06-10-add-powershell-completion.md`
- Product cycle: `.agentloop/research/interview-cycle-090.md`
- Trigger:
  - Shell completions supported bash, zsh, and fish.
  - PowerShell users received an unsupported-shell error.
  - The product panel accepted a static stdout-only renderer and rejected profile-file mutation.
- Product changes:
  - Added `agentloop completion powershell`.
  - Added `agentloop completion pwsh` as an alias.
  - Added PowerShell `Register-ArgumentCompleter` output for top-level commands, task commands, policy commands, task statuses, agent names, and shell names.
  - Updated README, getting-started docs, backlog, and final handoff current-state sections.
- Verification run:
  - Red test first: `npx pnpm@10.12.1 test tests/completion.test.ts` failed before PowerShell support because `powershell` was rejected by `parseShell`.
  - Focused green test: `npx pnpm@10.12.1 test tests/completion.test.ts`: pass, 1 file and 9 tests.
  - Direct CLI smoke: `npx tsx src/cli/index.ts completion powershell`: pass, printed a PowerShell completion script.
  - Direct alias smoke: `npx tsx src/cli/index.ts completion pwsh`: pass, matched `powershell` output.
  - Unsupported shell smoke: `npx tsx src/cli/index.ts completion nushell`: failed with exit 1 and listed supported shells.
  - Full `npx pnpm@10.12.1 test`: pass, 28 files and 113 tests.
  - `npx pnpm@10.12.1 lint`: pass.
  - `npx pnpm@10.12.1 typecheck`: pass.
  - `npx pnpm@10.12.1 build`: pass.
  - `npx pnpm@10.12.1 check:links`: pass, 488 Markdown files checked.
  - `git diff --check`: pass.
  - `node scripts/prepublish-check.mjs`: pass.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `npx tsx src/cli/index.ts verify --task .agentloop/tasks/2026-06-10-add-powershell-completion.md`: pass, wrote `.agentloop/reports/2026-06-10-06-13-verification-report.md`.
  - `npx tsx src/cli/index.ts handoff --task .agentloop/tasks/2026-06-10-add-powershell-completion.md --json`: pass, wrote `.agentloop/handoffs/2026-06-10-06-14-pr-summary.md`.
- Worked well:
  - Adding the shell through the existing static renderer kept the change small and dependency-free.
- Improve:
  - If users ask for NuShell support, add docs first and a renderer only after the command shape is clear.

## 2026-06-10: 0.23.0 PowerShell Completion Release Prep

- Task contract: `.agentloop/tasks/2026-06-10-prepare-0-23-0-powershell-completion-release.md`
- Product cycle: `.agentloop/research/interview-cycle-091.md`
- Trigger:
  - PowerShell completions landed on `main` after the `v0.22.0` GitHub release.
  - README documented PowerShell completion, but the current GitHub tarball still pointed at `0.22.0`.
- Product changes:
  - Bumped package metadata to `0.23.0`.
  - Added a `0.23.0` changelog section for PowerShell completions.
  - Updated README, GitHub Actions docs, release-status docs, npm publishing docs, launch checklist, backlog, and final handoff for the `0.23.0` release target.
  - Kept npm status explicit: npm still serves `0.1.1`, and local `npm whoami` returns `E401`.
- Verification run:
  - `npx pnpm@10.12.1 test`: pass, 28 files and 113 tests.
  - `npx pnpm@10.12.1 lint`: pass.
  - `npx pnpm@10.12.1 typecheck`: pass.
  - `npx pnpm@10.12.1 build`: pass.
  - `npx pnpm@10.12.1 check:links`: pass, 492 Markdown files checked.
  - `git diff --check`: pass.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `npm pack --pack-destination /tmp --silent`: pass, produced `/tmp/agentloopkit-0.23.0.tgz`.
  - Local tarball SHA-256: `b96f356db5b5b2f94a0f284590f3d272afe20fe87b6668e10c599164be72b27f`.
  - Packed tarball smoke: `npx --yes --package /tmp/agentloopkit-0.23.0.tgz agentloop version` reported `0.23.0`.
  - Packed tarball PowerShell smoke: `npx --yes --package /tmp/agentloopkit-0.23.0.tgz agentloop completion powershell` printed `Register-ArgumentCompleter`.
  - Packed tarball init smoke: `agentloop init --dry-run --json` worked in a temp git repo.
  - `npm publish --access public --dry-run`: pass, including prepublish metadata check, typecheck, Vitest, and build.
  - `npm view agentloopkit version versions --json`: latest `0.1.1`, versions `0.1.0` and `0.1.1`.
  - `npm whoami`: expected fail with `E401`; real npm publish remains blocked from this shell.
  - `npx tsx src/cli/index.ts verify --task .agentloop/tasks/2026-06-10-prepare-0-23-0-powershell-completion-release.md`: pass, wrote `.agentloop/reports/2026-06-10-06-21-verification-report.md`.
  - `npx tsx src/cli/index.ts handoff --task .agentloop/tasks/2026-06-10-prepare-0-23-0-powershell-completion-release.md --json`: pass, wrote `.agentloop/handoffs/2026-06-10-06-22-pr-summary.md`.
- Worked well:
  - The release candidate stayed metadata- and docs-focused after the feature commit.
- Improve:
  - After the GitHub release is created, update launch checklist and release status with the final workflow result.

## 2026-06-10: 0.23.0 Release Status Record

- Task contract: `.agentloop/tasks/2026-06-10-record-v0-23-0-release-status.md`
- Product cycle: `.agentloop/research/interview-cycle-092.md`
- Trigger:
  - GitHub release `v0.23.0` was created after the release-prep commit passed CI.
  - The release-triggered Publish workflow completed and failed at npm publish authorization.
- Product changes:
  - Recorded `v0.23.0` release URL, asset digest, publish workflow result, and npm registry proof in release-status docs.
  - Updated npm publishing docs, launch checklist, final handoff, and dogfood log.
  - Kept npm availability marked as blocked; npm latest remains `0.1.1`.
- Verification run:
  - GitHub release: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.23.0>
  - GitHub release asset: `agentloopkit-0.23.0.tgz`
  - GitHub release asset SHA-256: `b96f356db5b5b2f94a0f284590f3d272afe20fe87b6668e10c599164be72b27f`
  - Release asset smoke: downloaded tarball reported `agentloop version` as `0.23.0`.
  - Release asset PowerShell smoke: downloaded tarball printed `Register-ArgumentCompleter`.
  - CI run `27253026447`: pass.
  - Publish workflow run `27253066701`: package checks passed, npm publish failed with `E404`.
  - `npm view agentloopkit version versions --json`: latest `0.1.1`, versions `0.1.0` and `0.1.1`.
  - `npx tsx src/cli/index.ts verify --task .agentloop/tasks/2026-06-10-record-v0-23-0-release-status.md`: pass, wrote `.agentloop/reports/2026-06-10-06-26-verification-report.md`.
  - `npx tsx src/cli/index.ts handoff --task .agentloop/tasks/2026-06-10-record-v0-23-0-release-status.md --json`: pass, wrote `.agentloop/handoffs/2026-06-10-06-27-pr-summary.md`.
- Worked well:
  - The release asset matched the locally verified tarball digest.
- Improve:
  - Configure npm trusted publishing or complete local browser/OTP auth before the next real npm publish attempt.

## 2026-06-10: Roadmap Refresh For v0.23.0

- Task contract: `.agentloop/tasks/2026-06-10-refresh-roadmap-v0-23-0.md`
- Product cycle: `.agentloop/research/interview-cycle-093.md`
- Trigger:
  - `ROADMAP.md` still listed shipped completions as bash, zsh, and fish only.
  - Its npm blocker section stopped at `v0.22.0` even though GitHub release `v0.23.0` is public.
- Product changes:
  - Updated the shipped section to include PowerShell completions.
  - Rewrote the current blocker section around GitHub `v0.23.0`, npm `0.1.1`, and Publish workflow `E404`.
  - Kept near-term roadmap work focused on npm auth/trusted publishing, tarball fallback cleanup, and SchemaStore after npm is stable.
- Verification run:
  - `npx pnpm@10.12.1 check:links`: pass, 500 Markdown files checked.
  - `git diff --check`: pass.
  - Roadmap stale-wording search: pass, no bash/zsh/fish-only completion line remains.
  - `npx tsx src/cli/index.ts verify --task .agentloop/tasks/2026-06-10-refresh-roadmap-v0-23-0.md`: pass, wrote `.agentloop/reports/2026-06-10-08-15-verification-report.md`.
  - AgentLoop verification commands: Vitest 28 files and 113 tests, lint, typecheck, and build all passed.
  - `npx tsx src/cli/index.ts handoff --task .agentloop/tasks/2026-06-10-refresh-roadmap-v0-23-0.md --json`: pass, wrote `.agentloop/handoffs/2026-06-10-08-17-pr-summary.md`.
- Worked well:
  - The roadmap is now shorter and more current without adding product scope.
- Improve:
  - After npm publishes `0.23.0`, remove temporary tarball fallback references from public docs.

## 2026-06-10: Current Release State Clarity

- Task contract: `.agentloop/tasks/2026-06-10-clarify-current-release-state.md`
- Product cycle: `.agentloop/research/interview-cycle-094.md`
- Trigger:
  - README named GitHub release `v0.23.0` but still cited the older `v0.22.0` publish workflow in the current npm-gap paragraph.
  - Current-state handoff text led with older release attempts before the current `v0.23.0` package line.
- Product changes:
  - Fixed the README workflow reference to `v0.23.0`.
  - Added a short explanation of the one-time npm catch-up jump from `0.1.1` to `0.23.0`.
  - Updated release-status docs and launch checklist with the current-main publish rule.
  - Simplified current publish-gap and known-limitations wording in `FINAL_HANDOFF.md`.
- Verification run:
  - `npx pnpm@10.12.1 check:links`: pass, 506 Markdown files checked.
  - `git diff --check`: pass.
  - Stale current-release wording search: pass, no stale README current-release workflow reference remains.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `npm view agentloopkit version versions --json`: latest `0.1.1`; versions `0.1.0` and `0.1.1`.
  - `npx tsx src/cli/index.ts verify --task .agentloop/tasks/2026-06-10-clarify-current-release-state.md`: pass, wrote `.agentloop/reports/2026-06-10-08-25-verification-report.md`.
  - AgentLoop verification commands: Vitest 28 files and 113 tests, lint, typecheck, and build all passed.
  - `npx tsx src/cli/index.ts handoff --task .agentloop/tasks/2026-06-10-clarify-current-release-state.md --json`: pass, wrote `.agentloop/handoffs/2026-06-10-08-27-pr-summary.md`.
- Worked well:
  - The task exposed a stale public sentence without requiring a release or package metadata change.
- Improve:
  - After npm publishes `0.23.0`, remove temporary tarball fallback references from README and release-status docs.

## 2026-06-10: GitLab And Buildkite CI Examples

- Task contract: `.agentloop/tasks/2026-06-10-add-gitlab-and-buildkite-ci-examples.md`
- Product cycle: `.agentloop/research/interview-cycle-095.md`
- Trigger:
  - GitHub Actions recipes existed, but GitLab CI and Buildkite users had no copyable provider examples.
  - `examples/github-actions/README.md` still pinned the older `v0.19.0` GitHub release tarball.
- Product changes:
  - Added GitLab CI evidence-gate and verification-artifact snippets.
  - Added Buildkite evidence-gate and verification-artifact snippets.
  - Updated the GitHub Actions example to pin the current `v0.23.0` tarball while npm serves `0.1.1`.
  - Linked provider examples from README, getting-started docs, GitHub Actions docs, and CI summary docs.
  - Documented that GitLab CI and Buildkite currently produce Generic CI provenance, not provider-specific metadata.
- Verification run:
  - Stale example tarball search: pass, no `v0.19.0` pin remains in `examples/github-actions/README.md`.
  - `npx pnpm@10.12.1 check:links`: pass, 512 Markdown files checked.
  - `git diff --check`: pass.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `npx tsx src/cli/index.ts verify --task .agentloop/tasks/2026-06-10-add-gitlab-and-buildkite-ci-examples.md`: pass, wrote `.agentloop/reports/2026-06-10-08-35-verification-report.md`.
  - AgentLoop verification commands: Vitest 28 files and 113 tests, lint, typecheck, and build all passed.
  - `npx tsx src/cli/index.ts handoff --task .agentloop/tasks/2026-06-10-add-gitlab-and-buildkite-ci-examples.md --json`: pass, wrote `.agentloop/handoffs/2026-06-10-08-36-pr-summary.md`.
- Worked well:
  - The provider examples reuse existing local commands and do not add workflow installation scope.
- Improve:
  - If users ask for richer provider provenance, add allowlisted GitLab CI and Buildkite metadata in a focused CLI change with tests.

## 2026-06-10: GitLab And Buildkite CI Provenance

- Task contract: `.agentloop/tasks/2026-06-10-add-gitlab-and-buildkite-ci-provenance.md`
- Product cycle: `.agentloop/research/interview-cycle-096.md`
- Trigger:
  - GitLab CI and Buildkite examples were added, but reports still identified those environments as Generic CI.
- Product changes:
  - Added failing tests first for GitLab CI and Buildkite verification reports and CI summaries.
  - Added provider-specific detection for documented, non-secret GitLab CI and Buildkite variables.
  - Updated CI summary, verification report, GitHub Actions, GitLab CI, Buildkite, and README docs.
  - Kept provider support local: no API calls, no token reads, no arbitrary environment dumps.
- Verification run:
  - Red test: `npx pnpm@10.12.1 test tests/verification.test.ts tests/ci-summary.test.ts` failed before implementation because both providers returned Generic CI.
  - Focused green test: `npx pnpm@10.12.1 test tests/verification.test.ts tests/ci-summary.test.ts`: pass, 2 files and 18 tests.
  - CI-like regression reproduction: `GITHUB_ACTIONS=true GITHUB_REPOSITORY=owner/current GITHUB_RUN_ID=999 npx pnpm@10.12.1 test tests/ci-summary.test.ts -- --runInBand` failed before test isolation and passed after overriding unrelated provider flags in simulated provider env.
  - `npx pnpm@10.12.1 check:links`: pass, 516 Markdown files checked.
  - `git diff --check`: pass.
  - `npx projscan doctor --format markdown`: A, 100/100 after replacing token-like test fixture names.
  - `npx tsx src/cli/index.ts verify --task .agentloop/tasks/2026-06-10-add-gitlab-and-buildkite-ci-provenance.md`: pass, wrote `.agentloop/reports/2026-06-10-08-53-verification-report.md`.
  - AgentLoop verification commands: Vitest 28 files and 117 tests, lint, typecheck, and build all passed.
  - `npx tsx src/cli/index.ts handoff --task .agentloop/tasks/2026-06-10-add-gitlab-and-buildkite-ci-provenance.md --json`: pass, wrote `.agentloop/handoffs/2026-06-10-08-54-pr-summary.md`.
- Worked well:
  - The shared `detectCiContext` helper kept verification reports and CI summaries consistent.
- Improve:
  - Add another provider only when there is a concrete workflow example and documented non-secret environment variables.

## 2026-06-10: Security Review Example

- Task contract: `.agentloop/tasks/2026-06-10-add-security-review-example.md`
- Product cycle: `.agentloop/research/interview-cycle-097.md`
- Trigger:
  - The repo had risk-file warnings, policies, verification reports, and handoffs, but no copyable security-review workflow that tied those pieces together.
- Product changes:
  - Added `docs/security-review.md`.
  - Added `examples/security-review/README.md`.
  - Added sample security-review task, verification report, and PR summary artifacts.
  - Linked the workflow from README, getting-started, and policy docs.
  - Kept the claims narrow: no scanner, compliance claim, secret scanning, policy engine, or cloud feature.
- Verification run:
  - `npx pnpm@10.12.1 check:links`: pass, 525 Markdown files checked.
  - `git diff --check`: pass.
  - Public-claim wording search: pass, no real-user feedback claims added and security limits are explicit.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `npx tsx src/cli/index.ts verify --task .agentloop/tasks/2026-06-10-add-security-review-example.md`: pass, wrote `.agentloop/reports/2026-06-10-09-04-verification-report.md`.
  - AgentLoop verification commands: Vitest 28 files and 117 tests, lint, typecheck, and build all passed.
- Worked well:
  - The task contract kept this iteration docs/examples-only and avoided accidental security-product scope.
- Improve:
  - A future release-checklist example could show how to package docs-only trust improvements while npm is behind GitHub releases.

## 2026-06-10: Doctor Risk File Heuristics Docs

- Task contract: `.agentloop/tasks/2026-06-10-document-doctor-risk-file-heuristics.md`
- Product cycle: `.agentloop/research/interview-cycle-098.md`
- Trigger:
  - `doctor` reports risk-file categories, but public guidance did not explain all categories, warning-only semantics, env-file path-only handling, and reviewer actions in one place.
- Product changes:
  - Added `docs/doctor-risk-files.md`.
  - Linked the page from README, getting-started, and security-review docs.
  - Updated the backlog and final handoff with Cycle 98.
  - Kept this docs-only: no doctor behavior change, JSON shape change, scanner, risk score, dependency, or policy engine.
- Verification run:
  - `npx pnpm@10.12.1 check:links`: pass, 530 Markdown files checked.
  - `git diff --check`: pass.
  - Public-claim wording search: pass, only limit statements found.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `npx tsx src/cli/index.ts verify --task .agentloop/tasks/2026-06-10-document-doctor-risk-file-heuristics.md`: pass, wrote `.agentloop/reports/2026-06-10-09-10-verification-report.md`.
  - AgentLoop verification commands: Vitest 28 files and 117 tests, lint, typecheck, and build all passed.
- Worked well:
  - The dedicated page gives agents a clear place to learn how risk warnings should shape task contracts.
- Improve:
  - Future example workflows should link to risk-file guidance when they involve dependencies, deployments, migrations, or billing.

## 2026-06-10: Framework-Specific Task Recipes

- Task contract: `.agentloop/tasks/2026-06-10-add-framework-specific-task-recipes.md`
- Product cycle: `.agentloop/research/interview-cycle-099.md`
- Trigger:
  - Stack recipes covered broad project types, but Remix, SvelteKit, Django, and FastAPI users still needed framework-specific task-contract examples.
- Product changes:
  - Added Remix and SvelteKit recipes to `docs/stack-recipes.md`.
  - Added Django and FastAPI recipes to `docs/stack-recipes.md`.
  - Updated README and getting-started docs to mention the expanded recipe set.
  - Updated backlog and final handoff with Cycle 99.
  - Kept this docs-only: no framework detection, runners, sample apps, package graph inference, dependency changes, or official-support claims.
- Verification run:
  - `npx pnpm@10.12.1 check:links`: pass, 534 Markdown files checked.
  - `git diff --check`: pass.
  - Public-support wording search: pass, only the internal non-decision mentions official support.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `npx tsx src/cli/index.ts verify --task .agentloop/tasks/2026-06-10-add-framework-specific-task-recipes.md`: pass, wrote `.agentloop/reports/2026-06-10-09-17-verification-report.md`.
  - AgentLoop verification commands: Vitest 28 files and 117 tests, lint, typecheck, and build all passed.
- Worked well:
  - Recipes improve framework recognition without increasing CLI maintenance scope.
- Improve:
  - Add more framework recipes only when they preserve the same command, task, and extra-care structure.

## 2026-06-10: Dependency Upgrade Workflow Example

- Task contract: `.agentloop/tasks/2026-06-10-add-dependency-upgrade-workflow-example.md`
- Product cycle: `.agentloop/research/interview-cycle-100.md`
- Trigger:
  - Agent-generated dependency changes need clearer package, lockfile, verification, skipped-check, and rollback evidence.
- Product changes:
  - Added `docs/dependency-upgrades.md`.
  - Added `examples/dependency-upgrade/README.md`.
  - Added sample dependency-upgrade task, verification report, and PR summary artifacts.
  - Linked the workflow from README, getting-started, and policy docs.
  - Kept the scope local and boring: no dependency changes, scanners, advisory APIs, registry calls, bots, or package-manager automation.
- Verification run:
  - `npx pnpm@10.12.1 check:links`: pass, 543 Markdown files checked.
  - `git diff --check`: pass.
  - Public-overclaim search: pass, only non-goal wording found.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `npx tsx src/cli/index.ts verify --task .agentloop/tasks/2026-06-10-add-dependency-upgrade-workflow-example.md`: pass, wrote `.agentloop/reports/2026-06-10-09-24-verification-report.md`.
  - AgentLoop verification commands: Vitest 28 files and 117 tests, lint, typecheck, and build all passed.
- Worked well:
  - The workflow gives dependency PR reviewers a concrete evidence shape without pretending AgentLoopKit audits packages.
- Improve:
  - Add package-manager-specific variants only if they stay small and do not imply package-manager automation.

## 2026-06-10: Release Checklist Example

- Task contract: `.agentloop/tasks/2026-06-10-add-release-checklist-example.md`
- Product cycle: `.agentloop/research/interview-cycle-101.md`
- Trigger:
  - Maintainers needed a compact example for documenting a GitHub-current/npm-lag release without publishing, tagging, changing package metadata, or implying npm availability.
- Product changes:
  - Added `docs/release-checklist-example.md`.
  - Added `examples/release-checklist/README.md`.
  - Added sample release task, verification report, and release handoff artifacts under `examples/release-checklist/.agentloop/`.
  - Linked the workflow from README, launch checklist, npm publishing docs, and release-status docs.
  - Updated backlog and final handoff with Cycle 101.
  - Kept the scope docs/examples-only: no package metadata, changelog, workflow, release, tag, or npm publish change.
- Verification run:
  - `npx pnpm@10.12.1 check:links`: pass, 552 Markdown files checked.
  - `git diff --check`: pass.
  - Public-overclaim search: pass, only historical release records and explicit non-claim wording found.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `npx tsx src/cli/index.ts verify --task .agentloop/tasks/2026-06-10-add-release-checklist-example.md`: pass, wrote `.agentloop/reports/2026-06-10-09-32-verification-report.md`.
  - AgentLoop verification commands: Vitest 28 files and 117 tests, lint, typecheck, and build all passed.
  - `npx tsx src/cli/index.ts handoff --task .agentloop/tasks/2026-06-10-add-release-checklist-example.md --json`: pass, wrote `.agentloop/handoffs/2026-06-10-09-35-pr-summary.md`.
  - `npx tsx src/cli/index.ts check-gates --json`: pass, all gates passed.
- Worked well:
  - The example gives maintainers a smaller handoff shape than the full launch checklist.
- Improve:
  - A future npm catch-up smoke-test script could verify a tarball or registry version without publishing.

## 2026-06-10: npm-status Catch-Up Check

- Task contract: `.agentloop/tasks/2026-06-10-add-npm-status-catch-up-check.md`
- Product cycle: `.agentloop/research/interview-cycle-102.md`
- Trigger:
  - Maintainers needed a safe way to check whether npm latest has caught up to local package metadata without publishing, reading credentials, or changing release metadata.
- Product changes:
  - Added `agentloop npm-status`.
  - Added JSON output, captured registry JSON mode, and `--expect-current`.
  - Added core npm registry parsing and status classification.
  - Added shell completion entries.
  - Added `docs/npm-status.md`.
  - Updated README, getting-started, publishing, release-status, release-checklist, release-notes, launch checklist, root guidance, harness templates, backlog, final handoff, and decisions.
  - Kept the command read-only: no publish automation, token reads, env reads, tags, releases, workflow changes, or package metadata changes.
- Verification run:
  - Red test: `npx pnpm@10.12.1 test tests/npm-status.test.ts tests/completion.test.ts` failed before `npm-status` core, command, and completion entries existed.
  - Focused green test: `npx pnpm@10.12.1 test tests/npm-status.test.ts tests/completion.test.ts`: pass, 2 files and 13 tests.
  - `npx pnpm@10.12.1 typecheck`: pass.
  - Live registry smoke: `npx tsx src/cli/index.ts npm-status --json`: pass, reported `catch-up-needed`, npm latest `0.1.1`, and local version `0.23.0`.
  - Expected strict failure: `npx tsx src/cli/index.ts npm-status --expect-current`: exit code 1 because npm latest does not match local version.
  - `npx pnpm@10.12.1 check:links`: pass, 557 Markdown files checked.
  - `git diff --check`: pass.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `npx tsx src/cli/index.ts verify --task .agentloop/tasks/2026-06-10-add-npm-status-catch-up-check.md`: pass, wrote `.agentloop/reports/2026-06-10-09-50-verification-report.md`.
  - AgentLoop verification commands: Vitest 29 files and 121 tests, lint, typecheck, and build all passed.
- Worked well:
  - Captured registry JSON mode made CLI tests deterministic without network.
- Improve:
  - Add release-workflow examples for `npm-status --expect-current` after npm trusted publishing is repaired.

## 2026-06-10: Prepare 0.24.0 npm-status Release

- Task contract: `.agentloop/tasks/2026-06-10-prepare-0-24-0-npm-status-release.md`
- Product cycle: `.agentloop/research/interview-cycle-103.md`
- Trigger:
  - `agentloop npm-status` landed after public GitHub release `v0.23.0`, so current `main` needed a coherent `0.24.0` release line before any npm catch-up publish.
- Product changes:
  - Bumped package metadata to `0.24.0`.
  - Added the `0.24.0` changelog section for `agentloop npm-status`.
  - Updated README, release-status, npm publishing, launch checklist, CI examples, release-note docs, release-checklist examples, and final handoff current-state guidance to use `v0.24.0`.
  - Added the Cycle 103 product-panel record and backlog item.
  - Kept the release task metadata/docs-only: no CLI behavior changes, workflow mutation, token reads, env reads, or npm publish attempt without authentication.
- Verification run:
  - `npx tsx src/cli/index.ts version`: pass, reported `0.24.0`.
  - `node dist/cli/index.js version`: pass, reported `0.24.0`.
  - `node scripts/prepublish-check.mjs`: pass.
  - `npx pnpm@10.12.1 test`: pass, 29 files and 121 tests.
  - `npx pnpm@10.12.1 lint`: pass.
  - `npx pnpm@10.12.1 typecheck`: pass.
  - `npx pnpm@10.12.1 build`: pass.
  - `npx pnpm@10.12.1 check:links`: pass, 559 Markdown files checked.
  - `npm publish --access public --dry-run`: pass, including `prepublishOnly`.
  - `npm pack --pack-destination /tmp --silent`: pass, produced `/tmp/agentloopkit-0.24.0.tgz`.
  - Tarball SHA-256: `4e721a9627d94944f300a60d71a14b0e519045ac3eb51d637f7227503f2a962d`.
  - Packed tarball smoke: `npx --yes --package /tmp/agentloopkit-0.24.0.tgz agentloop version` reported `0.24.0`.
  - Packed tarball npm-status smoke: `npx --yes --package /tmp/agentloopkit-0.24.0.tgz agentloop npm-status --registry-json /tmp/npm-view-agentloopkit.json --json` reported `catch-up-needed`, local `0.24.0`, and npm latest `0.1.1`.
  - Packed tarball PowerShell smoke: `npx --yes --package /tmp/agentloopkit-0.24.0.tgz agentloop completion powershell` printed `Register-ArgumentCompleter`.
  - Packed tarball init smoke: `agentloop init --dry-run --json` listed the expected generated files in a temp git repo.
  - `npx tsx src/cli/index.ts npm-status --expect-current`: expected fail with exit code 1 because npm latest is still `0.1.1`.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `git diff --check`: pass.
  - `npx tsx src/cli/index.ts verify --task .agentloop/tasks/2026-06-10-prepare-0-24-0-npm-status-release.md`: pass, wrote `.agentloop/reports/2026-06-10-10-09-verification-report.md`.
  - AgentLoop verification commands: Vitest 29 files and 121 tests, lint, typecheck, and build all passed.
  - `npm whoami`: expected fail with `E401`, so local npm publish remains blocked from this shell.
- Handoff generated:
  - Release notes: `.agentloop/handoffs/2026-06-10-10-13-release-notes.md`.
  - PR summary: `.agentloop/handoffs/2026-06-10-10-13-pr-summary.md`.
- Post-release status:
  - GitHub release `v0.24.0` was created at `https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.24.0`.
  - GitHub release asset `agentloopkit-0.24.0.tgz` reported digest `sha256:4e721a9627d94944f300a60d71a14b0e519045ac3eb51d637f7227503f2a962d`, matching the local tarball.
  - CI run `27262792610` passed on commit `1f51e8b`.
  - Release-triggered Publish workflow run `27262870591` passed package checks and failed at `npm publish --access public` with `E404`.
  - npm registry proof after the workflow still reported latest `0.1.1` and versions `0.1.0`, `0.1.1`.
- Worked well:
  - Dogfooding `npm-status` made the npm gap inspectable without publishing or reading credentials.
  - The tarball smoke checks caught the exact artifact users will run from GitHub until npm catches up.
- Improve:
  - Configure npm trusted publishing or complete a fresh local npm login before the real npm catch-up release attempt.

## 2026-06-10: Big Bug Pass

- Task contract: `.agentloop/tasks/2026-06-10-run-big-bug-pass.md`
- Trigger:
  - Real first-run usage had already exposed init edge cases, so AgentLoopKit needed a broader safety and packaging sweep before the next patch release.
- Bugs fixed:
  - `agentloop verify --task <path>` could read an arbitrary Markdown file outside the configured task directory. It now reports outside task paths as unavailable instead of reading them.
  - `agentloop create-task --out <path>` could write a task contract outside the configured task directory. It now requires a Markdown path inside the configured task directory.
  - `agentloop init --dry-run` still allowed home-directory detection without `--force`. It now uses the same home-directory guard as real init.
  - The home-directory guard compared unresolved paths. It now compares real paths so symlink aliases such as `/var` and `/private/var` do not bypass the guard.
- Verification run:
  - Red test: `npx pnpm@10.12.1 test tests/verification.test.ts` failed before the outside-task read guard.
  - Red test: `npx pnpm@10.12.1 test tests/create-task.test.ts` failed before the outside-task write guard.
  - Red test: `npx pnpm@10.12.1 test tests/init.test.ts` failed before the dry-run and symlinked-home guards.
  - Focused green tests: `tests/verification.test.ts`, `tests/create-task.test.ts`, and `tests/init.test.ts` passed after fixes.
  - `npm run lint`: pass.
  - `npm run typecheck`: pass.
  - `npm test`: pass, 29 files and 129 tests.
  - `npx pnpm@10.12.1 check:links`: pass, 576 Markdown files checked.
  - `git diff --check`: pass.
  - `npm run build`: pass.
  - `npx projscan doctor --format markdown`: A, 100/100.
  - `npm publish --access public --dry-run`: pass, including `prepublishOnly`.
  - Packed tarball smoke: pass for `agentloop version`, `agentloop init`, blocked `create-task --out` outside the task directory, blocked `verify --task` outside the task directory, and blocked `init --dry-run` from a fake home directory.
  - AgentLoop verification: `node dist/cli/index.js verify --task .agentloop/tasks/2026-06-10-run-big-bug-pass.md --command "npx projscan doctor --format markdown"` passed and wrote `.agentloop/reports/2026-06-10-13-48-verification-report.md`.
- Handoff generated:
  - `.agentloop/handoffs/2026-06-10-13-49-pr-summary.md`
- Worked well:
  - Packed smoke testing the npm tarball caught the symlink path alias bug after source-level tests had already passed.
  - Projscan stayed useful as a quick health gate after the focused safety fixes.
- Improve:
  - Add a reusable release-smoke script so tarball guard checks are less dependent on one-off shell scripts.

## 2026-06-10: 0.24.4 README Pin Patch

- Task contract: `.agentloop/tasks/2026-06-10-prepare-0-24-4-readme-pin-patch.md`
- Trigger:
  - After `0.24.3` was published, `npm view agentloopkit@0.24.3 readme` still showed README examples pinned to `0.24.2`.
  - Because npm displays the packaged README, the package needed an immediate patch release with current user-facing pins.
- Product changes:
  - Bumped package metadata to `0.24.4`.
  - Updated README pinned-version examples to `0.24.4`.
  - Added the `0.24.4` changelog entry.
  - Kept the release docs-only with no CLI behavior changes.
- Verification run:
  - `npm run lint`: pass.
  - `npm run typecheck`: pass.
  - `npm test`: pass, 29 files and 129 tests.
  - `npx pnpm@10.12.1 check:links`: pass, 579 Markdown files checked.
  - `git diff --check`: pass.
  - `npm run build`: pass.
  - `npm publish --access public --dry-run`: pass, including `prepublishOnly`.
  - Packed README inspection: pass; `/tmp/agentloopkit-0.24.4.tgz` contains README examples pinned to `0.24.4`.
  - AgentLoop verification: `node dist/cli/index.js verify --task .agentloop/tasks/2026-06-10-prepare-0-24-4-readme-pin-patch.md --json` passed and wrote `.agentloop/reports/2026-06-10-14-00-verification-report.md`.
  - GitHub CI run `27274845018`: pass.
  - GitHub Publish workflow run `27274917826`: pass and published `agentloopkit@0.24.4` through trusted publishing.
  - Registry proof: `npm view agentloopkit version versions --json` reported latest `0.24.4`.
  - npm README proof: `npm view agentloopkit@0.24.4 readme` showed pinned examples for `0.24.4` and no `0.24.2` or `0.24.3` pins.
- Handoff generated:
  - `.agentloop/handoffs/2026-06-10-14-01-pr-summary.md`
- Worked well:
  - Checking npm's rendered README caught the stale package content before stopping.
- Improve:
  - Add packaged README inspection to the reusable tarball smoke script backlog item.

## 2026-06-10: Release Smoke Script

- Task contract: `.agentloop/tasks/2026-06-10-add-release-smoke-script.md`
- Product cycle: `.agentloop/research/interview-cycle-105.md`
- Trigger:
  - The 0.24.3 and 0.24.4 releases depended on one-off shell smoke commands for packed-package behavior.
  - Those commands caught real issues, but they were not repeatable enough for future release handoffs.
- Product changes:
  - Added `scripts/smoke-packed-release.mjs`.
  - Added `npm run smoke:release`.
  - Added `tests/release-smoke.test.ts`.
  - Documented the command in release maintainer docs.
  - Updated backlog status for the reusable tarball smoke item.
- Verification run:
  - Red test: `npm run test -- tests/release-smoke.test.ts` failed before the script existed.
  - Red test: focused test failed before direct-run detection handled paths with spaces.
  - Focused green test: `npm run test -- tests/release-smoke.test.ts`: pass, 4 tests.
  - `npm run lint`: pass.
  - `npm run typecheck`: pass.
  - `npx pnpm@10.12.1 check:links`: pass, 583 Markdown files checked.
  - `git diff --check`: pass.
  - `npm run smoke:release`: pass; packed the local package, verified version output, init, task path guards, verification task guard, home-directory dry-run refusal, and README pins.
  - AgentLoop verification: `node dist/cli/index.js verify --task .agentloop/tasks/2026-06-10-add-release-smoke-script.md --command "npm run smoke:release" --json` passed with 30 test files and 133 tests, plus lint, typecheck, build, and the packed-release smoke.
- Handoff generated:
  - `.agentloop/handoffs/2026-06-10-14-23-pr-summary.md`
- Worked well:
  - The script reproduced the packed-package checks without publishing, tagging, reading tokens, calling GitHub APIs, or reading `.env` files.
  - The direct-run regression caught the path-with-spaces issue in this repo path.
- Improve:
  - Run `npm run smoke:release` before every future npm/GitHub release candidate.

## 2026-06-10: README VHS Demo Refresh

- Task contract: `.agentloop/tasks/2026-06-10-refresh-readme-vhs-demo.md`
- Product cycle: `.agentloop/research/interview-cycle-106.md`
- Trigger:
  - The README terminal GIF had grown into a broad command catalog.
  - The npm README needed a cleaner public demo that starts with `npx agentloopkit init` and shows the evidence loop.
- Product changes:
  - Updated `docs/assets/readme/agentloopkit-cli.tape`.
  - Regenerated `docs/assets/readme/agentloopkit-cli.gif`.
  - Updated README alt text to match the commands shown.
  - Updated the README asset regeneration notes.
- Verification run:
  - `vhs docs/assets/readme/agentloopkit-cli.tape`: pass; regenerated a 1200x720 GIF.
  - `npx playwright screenshot --viewport-size=1440,960 file://.../showcase.html docs/assets/readme/agentloopkit-showcase.png`: pass; rendered unchanged PNG bytes.
  - `npx playwright screenshot --viewport-size=1440,960 file://.../verification.html docs/assets/readme/agentloopkit-verification.png`: pass; rendered unchanged PNG bytes.
  - `ffprobe docs/assets/readme/agentloopkit-cli.gif`: reports 1200x720, 30.52 seconds, 763 frames.
  - `ffmpeg` frame sampling: start, task, verification, handoff, and end frames rendered for visual inspection.
  - `view_image`: visual check confirmed the final GIF starts with user-facing commands, avoids the setup command at the loop boundary, uses human task output instead of JSON walls, and ends on local report and badge output.
  - `npm publish --access public --dry-run`: pass; prepublishOnly reran typecheck, 30 Vitest files / 133 tests, and build, then produced the `agentloopkit@0.24.5` dry-run tarball listing.
  - AgentLoop verification: `.agentloop/reports/2026-06-10-14-53-verification-report.md` passed with Vitest, lint, typecheck, build, `npm run smoke:release`, link check, prepublish guard, and projscan.
  - Handoff generated: `.agentloop/handoffs/2026-06-10-14-54-pr-summary.md`.
- Worked well:
  - VHS exposed issues that static review would have missed: escaped JSON walls, overtyped output, and setup frames leaking through `LoopOffset`.
  - Replacing a fixed sleep with `Wait` kept setup hidden until the prompt returned.
  - The new release smoke script verified that the packaged README pins match `package.json` before publish.
- Improve:
  - Consider whether `.agentloop/state.json` should be ignored by default in generated harnesses; it appeared as local dogfood state while this task was active.
  - Projscan reported the release-smoke helper exports as unused because the Vitest coverage imports the `.mjs` script dynamically; track whether projscan should detect that pattern later.

## 2026-06-10: GitHub Linguist README HTML Assets

- Task contract: `.agentloop/tasks/2026-06-10-mark-readme-html-assets-documentation.md`
- Trigger:
  - GitHub showed AgentLoopKit as roughly one-third HTML because it counted two static README screenshot source files.
- Product decision:
  - Keep the HTML sources because Playwright needs them for reproducible README PNGs.
  - Mark only `docs/assets/readme/*.html` as Linguist documentation.
  - Do not build or imply a frontend app.
- Verification run:
  - `git check-attr -a -- docs/assets/readme/showcase.html docs/assets/readme/verification.html`: both files report `linguist-documentation: true`.
- Worked well:
  - The fix is local to GitHub language stats and does not affect npm package behavior.
- Improve:
  - Consider adding a docs note if future contributors confuse README visual sources with product UI.

## 2026-06-10: Local-Only Harness Mode

- Task contract: `.agentloop/tasks/2026-06-10-add-local-only-harness-mode.md`
- Product cycle: `.agentloop/research/interview-cycle-107.md`
- Trigger:
  - Dogfooding AgentLoopKit inside another local repo showed a real setup split: the harness helps local agents, but not every repo owner wants to commit it.
  - The manual `.git/info/exclude` snippet worked, but it asked users to know Git internals.
- Product changes:
  - Added `agentloop init --local-only`.
  - Added a marked `.git/info/exclude` block for `.agentloop/`, `AGENTS.md`, `AGENTLOOP.md`, and `agentloop.config.json`.
  - Added local-only agent guidance to generated `AGENTS.md` and `AGENTLOOP.md`.
  - Documented local-only mode in README and getting started docs.
- Verification run:
  - Red test: `npm test -- tests/init.test.ts` failed before local-only mode existed.
  - Focused green test: `npm test -- tests/init.test.ts`: pass, 11 tests.
  - Full test suite: `npm test`: pass, 30 files and 137 tests.
  - Release checks: `npm run lint`, `npm run typecheck`, `npm run build`, `npx pnpm@10.12.1 check:links`, `git diff --check`, `node scripts/prepublish-check.mjs`, `npm run smoke:release`, and `npm publish --access public --dry-run`: pass.
  - Projscan: `npx projscan doctor --format markdown`: pass with health score A and the known dynamic-import export false positive for `scripts/smoke-packed-release.mjs`.
  - AgentLoop verification: `.agentloop/reports/2026-06-10-15-24-verification-report.md` passed with Vitest, lint, typecheck, build, and packed release smoke.
  - Handoff generated: `.agentloop/handoffs/2026-06-10-15-25-pr-summary.md`.
- Worked well:
  - Keeping the behavior behind an explicit flag preserves the normal shared-harness path.
  - Repo-local exclude gives users an undoable, inspectable Git change without touching `.gitignore`.
- Improve:
  - Consider adding generated guidance that describes `.agentloop/state.json` as local runtime state.

## 2026-06-10: MCP And Distribution Channels

- Task contracts:
  - `.agentloop/tasks/2026-06-10-build-mcp-server-prerequisite.md`
  - `.agentloop/tasks/2026-06-10-publish-mcp-registry-entry.md`
  - `.agentloop/tasks/2026-06-10-add-docker-ghcr-image.md`
  - `.agentloop/tasks/2026-06-10-add-github-action-wrapper.md`
- Product cycle: `.agentloop/research/interview-cycle-108.md`
- Trigger:
  - The product panel prioritized additional release channels after npm and GitHub Releases.
  - MCP Registry publication needed a real MCP server first.
- Product changes:
  - Added `agentloop mcp-server`.
  - Added read-only MCP tools for status, next action, tasks, active task content, policies, latest verification report, and handoff summaries.
  - Added `server.json` and package `mcpName`.
  - Added MCP Registry publish workflow gated on successful npm publishing.
  - Added root `action.yml`.
  - Added Dockerfile and GHCR release workflow.
  - Updated README, MCP docs, distribution docs, GitHub Actions docs, examples, backlog, decisions, roadmap, and changelog.
- Verification run so far:
  - Focused MCP tests: `npm test -- tests/mcp-tools.test.ts tests/mcp-server.test.ts`: pass.
  - Distribution artifact tests: `npm test -- tests/distribution-artifacts.test.ts`: pass.
  - Typecheck after MCP test typing fix: `npm run typecheck`: pass.
  - Full Vitest suite: `npm test`: pass, 33 files and 146 tests.
  - Full release verification: `.agentloop/reports/2026-06-10-16-13-verification-report.md`, overall status pass.
  - Release verification included Vitest, lint, typecheck, build, release smoke, Markdown link check, prepublish guard, `git diff --check`, projscan, and `npm publish --access public --dry-run`.
  - Final packed tarball SHA-256 for `/tmp/agentloopkit-0.26.0.tgz`: `a289ea89ee037ab4099e79102efbf21d3563b7e65961f1b1bd54a4a735cfba65`.
- Handoff generated:
  - `.agentloop/handoffs/2026-06-10-16-15-pr-summary.md`
- Pending before release:
  - None for the 0.26.1 release-channel work.
- Release proof:
  - GitHub release `v0.26.0` published with tarball SHA-256 `a289ea89ee037ab4099e79102efbf21d3563b7e65961f1b1bd54a4a735cfba65`.
  - npm Publish workflow `27282743955` passed for `0.26.0`.
  - Docker/GHCR workflow `27282743971` passed for `0.26.0`.
  - MCP Registry workflow `27282831636` failed because the registry enforces `description` length <= 100.
  - Patch release `0.26.1` shortened the registry description.
  - GitHub release `v0.26.1` published with tarball SHA-256 `cf836155a2cdfaf8eff818202aa651fc32b3b39a49256f25d0925ffbadad5cc6`.
  - npm Publish workflow `27283286721` passed for `0.26.1`.
  - Docker/GHCR workflow `27283287182` passed for `0.26.1`.
  - MCP Registry workflow `27283372191` passed for `0.26.1`.
- Worked well:
  - Keeping MCP read-only preserved the safety model while giving agents better structured access than filesystem scraping.
  - The distribution artifacts reuse the existing CLI instead of creating separate behavior.
- Improve:
  - Add Scoop and WinGet manifests only after Windows smoke testing.
  - Consider VS Code/Open VSX only after a clear editor workflow exists.

## 2026-06-10: AGENTS.md Specialist Roster

- Task contract: `.agentloop/tasks/2026-06-10-add-agents-md-specialist-roster.md`
- Trigger:
  - Maintainer clarified that "sub-agents" meant reusable specialist role definitions inside `AGENTS.md`, not live runtime delegation.
  - Future Codex, Claude Code, Cursor, OpenCode, Gemini CLI, and similar sessions need clearer routing guidance for product, release, docs, security, testing, and distribution work.
- Product changes:
  - Added an `Agent roster` section to this repository's `AGENTS.md`.
  - Added the same roster to the generated `src/templates/root/AGENTS.md`.
  - Documented the generated roster in README.
  - Added init test coverage for the generated roster.
  - Updated the changelog for the next release.
- Verification run:
  - Focused init test: `npx --yes pnpm@10.12.1 test tests/init.test.ts`: pass, 11 tests.
  - Full Vitest suite: `npx --yes pnpm@10.12.1 test`: pass, 33 files and 146 tests.
  - Typecheck: `npx --yes pnpm@10.12.1 typecheck`: pass.
  - Lint: `npx --yes pnpm@10.12.1 lint`: pass.
  - Build: `npx --yes pnpm@10.12.1 build`: pass.
  - Markdown links: `npx --yes pnpm@10.12.1 check:links`: pass, 601 files checked.
  - Formatting check: `npx --yes prettier@3.7.4 --check CHANGELOG.md AGENTS.md src/templates/root/AGENTS.md tests/init.test.ts README.md`: pass.
  - Projscan: `npx --yes projscan doctor --format markdown`: A, 97/100, with one existing informational unused-export warning for `scripts/smoke-packed-release.mjs`.
  - AgentLoop verification: `.agentloop/reports/2026-06-10-16-48-verification-report.md`, overall status pass.
- Handoff generated:
  - `.agentloop/handoffs/2026-06-10-16-49-pr-summary.md`
- Worked well:
  - The roster gives agents concrete responsibilities without adding a runtime orchestrator.
  - Keeping it in the root template means new `agentloop init` users get the guidance.
- Improve:
  - Consider a future `agentloop roles` command only if users want machine-readable role definitions. Do not build that before the template proves useful.

## 2026-06-10: Remove Homebrew Tap Channel

- Task contract: `.agentloop/tasks/2026-06-10-remove-homebrew-tap-channel.md`
- Trigger:
  - Maintainer rejected the temporary tap path because it is not Homebrew Core and should not be treated as a real release channel.
- Product changes:
  - Removed the Homebrew formula artifact from `packaging/homebrew/`.
  - Removed Homebrew tap claims from README, release-status docs, launch checklist, distribution docs, roadmap, npm publishing docs, and final handoff.
  - Removed the Homebrew formula test from distribution artifact coverage.
  - Updated backlog to reject tap maintenance unless Homebrew Core becomes realistic later.
- GitHub repo deletion:
  - Attempted `gh repo delete abhiyoheswaran1/homebrew-agentloopkit --yes`.
  - GitHub refused with `HTTP 403` because the current token lacks the `delete_repo` scope.
  - Required maintainer step: `gh auth refresh -h github.com -s delete_repo`, then rerun the delete command.
- Verification:
  - Focused distribution/init tests: `npx --yes pnpm@10.12.1 test tests/distribution-artifacts.test.ts tests/init.test.ts`: pass, 15 tests.
  - Full Vitest suite: `npx --yes pnpm@10.12.1 test`: pass, 33 files and 145 tests.
  - Typecheck: `npx --yes pnpm@10.12.1 typecheck`: pass.
  - Lint: `npx --yes pnpm@10.12.1 lint`: pass.
  - Build: `npx --yes pnpm@10.12.1 build`: pass.
  - Markdown links: `npx --yes pnpm@10.12.1 check:links`: pass, 604 files checked.
  - Formatting check: `npx --yes prettier@3.7.4 --check ...`: pass.
  - Whitespace: `git diff --check`: pass.
  - Projscan: `npx --yes projscan doctor --format markdown`: A, 97/100, with one existing informational unused-export warning for `scripts/smoke-packed-release.mjs`.
  - AgentLoop verification: `.agentloop/reports/2026-06-10-16-57-verification-report.md`, overall status pass.

## 2026-06-10: Release 0.26.2 Cleanup Patch

- Task contract: `.agentloop/tasks/2026-06-10-release-0-26-2-cleanup-patch.md`
- Trigger:
  - The cleanup work was on `main`, but npm and GitHub Releases still needed a patch release.
  - Public docs also needed to stop presenting an unsupported install channel as a current release path.
- Release proof:
  - GitHub release `v0.26.2` is public with attached `agentloopkit-0.26.2.tgz`.
  - GitHub release tarball SHA-256: `3b38dcba05817137630bd4509a2ec40b184cac2432104ee5ed2689c76518b6ee`.
  - npm Publish workflow `27285894024` passed and published `agentloopkit@0.26.2`.
  - Docker/GHCR workflow `27285894045` passed for `0.26.2`.
  - MCP Registry workflow `27285979859` passed for `0.26.2`.
  - `npm view agentloopkit dist-tags version versions --json` reports `latest: 0.26.2`.
  - `https://registry.npmjs.org/agentloopkit/latest` reports `version: 0.26.2`.
- Verification run:
  - `node scripts/prepublish-check.mjs`: pass.
  - `npx --yes pnpm@10.12.1 test`: pass, 33 files and 145 tests.
  - `npx --yes pnpm@10.12.1 typecheck`: pass.
  - `npx --yes pnpm@10.12.1 lint`: pass.
  - `npx --yes pnpm@10.12.1 build`: pass.
  - `npx --yes pnpm@10.12.1 check:links`: pass, 607 files checked.
  - `npm run smoke:release`: pass.
  - `npm publish --access public --dry-run`: pass.
  - `git diff --check`: pass.
  - `node dist/cli/index.js npm-status --expect-current`: pass after publish.
  - Direct temp install of `agentloopkit@0.26.2`: both `agentloop version` and `agentloopkit version` printed `0.26.2`.
- Worked well:
  - Trusted publishing released npm without handling npm tokens locally.
  - The registry proof was faster and more reliable than the npm website UI.
- Improve:
  - After each release, update status docs in the same follow-up commit if the release workflow runs after the version-prep commit.
  - Treat npmjs.com package pages as a web UI that can lag the registry; use `npm view` and the registry endpoint for release proof.

## 2026-06-10: Recommend Archiving Done Active Tasks

- Task contract: `.agentloop/tasks/2026-06-10-recommend-archiving-done-active-tasks.md`
- Trigger:
  - After the `0.26.2` release, `agentloop status` showed a finished release task as the active task.
  - The next action still pointed to starting a new task, which left the stale active pointer unresolved.
- Product change:
  - `agentloop status` and `agentloop next` now recommend `agentloop task archive <path>` when the pinned active task is already `done`.
  - The command remains read-only; it suggests the archive command but does not move files automatically.
- Verification run:
  - Red test first: `npx --yes pnpm@10.12.1 test tests/status.test.ts` failed because status recommended `agentloop verify`.
  - Focused status test: `npx --yes pnpm@10.12.1 test tests/status.test.ts`: pass, 6 tests.
  - Full Vitest suite: `npx --yes pnpm@10.12.1 test`: pass, 33 files and 146 tests.
  - Typecheck: `npx --yes pnpm@10.12.1 typecheck`: pass.
  - Lint: `npx --yes pnpm@10.12.1 lint`: pass.
  - Build: `npx --yes pnpm@10.12.1 build`: pass.
  - Markdown links: `npx --yes pnpm@10.12.1 check:links`: pass, 611 files checked.
  - Formatting check: `npx --yes prettier@3.7.4 --check ...`: pass.
  - Projscan: `npx --yes projscan doctor --format markdown`: A, 97/100, with the existing informational unused-export note for `scripts/smoke-packed-release.mjs`.
  - AgentLoop verification: `.agentloop/reports/2026-06-10-19-25-verification-report.md`, overall status pass.
- Worked well:
  - The stale active task appeared during normal AgentLoopKit dogfooding, so the fix addresses a real loop cleanup issue.
- Improve:
  - Consider a future `agentloop task finish` only if users repeatedly need a single command that verifies, hands off, marks done, and archives.

## 2026-06-10: Release 0.26.3 Status Cleanup Patch

- Task contract: `.agentloop/tasks/2026-06-10-prepare-0-26-3-status-cleanup-release.md`
- Trigger:
  - The status cleanup fix changed user-facing CLI behavior after `v0.26.2`.
  - Maintainer release policy is to publish current fixes through GitHub Releases and npm trusted publishing.
- Release proof:
  - GitHub release `v0.26.3` is public with attached `agentloopkit-0.26.3.tgz`.
  - GitHub release tarball SHA-256: `48bc379e41293cbcbc74facbf111548a307fb1bf3a179a0a08121cd2aa4c9c85`.
  - npm Publish workflow `27294103749` passed and published `agentloopkit@0.26.3`.
  - Docker/GHCR workflow `27294103779` passed for `0.26.3`.
  - MCP Registry workflow `27294196815` passed for `0.26.3`.
  - `npm view agentloopkit version versions --json` reports `latest: 0.26.3`.
  - Direct temp install of `agentloopkit@0.26.3` printed `0.26.3` for both `agentloop version` and `agentloopkit version`, and `agentloop init --dry-run` completed.
- Verification run:
  - Release verification: `.agentloop/reports/2026-06-10-19-30-verification-report.md`, overall status pass.
  - Verification included prepublish metadata, full Vitest, typecheck, lint, build, Markdown link check, release smoke, dry-run npm publish, projscan, and whitespace checks.
- Worked well:
  - Trusted publishing, GHCR, and MCP Registry workflows all completed from the GitHub release.
- Improve:
  - Keep post-release status docs in a follow-up commit whenever workflow IDs and registry proof are only available after the tag is released.

## 2026-06-10: Dogfood Done-Task Archive Recommendation

- Trigger:
  - After `v0.26.3`, `agentloop status` recommended archiving the completed active release task.
- Action:
  - Ran `agentloop task archive .agentloop/tasks/2026-06-10-prepare-0-26-3-status-cleanup-release.md`.
  - The task moved to `.agentloop/tasks/archive/2026-06-10-prepare-0-26-3-status-cleanup-release.md`.
- Result:
  - The explicit active-task pointer was cleared.
  - The new status command gave the expected cleanup instruction before the archive, then moved on to the next local evidence step.
- Improve:
  - Consider archiving older finished tasks in batches only if the normal task list becomes too noisy for maintainers.

## 2026-06-10: Submit Config Schema to SchemaStore

- Task contract: `.agentloop/tasks/2026-06-10-submit-agentloopkit-schema-to-schemastore.md`
- Trigger:
  - AgentLoopKit ships `schema/agentloop.config.schema.json`, and generated configs already reference the raw GitHub schema URL.
  - Editors that rely on SchemaStore cannot auto-discover `agentloop.config.json` until the catalog includes it.
- External work:
  - Confirmed the live SchemaStore catalog did not contain AgentLoopKit.
  - Opened SchemaStore PR #5783: <https://github.com/SchemaStore/schemastore/pull/5783>.
  - Kept the external PR to one catalog entry and six inserted lines.
  - Confirmed upstream SchemaStore checks passed, then the PR merged at 2026-06-10T17:54:33Z.
  - Confirmed the live SchemaStore catalog now contains the AgentLoopKit entry.
- Verification run:
  - AgentLoopKit final verification report under `.agentloop/reports/`, overall status pass.
  - SchemaStore `npm run typecheck`: pass.
  - SchemaStore targeted Prettier check for `src/api/json/catalog.json`: pass.
  - SchemaStore `git diff --check`: pass.
  - Parsed `src/api/json/catalog.json` and confirmed exactly one AgentLoopKit entry for `agentloop.config.json`.
  - Upstream SchemaStore checks: pass.
  - Raw SchemaStore master catalog check: pass.
  - Live SchemaStore catalog check: pass.
- Worked well:
  - The existing raw GitHub schema URL made the SchemaStore entry small and transparent.
  - Correcting the external PR body after shell quoting issues kept the upstream request readable.
- Improve:
  - If AgentLoopKit ever moves schema hosting, update the SchemaStore entry in the same release cycle.

## 2026-06-10: Release 0.26.4 SchemaStore Documentation Patch

- Task contract: `.agentloop/tasks/2026-06-10-prepare-0-26-4-schemastore-documentation-release.md`
- Trigger:
  - SchemaStore registration was live, but the npm-facing README and release-channel docs did not mention editor auto-discovery.
- Release proof:
  - GitHub release `v0.26.4`: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.26.4>.
  - GitHub release asset `agentloopkit-0.26.4.tgz` SHA-256: `a8ede1d0710d67b40fa80c1045e7cfda93afe32525c29f46997617cc6f17fbfa`.
  - npm Publish workflow `27296379647`: pass, published `agentloopkit@0.26.4`.
  - Docker/GHCR workflow `27296379642`: pass.
  - MCP Registry workflow `27296470988`: pass.
  - `npm view agentloopkit version versions --json` reports latest `0.26.4`.
  - Direct temp install of `agentloopkit@0.26.4` printed `0.26.4` for both binaries and completed `agentloop init --dry-run`.
- Verification run:
  - AgentLoopKit release verification report: `.agentloop/reports/2026-06-10-20-06-verification-report.md`, overall status pass.
  - Release smoke: pass.
  - Dry-run npm publish: pass.
  - Projscan: A, 97/100, with the existing informational unused-export note for `scripts/smoke-packed-release.mjs`.
- Worked well:
  - GitHub trusted publishing, GHCR, and MCP Registry all completed from the GitHub release without local tokens.
- Improve:
  - The release-notes command still includes an in-progress task status if notes are generated before the task is marked done; for future releases, generate public release notes after the final status transition when practical.

## 2026-06-10: Add Task Doctor Diagnostics

- Task contract: `.agentloop/tasks/archive/2026-06-10-add-task-doctor-diagnostics.md`
- Trigger:
  - Dogfooding showed many finished task contracts still in `.agentloop/tasks/`, including legacy `completed` and `verified` statuses.
  - Fallback task selection already ignores terminal statuses, but agents still lacked a read-only cleanup checklist.
- Implementation:
  - Added `agentloop task doctor` with human and JSON output.
  - Added diagnostics for terminal tasks, missing status lines, legacy statuses, and unsupported statuses.
  - Added shell completion coverage, README/docs updates, generated harness updates, and agent-guide updates.
- Verification run:
  - `.agentloop/reports/2026-06-10-21-13-verification-report.md`, overall status pass.
  - Commands included full Vitest, lint, typecheck, build, Markdown link check, `projscan doctor`, and built CLI `task doctor --json`.
- What worked well:
  - The new command immediately exposed the repo's own task cleanup backlog: 119 active task files checked, 103 diagnostics, 18 unsupported legacy statuses.
  - Keeping the command read-only made it safe to run during status checks and verification.
- Improve:
  - Consider a later, explicit bulk archive workflow only after the read-only diagnostics have proven useful.

## 2026-06-10: Prepare v0.27.0 Task Doctor Release

- Task contract: `.agentloop/tasks/2026-06-10-prepare-v0-27-0-task-doctor-release.md`
- Trigger:
  - `agentloop task doctor` was implemented and verified on `main`, but the package metadata and public release docs still pointed at `0.26.5`.
  - Local tags were missing `v0.26.5`, so release-note generation initially used too broad a range until tags were fetched.
- Release prep:
  - Bumped package metadata, MCP server metadata, and GitHub Action default version to `0.27.0`.
  - Moved unreleased task-doctor changelog entries into a `0.27.0` release section.
  - Updated current README, MCP, GitHub Actions, distribution-channel, and release-note examples to use `0.27.0`.
- Verification run:
  - `.agentloop/reports/2026-06-10-21-27-verification-report.md`, overall status pass.
  - Commands included full Vitest, lint, typecheck, build, changelog prepublish guard, Markdown link check, `projscan doctor`, packed release smoke, and npm publish dry-run.
  - `projscan doctor` remained A 97/100 with the known informational unused-export note in `scripts/smoke-packed-release.mjs`.
- Release proof:
  - GitHub release `v0.27.0`: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.27.0>.
  - GitHub release asset `agentloopkit-0.27.0.tgz` SHA-256: `7ff6cb0b2079da83b6cc1cad2b59485337338167388ce1deae01f0752f98f3e0`.
  - CI workflow `27300845808`: pass.
  - npm Publish workflow `27300950330`: pass, published `agentloopkit@0.27.0`.
  - Docker/GHCR workflow `27300951486`: pass.
  - MCP Registry workflow `27301046893`: pass.
  - `npm view agentloopkit version versions --json` reports latest `0.27.0`.
  - Clean temp-directory `npx --yes agentloopkit@0.27.0 version` smoke printed `0.27.0`.
- What worked well:
  - Fetching tags before release-note generation kept the release range anchored at `v0.26.5`.
  - Running npm dry-run inside `agentloop verify` captured the publish tarball summary in the release evidence.
- Improve:
  - Add a future release checklist item that verifies the latest local tag exists before generating release notes.

## 2026-06-10: Fix Unpinned Status Active Task Fallback

- Task contract: `.agentloop/tasks/archive/2026-06-10-fix-unpinned-status-active-task-fallback.md`
- Trigger:
  - `agentloop task current --json` treated no pinned task as `activeTask: null`, while `agentloop status --json` could label a newest unpinned task as active.
  - That mismatch could steer coding agents toward stale backlog work without an explicit `agentloop task set <path>`.
- Implementation:
  - Split `status` and `next` output into pinned `activeTask` and unpinned `latestTask`.
  - Updated next-action logic to recommend `agentloop task set <path>` when only an unpinned open task exists.
  - Updated README, status docs, MCP docs, generated harness templates, and repo guidance to use the new terms.
  - Removed a stale Homebrew-tap reference from the generated release-agent roster.
- Verification run:
  - `.agentloop/reports/2026-06-10-21-51-verification-report.md`, overall status pass.
  - Focused status/next tests, full Vitest, lint, typecheck, build, Markdown link check, `projscan doctor`, `git diff --check`, and built CLI `status`/`next` smoke checks passed.
  - `projscan doctor` remained A 97/100 with the known informational unused-export note in `scripts/smoke-packed-release.mjs`.
- Handoff:
  - `.agentloop/handoffs/2026-06-10-21-53-pr-summary.md`
  - Archived the completed task with `agentloop task archive`.
- What worked well:
  - The bug reproduced cleanly in JSON tests before the fix.
  - Dogfooding `status` after the build showed the current repo now reports the pinned task and `latestTask: null`.
- Improve:
  - Keep this change unreleased until the planned `0.28.0` batch instead of cutting another patch release.

## 2026-06-10: Add Deferred Task Status

- Task contract: `.agentloop/tasks/archive/2026-06-10-add-deferred-task-status.md`
- Trigger:
  - After separating `activeTask` and `latestTask`, `agentloop status` surfaced old proposed distribution-channel work as the latest open task.
  - Some task contracts represent parked future work, not the next task an agent should pick up.
- Implementation:
  - Added `deferred` as a supported task status.
  - Kept deferred task contracts visible in `agentloop task list` and `task show`.
  - Excluded deferred tasks from `status` and `next` fallback selection.
  - Kept `task doctor` from warning on deferred tasks.
  - Updated completions, CLI help, README, status docs, task-contract docs, generated task README, backlog notes, and local harness task README.
  - Marked the Scoop/WinGet and VS Code/Open VSX task contracts as deferred because they are later-channel work.
- Verification run:
  - `.agentloop/reports/2026-06-10-22-03-verification-report.md`, overall status pass.
  - Red run failed before implementation for task-state, status, next, and completion tests.
  - Focused tests passed after implementation: task-state, status, next, and completion.
  - Full Vitest passed: 33 files, 160 tests.
  - Lint, typecheck, build, Markdown link check, `projscan doctor`, `git diff --check`, and built CLI smoke checks passed.
  - `projscan doctor` remained A 97/100 with the known informational unused-export note in `scripts/smoke-packed-release.mjs`.
- Handoff:
  - `.agentloop/handoffs/2026-06-10-22-04-pr-summary.md`
- What worked well:
  - The `deferred` status solved the immediate dogfood problem without adding scheduling or priority behavior.
  - Centralizing completions on `TASK_STATUSES` prevents future status values from drifting between parser and shell completion output.
- Improve:
  - Consider archiving old done/legacy task contracts separately; do not bundle that cleanup into this behavior change.

## 2026-06-10: Show Parked Deferred Tasks in Status

- Task contract: `.agentloop/tasks/archive/2026-06-10-show-deferred-tasks-in-status.md`
- Trigger:
  - After the active task folder cleanup, only deferred task contracts remained.
  - `agentloop status` correctly refused to pick deferred work as `latestTask`, but the next-action reason still said no task contract was found.
- Implementation:
  - Added `deferredTasks` to `agentloop status --json`.
  - Added `deferredTasks` to `agentloop next --json`.
  - Added Markdown lines that show parked deferred tasks separately from active and latest open work.
  - Updated README, status docs, MCP docs, generated harness templates, and repo guidance.
- Verification run:
  - `.agentloop/reports/2026-06-10-22-30-verification-report.md`, overall status pass.
  - Red focused tests failed before implementation for missing `deferredTasks` in `status` and `next`.
  - Focused status and next tests passed after implementation.
  - Full Vitest passed: 33 files, 160 tests.
  - Lint, typecheck, build, Markdown link check, `projscan doctor`, `git diff --check`, and built CLI `status`/`next` smoke checks passed.
  - `projscan doctor` remained A 97/100 with the known informational unused-export note in `scripts/smoke-packed-release.mjs`.
- Handoff:
  - `.agentloop/handoffs/2026-06-10-22-30-pr-summary.md`
- What worked well:
  - The status output now tells the truth: deferred work exists, but it is parked.
  - The next action stays simple and still points at `agentloop create-task` when no open task is ready.
- Improve:
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-10: Add AgentLoopKit npm-status Self Check

- Task contract: `.agentloop/tasks/archive/2026-06-10-add-agentloopkit-npm-status-self-check.md`
- Trigger:
  - A release smoke run from a temp folder checked the temp package name `agentloopkit-release` instead of the published `agentloopkit` package.
  - The root cause was `npm-status` reading the current folder `package.json` by default.
- Implementation:
  - Added `agentloop npm-status --agentloopkit`.
  - In that mode, AgentLoopKit checks the published `agentloopkit` package and compares it with the running CLI package version.
  - Kept the existing local-package default for general package checks.
  - Updated README, npm-status docs, and changelog.
- Verification run:
  - `.agentloop/reports/2026-06-10-22-39-verification-report.md`, overall status pass.
  - Red focused tests failed before implementation for missing core and CLI `--agentloopkit` support.
  - Focused npm-status tests passed after implementation.
  - Full Vitest passed: 33 files, 162 tests.
  - Lint, typecheck, build, Markdown link check, `projscan doctor`, and a temp-folder built CLI smoke check passed.
  - `projscan doctor` remained A 97/100 with the known informational unused-export note in `scripts/smoke-packed-release.mjs`.
- Handoff:
  - `.agentloop/handoffs/2026-06-10-22-39-pr-summary.md`
- What worked well:
  - The new flag fixes the exact release-smoke failure without changing the default behavior for other packages.
- Improve:
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-10: Propagate npm-status Self Check Guidance

- Task contract: `.agentloop/tasks/archive/2026-06-10-propagate-npm-status-self-check-guidance.md`
- Trigger:
  - After adding `agentloop npm-status --agentloopkit`, generated harness guidance and release docs still mostly described local-package checks.
  - Future release smoke work could repeat the temp-folder package-name mistake.
- Implementation:
  - Updated repo harness commands and generated harness command templates.
  - Updated generated `.agentloop/README.md` template release-smoke examples.
  - Updated forward-looking release docs to use `agentloop npm-status --agentloopkit --expect-current` for AgentLoopKit publish proof.
  - Left historical release records intact.
- Verification run:
  - `.agentloop/reports/2026-06-10-22-46-verification-report.md`, overall status pass.
  - Markdown link check passed: 661 files.
  - Focused init and template-renderer tests passed: 2 files, 13 tests.
  - Full AgentLoop verification passed with configured Vitest, lint, typecheck, build, and format commands.
  - `projscan doctor` remained A 97/100 with the known informational unused-export note in `scripts/smoke-packed-release.mjs`.
- Handoff:
  - `.agentloop/handoffs/2026-06-10-22-46-pr-summary.md`
- What worked well:
  - The docs now describe the exact release smoke mode without changing runtime behavior.
- Improve:
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-10: Make Release Smoke Helper Usage Explicit

- Task contract: `.agentloop/tasks/archive/2026-06-10-make-release-smoke-helper-usage-explicit.md`
- Trigger:
  - `projscan doctor` reported the named exports in `scripts/smoke-packed-release.mjs` as unused.
  - The helpers were covered by tests, but the tests accessed them through a dynamic import object that static analysis could not see.
- Implementation:
  - Changed `tests/release-smoke.test.ts` to use a static namespace import from the smoke script.
  - Removed the unused `packageName` option from the helper test input.
  - Kept the smoke script runtime behavior unchanged.
  - Added an unreleased changelog note.
- Verification run:
  - `.agentloop/reports/2026-06-10-22-55-verification-report.md`, overall status pass.
  - Focused release-smoke tests passed.
  - Full Vitest passed: 33 files, 162 tests.
  - Lint, typecheck, build, Markdown link check, Prettier check for the touched test, and `projscan doctor` passed.
  - `projscan doctor` now reports A 100/100 with no issues detected.
- Handoff:
  - `.agentloop/handoffs/2026-06-10-22-56-pr-summary.md`
- What worked well:
  - The cleanup improved dogfood signal without changing release-smoke behavior.
- Improve:
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-10: Improve Init Output Context

- Task contract: `.agentloop/tasks/archive/2026-06-10-improve-init-output-context.md`
- Trigger:
  - `agentloop init` showed counts but not the target folder or detected project context.
  - Users need that context when they accidentally run `npx agentloopkit init` from the wrong directory.
- Implementation:
  - Added `targetDirectory`, detected `project`, and command `configured`/`missing` arrays to `InitResult`.
  - Updated human `init` output to print target folder, project type, package manager, command summary, file counts, and dry-run no-write wording.
  - Updated README, getting-started docs, changelog, and init tests.
- Verification run:
  - `.agentloop/reports/2026-06-10-23-05-verification-report.md`, overall status pass.
  - Red focused init tests failed before implementation for missing metadata.
  - Focused init tests passed after implementation: 12 tests.
  - Full Vitest passed: 33 files, 163 tests.
  - Lint, typecheck, build, Markdown link check, `projscan doctor`, and built CLI dry-run smoke passed.
  - Built CLI dry-run smoke wrote no AgentLoop files in the temp repo; only `package.json` existed afterward.
- Handoff:
  - `.agentloop/handoffs/2026-06-10-23-06-pr-summary.md`
- What worked well:
  - The change reused project detection data `init` already computed.
  - The output now answers the first-run question: which folder did AgentLoopKit inspect?
- Improve:
  - Consider adding a human-output fixture test if init formatting changes again.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-10: Investigate macOS Metadata Files

- Task contract: `.agentloop/tasks/archive/2026-06-10-remove-tracked-macos-metadata-files.md`
- Trigger:
  - A workspace scan showed `docs/.DS_Store` and `docs/assets/.DS_Store` on disk.
  - The initial concern was that macOS Finder metadata had entered tracked source.
- Investigation:
  - `git ls-files "*DS_Store"` returned no tracked files.
  - `.gitignore` already includes `.DS_Store`.
  - No product change was warranted.
- Verification run:
  - No test or build run was needed because the hypothesis was disproven before implementation.
- Handoff:
  - Investigation archived in the task contract.
- What worked well:
  - The check caught a false-positive assumption before code changed.
- Improve:
  - Confirm `git ls-files` before treating ignored local files as repo hygiene defects.

## 2026-06-10: Show Git Context During Init

- Task contract: `.agentloop/tasks/archive/2026-06-10-show-git-context-during-init.md`
- Trigger:
  - AgentLoopKit is repo-level, but `init` did not tell users whether the target folder was inside a Git work tree.
  - This matters when someone runs `npx agentloopkit init` from a random folder.
- Implementation:
  - Added a `git.isRepository` field to `InitResult`.
  - Added `Git: detected` or `Git: not detected` to human init output.
  - Kept non-Git initialization allowed.
  - Kept `init --local-only` requiring Git.
  - Updated README, getting-started docs, changelog, and init tests.
- Verification run:
  - `.agentloop/reports/2026-06-10-23-14-verification-report.md`, overall status pass.
  - Red focused init tests failed before implementation for missing Git context.
  - Focused init tests passed after implementation: 13 tests.
  - Full Vitest passed: 33 files, 164 tests.
  - Lint, typecheck, build, Markdown link check, `projscan doctor`, and built CLI Git/non-Git dry-run smoke passed.
- Handoff:
  - `.agentloop/handoffs/2026-06-10-23-16-pr-summary.md`
- What worked well:
  - The change reused the existing Git helper and stayed read-only.
  - The first-run output now shows whether the target is a repository without blocking non-Git demos.
- Improve:
  - Consider grouping first-run context lines if more init context is added later.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-10: Cover Missing Git Executable Behavior

- Task contract: `.agentloop/tasks/archive/2026-06-10-handle-missing-git-executable-safely.md`
- Trigger:
  - After adding Git context to `init`, I checked whether a missing `git` executable could crash first-run commands.
- Investigation:
  - A direct `execa('git', ..., { reject: false })` check with an empty `PATH` returned a failed result object, not a thrown error.
  - The existing Git helpers already degrade to `false` or empty output when `git` is unavailable.
- Implementation:
  - Added `tests/git.test.ts` to cover missing executable behavior for shared Git helpers.
  - Added init coverage for dry-run behavior with `git` missing from `PATH`.
  - Added an unreleased changelog note.
- Verification run:
  - Focused Git/init tests passed: 2 files, 16 tests.
  - `.agentloop/reports/2026-06-10-23-22-verification-report.md`, overall status pass.
  - Full Vitest passed: 34 files, 167 tests.
  - Lint, typecheck, build, Markdown link check, and `projscan doctor` passed.
- Handoff:
  - `.agentloop/handoffs/2026-06-10-23-23-pr-summary.md`
- What worked well:
  - The investigation avoided an unnecessary source change.
- Improve:
  - Keep the regression test because this is easy to break if Git helpers are refactored.

## 2026-06-10: Show Git Root During Init

- Task contract: `.agentloop/tasks/archive/2026-06-10-show-git-root-during-init.md`
- Trigger:
  - `agentloop init` showed whether Git was detected but not whether the current folder was the Git root.
  - Users running `init` from a nested package need to know that AgentLoopKit writes files into the current directory, not the repository root.
- Implementation:
  - Added `getGitRoot()` to shared Git helpers.
  - Added `git.root` and `git.targetIsRoot` to `InitResult` and JSON output.
  - Added `Git root:` and `Git target:` lines to human init output when Git is detected.
  - Updated README, getting-started docs, changelog, and tests.
- Verification run:
  - `.agentloop/reports/2026-06-10-23-31-verification-report.md`, overall status pass.
  - Red focused Git/init tests failed before implementation for missing root helper and metadata.
  - Focused Git/init tests passed after implementation: 2 files, 18 tests.
  - Full Vitest passed: 34 files, 169 tests.
  - Lint, typecheck, build, Markdown link check, `projscan doctor`, and built CLI nested-package dry-run smoke passed.
- Handoff:
  - `.agentloop/handoffs/2026-06-10-23-35-pr-summary.md`
- What worked well:
  - The feature improves first-run safety without changing where files are written.
- Improve:
  - Consider adding a warning style later if users often initialize subdirectories by mistake.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-10: Warn When Init Targets a Git Subdirectory

- Task contract: `.agentloop/tasks/archive/2026-06-10-warn-when-init-targets-a-git-subdirectory.md`
- Trigger:
  - After `agentloop init` gained Git-root context, nested-package users could see `Git target: subdirectory` but still had to infer where files would be written.
- Implementation:
  - Added a human warning when `git.targetIsRoot` is false.
  - Kept JSON output unchanged and continued using `git.targetIsRoot` for machine consumers.
  - Updated README, getting-started docs, changelog, and init tests.
- Verification run:
  - `.agentloop/reports/2026-06-10-23-43-verification-report.md`, overall status pass.
  - Focused init test failed before implementation because the warning was missing.
  - Focused init tests passed after implementation: 1 file, 17 tests.
  - Full Vitest passed: 34 files, 170 tests.
  - Lint, typecheck, build, Markdown link check, `projscan doctor`, and built CLI nested-package dry-run smoke passed.
- Handoff:
  - `.agentloop/handoffs/2026-06-10-23-44-pr-summary.md`
- What worked well:
  - The warning makes accidental nested initialization clearer without changing write targets or adding prompts.
- Improve:
  - Watch for repeated confusion around subdirectory initialization before adding stronger warnings or confirmation flows.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-10: Show Git Target Context in Doctor

- Task contract: `.agentloop/tasks/archive/2026-06-10-show-git-target-context-in-doctor.md`
- Trigger:
  - `agentloop init` explained Git root and subdirectory targets, but `agentloop doctor` did not repeat that context after setup.
- Implementation:
  - Added structured `git.isRepository`, `git.root`, and `git.targetIsRoot` fields to doctor results.
  - Added human doctor checks for Git root, Git target, and a subdirectory target warning.
  - Updated README, getting-started docs, changelog, backlog, and doctor tests.
- Verification run:
  - `.agentloop/reports/2026-06-10-23-52-verification-report.md`, overall status pass.
  - Focused doctor tests failed before implementation because `result.git` and human Git target rows were missing.
  - Focused doctor tests passed after implementation: 1 file, 8 tests.
  - Full Vitest passed: 34 files, 172 tests.
  - Lint, typecheck, build, Markdown link check, `projscan doctor`, and built CLI nested-package doctor smoke passed.
- Handoff:
  - `.agentloop/handoffs/2026-06-10-23-53-pr-summary.md`
- What worked well:
  - The same Git target context now appears during setup and post-setup health checks.
- Improve:
  - Keep subdirectory handling warning-only until real user confusion justifies confirmation prompts.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-11: Show Git Target Context in Status

- Task contract: `.agentloop/tasks/archive/2026-06-10-show-git-target-context-in-status.md`
- Trigger:
  - Agents use `agentloop status` before work, but it only showed Git branch and commit after `init` and `doctor` gained Git target context.
- Implementation:
  - Added `git.root` and `git.targetIsRoot` to status JSON output.
  - Added Git root, Git target, and subdirectory warning lines to status Markdown output.
  - Updated README, status docs, changelog, backlog, and status tests.
- Verification run:
  - `.agentloop/reports/2026-06-11-00-04-verification-report.md`, overall status pass.
  - Focused status tests failed before implementation because Git root and target output were missing.
  - Focused status tests passed after implementation: 1 file, 11 tests.
  - Full Vitest passed: 34 files, 173 tests.
  - Lint, typecheck, build, Markdown link check, `projscan doctor`, and built CLI nested-package status smoke passed.
- Handoff:
  - `.agentloop/handoffs/2026-06-11-00-05-pr-summary.md`
- What worked well:
  - `init`, `doctor`, and `status` now tell the same story about Git root versus current target.
- Improve:
  - Keep `next` output terse; it should stay focused on one recommended command.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-11: Show Git Target Context in Check-Gates

- Task contract: `.agentloop/tasks/archive/2026-06-11-show-git-target-context-in-check-gates.md`
- Trigger:
  - `agentloop check-gates` is the review-readiness command, but it still lacked the Git root and target context already added to `init`, `doctor`, and `status`.
- Implementation:
  - Added `git.root` and `git.targetIsRoot` to check-gates JSON output.
  - Added Git root and Git target lines to check-gates Markdown output.
  - Added a warning gate when check-gates runs from a Git subdirectory.
  - Updated README, check-gates docs, changelog, backlog, and check-gates tests.
- Verification run:
  - `.agentloop/reports/2026-06-11-00-15-verification-report.md`, overall status pass.
  - Focused check-gates tests failed before implementation because Git root and target output were missing.
  - Focused check-gates tests passed after implementation: 1 file, 5 tests.
  - Full Vitest passed: 34 files, 174 tests.
  - Lint, typecheck, build, Markdown link check, `projscan doctor`, and built CLI nested-package check-gates smoke passed.
- Handoff:
  - `.agentloop/handoffs/2026-06-11-00-17-pr-summary.md`
- What worked well:
  - Review readiness now shows the same Git target context as setup and status commands.
- Improve:
  - Consider a shared formatter for Git target output if more commands need the same wording.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-11: Avoid Stale Pinned Versions in User-Facing Distribution Docs

- Task contract: `.agentloop/tasks/archive/2026-06-11-avoid-stale-pinned-versions-in-user-facing-distribution-docs.md`
- Trigger:
  - README, MCP, and distribution examples pinned `0.27.0` in normal user-facing commands, which would make docs look stale after the planned `0.28.0` batch.
- Implementation:
  - Replaced normal npm/npx examples with `@latest`.
  - Replaced maintainer pin examples with `<version>` placeholders.
  - Kept historical release evidence unchanged.
  - Updated the changelog and backlog.
- Verification run:
  - `.agentloop/reports/2026-06-11-00-22-verification-report.md`, overall status pass.
  - Full configured verification passed: Vitest 34 files and 174 tests, lint, typecheck, and build.
  - Manual docs checks passed: Markdown link check, `projscan doctor`, whitespace diff check, and stale-version/Homebrew scan across README, MCP docs, distribution docs, and AGENTS.
- Handoff:
  - `.agentloop/handoffs/2026-06-11-00-24-pr-summary.md`
- What worked well:
  - The public docs now avoid avoidable current-version drift while still showing where maintainers should pin.
- Improve:
  - `agentloop verify` did not automatically run verification commands listed in the task contract; treat that as the next bug-pass candidate.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-11: Run Task Verification Commands With Explicit Opt-In

- Task contract: `.agentloop/tasks/archive/2026-06-11-run-task-verification-commands-with-explicit-opt-in.md`
- Trigger:
  - Dogfooding showed that `agentloop verify --task` records task metadata but did not offer a safe way to run the task contract's own `Verification Commands` list.
- Implementation:
  - Added `agentloop verify --task-commands`.
  - Kept `--task` metadata-only by default so task Markdown does not execute unexpectedly.
  - Added safe parsing for commands under `## Verification Commands` only when the task path is a Markdown file inside the configured task directory.
  - Added core and CLI tests for default safety, opt-in execution, and outside-path refusal.
  - Updated README, verification docs, generated harness command guidance, changelog, and backlog.
- Verification run:
  - `.agentloop/reports/2026-06-11-00-32-verification-report.md`, overall status pass.
  - Red focused tests failed before implementation because task commands were not run and the CLI rejected `--task-commands`.
  - Full configured verification passed: Vitest 34 files and 178 tests, lint, typecheck, and build.
  - Task-command dogfood passed: focused verification tests 1 file and 18 tests, plus typecheck, both run from the task contract through `--task-commands`.
  - Markdown link check, `projscan doctor`, whitespace diff check, and CLI help smoke passed.
- Handoff:
  - `.agentloop/handoffs/2026-06-11-00-33-pr-summary.md`
- What worked well:
  - The explicit flag keeps command execution transparent while making task contracts directly actionable.
- Improve:
  - Consider showing a report note when `--task-commands` is used but no task commands are found.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-11: Report When Task Verification Commands Are Absent

- Task contract: `.agentloop/tasks/archive/2026-06-11-report-when-task-verification-commands-are-absent.md`
- Trigger:
  - After adding `--task-commands`, dogfooding showed that an explicit request with no runnable task commands could be ambiguous in the report.
- Implementation:
  - Added a `Task Commands` report note when `--task-commands` is requested but no runnable commands are found in a safe task contract.
  - Kept exit behavior unchanged.
  - Kept `--task` metadata-only by default.
  - Updated README, verification docs, changelog, backlog, and verification tests.
- Verification run:
  - `.agentloop/reports/2026-06-11-00-39-verification-report.md`, overall status pass.
  - Focused verification tests failed before implementation because the report note was missing.
  - Full configured verification passed: Vitest 34 files and 179 tests, lint, typecheck, and build.
  - Task-command dogfood passed: focused verification tests 1 file and 19 tests, plus typecheck, both run from the task contract through `--task-commands`.
  - Markdown link check, `projscan doctor`, whitespace diff check, and compiled CLI empty-task smoke passed.
- Handoff:
  - `.agentloop/handoffs/2026-06-11-00-42-pr-summary.md`
- What worked well:
  - The report now distinguishes "no commands selected" from "task commands were requested but the task contract did not provide any."
- Improve:
  - Consider a future JSON field for task-command discovery metadata if CI consumers need it.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-11: Expose Task Command Discovery Metadata in Verification JSON

- Task contract: `.agentloop/tasks/archive/2026-06-11-expose-task-command-discovery-metadata-in-verification-json.md`
- Trigger:
  - After adding the task-command empty-state note, CI consumers still had to parse Markdown to know whether `--task-commands` was requested and how many runnable task commands were discovered.
- Implementation:
  - Added `taskCommands.requested` and `taskCommands.foundCount` to verification JSON output.
  - Kept task Markdown content out of the metadata.
  - Kept command execution behavior unchanged.
  - Updated verification docs, changelog, backlog, and verification tests.
- Verification run:
  - `.agentloop/reports/2026-06-11-00-49-verification-report.md`, overall status pass.
  - Focused verification tests failed before implementation because `taskCommands` metadata was undefined.
  - Focused verification tests passed: 1 file and 19 tests.
  - Typecheck, build, Markdown link check, `projscan doctor`, whitespace diff check, and dogfood JSON metadata smoke passed.
  - Dogfood verified `taskCommands` as `{"requested":true,"foundCount":2}`.
- Handoff:
  - `.agentloop/handoffs/2026-06-11-00-50-pr-summary.md`
- What worked well:
  - CI consumers now get structured task-command discovery state without parsing Markdown or exposing task file contents.
- Improve:
  - Consider including `taskCommands.ranCount` only if a concrete consumer needs it; current command entries already expose executed task commands.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-11: Clean Public Docs Version Pins

- Task contract: `.agentloop/tasks/archive/2026-06-11-clean-public-docs-version-pins.md`
- Trigger:
  - Public CI examples and command starters still contained stale package pins such as `0.26.1`, `0.27.0`, and an old release-notes example.
  - Local `.DS_Store` files under docs were ignored and untracked but kept confusing hygiene scans.
- Implementation:
  - Changed normal CI install examples to `agentloopkit@latest`.
  - Changed composite-action and release-note examples to `<version>` placeholders.
  - Kept release-status, launch-checklist, and npm-publishing history intact as evidence records.
  - Removed local ignored `.DS_Store` files from the docs tree.
  - Updated backlog and unreleased changelog wording to include CI docs and examples.
- Verification run:
  - `.agentloop/reports/2026-06-11-00-56-verification-report.md`, overall status pass.
  - Full configured verification passed: Vitest 34 files and 179 tests, lint, typecheck, and build.
  - Task-command dogfood passed: Markdown link check, `projscan doctor`, and `git diff --check`.
- Handoff:
  - `.agentloop/handoffs/2026-06-11-00-58-pr-summary.md`
- What worked well:
  - `agentloop verify --task-commands` now runs the exact task contract checks and reports `taskCommands.requested` plus `foundCount`.
- Improve:
  - Future docs tasks should include `CHANGELOG.md` in likely files when user-facing release notes are expected.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-11: Guard Public Docs Against Stale Version Pins

- Task contract: `.agentloop/tasks/archive/2026-06-11-guard-public-docs-against-stale-version-pins.md`
- Trigger:
  - The stale-version cleanup was a one-time docs fix, but only packed README pins had automated coverage.
- Implementation:
  - Added public-doc pin helpers to the release-smoke script.
  - Added Vitest coverage for rejecting hardcoded `agentloopkit@x.y.z`, `AgentLoopKit@vx.y.z`, and release tarball pins in normal public docs and examples.
  - Kept release-history docs excluded so exact version evidence remains allowed.
  - Skipped generated `.agentloop` example artifacts after the first green attempt exposed that boundary.
  - Updated backlog and unreleased changelog.
- Verification run:
  - Red focused test failed first because the new helpers did not exist.
  - Focused test then failed on `examples/release-checklist/.agentloop/...`, proving the collector needed to skip generated evidence artifacts.
  - `.agentloop/reports/2026-06-11-01-03-verification-report.md`, overall status pass.
  - Full configured verification passed: Vitest 34 files and 182 tests, lint, typecheck, and build.
  - Task-command dogfood passed: focused release-smoke test, full Vitest, `projscan doctor`, and `git diff --check`.
- Handoff:
  - `.agentloop/handoffs/2026-06-11-01-04-pr-summary.md`
- What worked well:
  - The test found a real boundary case before the change was committed.
- Improve:
  - Consider moving public-doc hygiene checks into a dedicated docs-quality script if more checks accumulate.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-11: Support `test-generation` Task Type

- Task contract: `.agentloop/tasks/archive/2026-06-11-support-test-generation-task-type.md`
- Trigger:
  - Dogfooding attempted `create-task --type test-generation` because the repository ships `src/templates/loops/test-generation.md`.
  - The CLI did not accept that type and dropped into the interactive picker.
- Implementation:
  - Added `test-generation` to supported task types.
  - Added a non-interactive CLI regression test.
  - Documented supported task types in README, task-contract docs, and generated task README.
  - Updated backlog and unreleased changelog.
- Verification run:
  - Red focused test timed out because the unsupported type entered the prompts flow.
  - Focused create-task test passed after implementation.
  - An initial verification run accidentally targeted the previous archived task path and produced an unavailable task-context report; that report was deleted before commit.
  - `.agentloop/reports/2026-06-11-01-10-verification-report.md`, overall status pass.
  - Full configured verification passed: Vitest 34 files and 183 tests, lint, typecheck, and build.
  - Task-command dogfood passed: focused create-task test, full Vitest, Markdown link check, `projscan doctor`, and `git diff --check`.
- Handoff:
  - `.agentloop/handoffs/2026-06-11-01-11-pr-summary.md`
- What worked well:
  - The fixed CLI created this task contract with `--type test-generation`, so the dogfood path directly exercised the change.
- Improve:
  - Consider a friendlier non-interactive error for unsupported `--type` values instead of falling into prompts when title is present.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-11: Fail Fast for Unsupported Task Type

- Task contract: `.agentloop/tasks/archive/2026-06-11-fail-fast-for-unsupported-task-type.md`
- Trigger:
  - The `test-generation` task-type fix showed that typos in `create-task --type` could hang non-interactive sessions by entering prompts.
- Implementation:
  - Added explicit unsupported-type validation before interactive collection.
  - Reused the normal CLI error path so users see `agentloop: Unsupported task type ...` and exit code 1.
  - Added a CLI regression test that verifies the command exits without timing out, prints supported values, and writes no task file.
  - Updated backlog and unreleased changelog.
- Verification run:
  - Red focused test failed because the old behavior timed out.
  - First full AgentLoop verification failed because the test timeout was too tight for full-suite `tsx` startup; the timeout guard was raised from 1s to 5s while keeping the no-hang assertion.
  - `.agentloop/reports/2026-06-11-01-17-verification-report.md`, overall status pass.
  - Full configured verification passed: Vitest 34 files and 184 tests, lint, typecheck, and build.
  - Task-command dogfood passed: focused create-task test, full Vitest, `projscan doctor`, and `git diff --check`.
- Handoff:
  - `.agentloop/handoffs/2026-06-11-01-18-pr-summary.md`
- What worked well:
  - The regression test now protects non-interactive agent sessions from prompt hangs caused by task-type typos.
- Improve:
  - Consider adding machine-readable JSON error output for CLI validation failures if CI users ask for it.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-11: Show Supported Task Types in Help

- Task contract: `.agentloop/tasks/archive/2026-06-11-document-create-task-supported-types-in-help.md`
- Trigger:
  - After adding `test-generation` and fail-fast validation, users could learn supported task types from an error but not from `agentloop create-task --help`.
- Implementation:
  - Added a supported task type section to `create-task --help`, generated from the shared `TASK_TYPES` list.
  - Added a CLI help-output regression test.
  - Updated the unreleased changelog.
- Verification run:
  - Red focused test failed because the old help output only said `task type`.
  - Focused create-task test passed after implementation.
  - Included in `.agentloop/reports/2026-06-11-01-27-verification-report.md`, overall status pass.
- What worked well:
  - The help output now teaches valid values before users hit validation errors.
- Improve:
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-11: Align Release Smoke with Evergreen README

- Task contract: `.agentloop/tasks/archive/2026-06-11-align-release-smoke-with-unpinned-readme-policy.md`
- Trigger:
  - `npm run smoke:release` still required the packed README to contain the exact package version, but public docs now intentionally avoid exact pins.
- Implementation:
  - Changed the packed README smoke helper to allow unpinned README examples while still rejecting stale exact version pins.
  - Added regression coverage for unpinned README content.
  - Updated maintainer release docs to describe stale-pin detection instead of current-version pin matching.
  - Updated the unreleased changelog.
- Verification run:
  - Red focused release-smoke test failed with `README does not contain pinned version 0.24.4`.
  - Focused release-smoke test passed after implementation.
  - `npm run smoke:release` passed and reported `README has no stale exact version pins`.
  - `.agentloop/reports/2026-06-11-01-26-verification-report.md` intentionally failed because `node scripts/prepublish-check.mjs` blocks unreleased changelog entries before npm publishing.
  - `.agentloop/reports/2026-06-11-01-27-verification-report.md`, overall status pass, excluded the release-only prepublish guard because no version is being cut now.
  - Final focused checks passed: `npm test -- create-task release-smoke`, `npm run check:links`, and `git diff --check`.
- What worked well:
  - The smoke gate now matches the public-doc policy and remains useful before the batched `0.28.0` release.
- Improve:
  - Run `node scripts/prepublish-check.mjs` only during explicit release prep, after moving unreleased changelog entries into the target version section.

## 2026-06-11: JSON Error for Unsupported Task Type

- Task contract: `.agentloop/tasks/archive/2026-06-11-return-json-for-unsupported-create-task-type.md`
- Trigger:
  - `create-task --json` returned machine-readable success output, but unsupported task-type validation still used the human stderr path.
- Implementation:
  - Added a JSON error payload for unsupported `create-task --type` values when `--json` is requested.
  - Kept the default human stderr behavior unchanged.
  - Added a CLI regression test for exit code, stdout JSON shape, empty stderr, supported task types, and no task-file write.
  - Documented the behavior in the README, task-contract docs, generated task README, and unreleased changelog.
- Verification run:
  - Red focused test failed because the old command printed `agentloop: Unsupported task type ...` to stderr.
  - Focused create-task suite passed after implementation: 8 tests.
  - Full local verification passed: lint, typecheck, Vitest 34 files and 187 tests, build, Markdown link check, `git diff --check`, and `projscan doctor`.
  - Built CLI smoke check returned parseable JSON with `UNSUPPORTED_TASK_TYPE` and did not write `.agentloop/tasks/typo-json-smoke.md`.
  - `.agentloop/reports/2026-06-11-01-35-verification-report.md`, overall status pass.
- What worked well:
  - The JSON error path now gives coding agents enough structure to recover without parsing prose.
- Improve:
  - Consider a shared JSON error helper for more commands if automation users need consistent machine-readable failures.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-11: Complete `create-task --type` Shell Completions

- Task contract: `.agentloop/tasks/archive/2026-06-11-complete-create-task-task-type-completions.md`
- Trigger:
  - Completion scripts suggested task statuses and agent names but did not suggest supported `create-task --type` values.
- Implementation:
  - Added bash, zsh, fish, and PowerShell completion output for task types from the shared `TASK_TYPES` list.
  - Added regression coverage that checks generated scripts include `test-generation`, `migration`, and the other supported values.
  - Updated the README shell-completion section and unreleased changelog.
- Verification run:
  - Red focused completion tests failed in all four shell renderers.
  - First implementation exposed a zsh template-literal escaping bug, fixed before the focused suite passed.
  - Focused completion suite passed: 9 tests.
  - Built CLI smoke output showed task-type values in zsh, bash, fish, and PowerShell completion scripts.
  - `.agentloop/reports/2026-06-11-01-46-verification-report.md`, overall status pass.
- What worked well:
  - The completion values now come from the same constants as `create-task` validation and help output.
- Improve:
  - Keep shell completions static and inspectable. Do not edit user shell profile files from the CLI.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-11: JSON Output for `list-templates`

- Task contract: `.agentloop/tasks/archive/2026-06-11-add-json-output-to-list-templates.md`
- Trigger:
  - `agentloop list-templates` helps agents inspect bundled templates, but the command only printed grouped human text.
- Implementation:
  - Added `agentloop list-templates --json` with a stable `{ templates }` payload.
  - Preserved the existing grouped human output by default.
  - Added CLI regression tests for human and JSON output.
  - Updated the README and unreleased changelog.
- Verification run:
  - Red focused test failed because `--json` was an unknown option.
  - Focused list-templates suite passed after implementation.
  - Built CLI smoke check returned grouped template JSON with agents, gates, handoffs, harness, loops, policies, root, and tasks.
  - `.agentloop/reports/2026-06-11-01-51-verification-report.md`, overall status pass.
- What worked well:
  - The existing template renderer already returned the right grouped data, so the CLI change stayed small.
- Improve:
  - Keep future discovery commands available in JSON form when agents are likely consumers.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-11: JSON Output for `version`

- Task contract: `.agentloop/tasks/archive/2026-06-11-add-json-output-to-version-command.md`
- Trigger:
  - `agentloop version` is useful in scripts, but it only printed the raw version string.
- Implementation:
  - Added `agentloop version --json` with a stable `{ version }` payload.
  - Preserved the default plain version string and top-level `-V` behavior.
  - Added CLI regression coverage and documented the new JSON output.
- Verification run:
  - Red focused test failed because `--json` was an unknown option.
  - Focused version suite passed after implementation.
  - Built CLI smoke check returned `{ "version": "0.27.0" }`.
  - `.agentloop/reports/2026-06-11-01-57-verification-report.md`, overall status pass.
- What worked well:
  - The command already had a single source for package version, so the JSON form stayed tiny.
- Improve:
  - Keep raw string output as the default for existing scripts.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-11: JSON Output for `install-agent`

- Task contract: `.agentloop/tasks/archive/2026-06-11-add-json-output-to-install-agent.md`
- Trigger:
  - `agentloop install-agent` writes useful setup files but only reported human text, forcing agents to parse output.
- Implementation:
  - Added `install-agent <agent> --json` with the installed agent name, agent instruction path, and `AGENTS.md` path.
  - Added `install-agent all --json` with one entry per bundled agent.
  - Kept generated file contents and default human output unchanged.
  - Added CLI regression tests for single-agent and all-agent JSON output.
- Verification run:
  - Red focused tests failed because `--json` was an unknown option.
  - First green attempt exposed macOS temp-path realpath differences; tests now compare against `realpath(dir)`.
  - Focused agent-installation suite passed: 4 tests.
  - `.agentloop/reports/2026-06-11-02-03-verification-report.md`, overall status pass.
- What worked well:
  - The CLI wrapper could shape JSON without changing the core file-writing functions.
- Improve:
  - Consider a shared JSON error shape for unsupported agent names if automation users need it.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-11: JSON Error Output for `install-agent`

- Task contract: `.agentloop/tasks/archive/2026-06-11-add-json-error-output-for-unsupported-install-agent-agents.md`
- Trigger:
  - `install-agent --json` had machine-readable success output, but unsupported agent names still returned human-only stderr.
- Implementation:
  - Added a JSON error payload for unsupported `install-agent <agent> --json` values.
  - Included `code`, `message`, `requestedAgent`, and `supportedAgents`.
  - Kept default unsupported-agent output human-readable.
  - Added regression coverage for JSON and default error paths.
- Verification run:
  - Red focused test failed because the command printed the human error to stderr.
  - Focused agent-installation suite passed: 6 tests.
  - `.agentloop/reports/2026-06-11-02-11-verification-report.md`, overall status pass.
- What worked well:
  - Mirroring the `create-task --json` error shape gave agents a predictable failure contract.
- Improve:
  - `summarize` uses `--report`; I first tried `--verification`. Consider adding an alias if this confusion repeats.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-11: `--verification` Alias for `summarize` and `handoff`

- Task contract: `.agentloop/tasks/archive/2026-06-11-add-verification-alias-for-summarize-and-handoff.md`
- Trigger:
  - During dogfooding, I tried `summarize --verification <report>` even though the command only accepted `--report`.
- Implementation:
  - Added `--verification <path>` as an alias for `--report <path>` on `summarize` and `handoff`.
  - Kept `--report` supported and preferred.
  - Added CLI coverage for both commands using a non-latest manual verification report path.
- Verification run:
  - Red focused tests failed because Commander rejected `--verification`.
  - First green run showed the test fixture used a status value outside the existing parser pattern; the fixture now uses `custom-pass`.
  - Focused handoff suite passed: 5 tests.
  - `.agentloop/reports/2026-06-11-02-17-verification-report.md`, overall status pass.
- What worked well:
  - The new alias immediately worked for this handoff generation.
- Improve:
  - Keep `--report` as the canonical documented term where possible so the CLI stays compact.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-11: `--verification` Alias for `report`

- Task contract: `.agentloop/tasks/archive/2026-06-11-add-verification-alias-for-report-command.md`
- Trigger:
  - After adding `--verification` to `summarize` and `handoff`, `agentloop report` still accepted only `--report` for explicit verification evidence.
- Implementation:
  - Added `--verification <path>` as an alias for `--report <path>` on `agentloop report`.
  - Kept `--report` supported and preferred.
  - Added CLI coverage that selects a non-latest manual verification report and checks the resulting metadata, source path, and HTML content.
- Verification run:
  - Red focused test failed because Commander rejected `--verification`.
  - First green run showed explicit report source paths preserve the supplied relative path; the assertion now matches existing behavior.
  - Focused HTML report suite passed: 4 tests.
  - `.agentloop/reports/2026-06-11-02-23-verification-report.md`, overall status pass.
- What worked well:
  - The alias kept the report command consistent with handoff generation and did not change HTML output structure.
- Improve:
  - Avoid adding aliases broadly unless they remove a real workflow mistake.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-11: GitHub Action Default Package Version

- Task contract: `.agentloop/tasks/archive/2026-06-11-use-latest-as-the-github-action-default-package-version.md`
- Trigger:
  - The root composite action defaulted `agentloopkit-version` to `0.27.0`, which would go stale while unreleased `0.28.0` batch work continues.
- Implementation:
  - Changed the action default to `latest`.
  - Kept the `agentloopkit-version` input so teams can pin a reviewed package version.
  - Added distribution artifact coverage that rejects exact semver defaults in `action.yml`.
  - Updated GitHub Action docs and examples with concise pinning guidance.
- Verification run:
  - Red focused test failed because `action.yml` still contained `default: '0.27.0'`.
  - Focused distribution artifact suite passed: 4 tests.
  - `.agentloop/reports/2026-06-11-02-31-verification-report.md`, overall status pass.
- What worked well:
  - The change removes release-day action.yml churn without changing the action execution model.
- Improve:
  - Keep release-tag examples pinned with `<version>` where reproducibility matters.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-11: GitHub Action Command Input Safety

- Task contract: `.agentloop/tasks/archive/2026-06-11-document-github-action-command-input-safety.md`
- Trigger:
  - The composite GitHub Action passes `command` into a shell command, so workflow authors need a clear trust-boundary warning.
- Implementation:
  - Added the warning to `action.yml`.
  - Added the same guidance to the GitHub Actions docs and example workflow README.
  - Added distribution artifact coverage so the warning stays in action metadata and public CI docs.
- Verification run:
  - Red focused test failed because the warning was absent from `action.yml`.
  - Focused distribution artifact suite passed: 5 tests.
  - `.agentloop/reports/2026-06-11-02-38-verification-report.md`, overall status pass.
- What worked well:
  - The change keeps the action lightweight while making the trust boundary visible where users copy workflow snippets.
- Improve:
  - If teams ask for stronger protection later, consider a safer structured command mode instead of free-form command text.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-11: GitHub Action Package Version Input Hardening

- Task contract: `.agentloop/tasks/archive/2026-06-11-harden-github-action-package-version-input.md`
- Trigger:
  - The composite action embedded `agentloopkit-version` directly in an npm install shell command.
- Implementation:
  - Changed the install step to pass `agentloopkit-version` through `AGENTLOOPKIT_VERSION`.
  - Added action metadata and docs warnings that `agentloopkit-version` must stay static and trusted.
  - Added distribution artifact coverage for the safer install shape and docs warning.
- Verification run:
  - Red focused tests failed because the action still embedded `${{ inputs.agentloopkit-version }}` in the npm command and lacked the warning.
  - Focused distribution artifact suite passed: 7 tests.
  - `.agentloop/reports/2026-06-11-02-44-verification-report.md`, overall status pass.
- What worked well:
  - The action kept the same public input while removing one direct shell interpolation point.
- Improve:
  - The `command` input remains free-form by design; keep documenting it as static trusted workflow configuration.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-11: Verification JSON Task Command Details

- Task contract: `.agentloop/tasks/archive/2026-06-11-expose-task-command-details-in-verify-json.md`
- Trigger:
  - `agentloop verify --task-commands --json` exposed whether task commands were requested and how many were found, but not the selected command strings.
- Implementation:
  - Added `taskCommands.commands` to the verification result.
  - Kept task command execution opt-in through `--task-commands`.
  - Added core and CLI tests for populated and empty task command lists.
  - Documented the JSON field in README and verification report docs.
- Verification run:
  - Red focused verification tests failed because `taskCommands.commands` was absent.
  - Focused verification suite passed: 19 tests.
  - `.agentloop/reports/2026-06-11-02-50-verification-report.md`, overall status pass.
- What worked well:
  - The data already existed during command selection, so the change did not alter execution behavior.
- Improve:
  - Keep task-defined command execution explicit and reviewed; do not make task Markdown executable by default.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-11: 0.28.0 Batch Release Policy

- Task contract: `.agentloop/tasks/archive/2026-06-11-document-0-28-0-batch-release-policy.md`
- Trigger:
  - The maintainer asked to stop cutting a new version for every small improvement and batch current work into `0.28.0`.
- Implementation:
  - Added the no-version-spam rule to `AGENTS.md` and `AGENTLOOP.md`.
  - Updated release status, npm publishing docs, roadmap, and changelog.
  - Kept README free of internal release-process notes.
- Verification run:
  - Confirmed README has no `0.28.0` or internal release-cadence text.
  - `.agentloop/reports/2026-06-11-02-56-verification-report.md`, overall status pass.
- What worked well:
  - Putting the rule in `AGENTS.md` gives future coding-agent sessions the instruction before release tooling is touched.
- Improve:
  - When the maintainer asks for release prep, move Unreleased notes into `0.28.0`, bump package metadata once, and use trusted publishing.

## 2026-06-11: JSON Error Output for Unsupported Task Status

- Task contract: `.agentloop/tasks/archive/2026-06-11-add-json-error-output-for-unsupported-task-status.md`
- Trigger:
  - `agentloop task status --json` had structured success output, but unsupported status values still used the global human error path.
- Implementation:
  - Added an `UNSUPPORTED_TASK_STATUS` error code in task-state parsing.
  - Added a JSON error response for `agentloop task status <path> <status> --json`.
  - Kept the default non-JSON error on stderr.
  - Documented the behavior in README and task-contract docs.
- Verification run:
  - Red focused task-state test failed because the command printed the human error to stderr.
  - Focused task-state suite passed: 21 tests.
  - `.agentloop/reports/2026-06-11-03-04-verification-report.md`, overall status pass.
- What worked well:
  - The change keeps agents from parsing human error text and does not alter task Markdown behavior.
- Improve:
  - Consider the same JSON-error treatment for other task subcommands only where automation actually needs it.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-11: JSON Error Output for Unsupported Badge Source

- Task contract: `.agentloop/tasks/archive/2026-06-11-add-json-error-output-for-unsupported-badge-source.md`
- Trigger:
  - `agentloop badge --json` returned structured success output, but unsupported `--source` values still used the global human error path.
- Implementation:
  - Added `UNSUPPORTED_BADGE_SOURCE` to badge source parsing.
  - Added a JSON error response for `agentloop badge --source <source> --json`.
  - Kept default non-JSON errors human-readable on stderr.
  - Documented the behavior in README, badge docs, and the changelog.
- Verification run:
  - Red focused badge test failed because the command printed the human error to stderr.
  - Focused badge suite passed: 5 tests.
  - `.agentloop/reports/2026-06-11-03-13-verification-report.md`, overall status pass.
- What worked well:
  - The command now gives agents and CI the supported source list without changing badge generation.
- Improve:
  - Keep applying structured JSON errors command-by-command where automation has a concrete parsing need.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-11: JSON Error Output for Missing Policy Names

- Task contract: `.agentloop/tasks/archive/2026-06-11-add-json-error-output-for-missing-policy-names.md`
- Trigger:
  - `agentloop policy show --json` returned structured success output, but missing policy names still used the global human error path.
- Implementation:
  - Added a `POLICY_NOT_FOUND` error with the requested policy and available policy names.
  - Added a JSON error response for `agentloop policy show <policy> --json`.
  - Kept default missing-policy errors human-readable on stderr.
  - Documented the behavior in README, policy docs, and the changelog.
- Verification run:
  - Red focused policy test failed because the command printed the human error to stderr.
  - Focused policy suite passed: 8 tests.
  - `.agentloop/reports/2026-06-11-03-19-verification-report.md`, overall status pass.
- What worked well:
  - The command now tells agents which local policy names exist without changing policy lookup behavior.
- Improve:
  - Consider shared JSON-error helpers only if duplication starts making command modules harder to maintain.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-11: JSON Error Output for Missing Policy Directory

- Task contract: `.agentloop/tasks/archive/2026-06-11-add-json-error-output-for-missing-policy-directory.md`
- Trigger:
  - `agentloop policy list/status/show --json` had structured success output, but missing `.agentloop/policies/` setup errors still used the global human error path.
- Implementation:
  - Added a `POLICY_DIRECTORY_MISSING` setup error with `policiesDir` and `nextCommand`.
  - Added JSON setup-error handling for `policy list`, `policy status`, and `policy show`.
  - Kept default setup errors human-readable on stderr.
  - Documented the behavior in README, policy docs, and the changelog.
- Verification run:
  - Red focused policy tests failed because `policy list --json` and `policy status --json` printed the human error to stderr.
  - Focused policy suite passed: 11 tests.
  - `.agentloop/reports/2026-06-11-03-25-verification-report.md`, overall status pass.
- What worked well:
  - The command now gives agents the setup fix without auto-running `init` or mutating files.
- Improve:
  - Keep setup errors explicit and local; do not let read-only commands repair missing generated files.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-11: JSON Error Output for Invalid Task Paths

- Task contract: `.agentloop/tasks/archive/2026-06-11-add-json-error-output-for-invalid-task-paths.md`
- Trigger:
  - `agentloop task show/set/status/archive --json` returned structured success output, but invalid task paths still used the global human error path.
- Implementation:
  - Added a `TaskPathError` carrying `requestedTask`, `tasksDir`, and `reason`.
  - Added JSON error handling for missing, outside-directory, and non-Markdown task paths.
  - Kept default invalid-path errors human-readable on stderr.
  - Documented the behavior in README, task-contract docs, and the changelog.
- Verification run:
  - Red focused task-state tests failed because invalid path commands printed human errors to stderr.
  - Focused task-state suite passed: 25 tests.
  - `.agentloop/reports/2026-06-11-03-33-verification-report.md`, overall status pass.
- What worked well:
  - The structured error gives agents a recovery reason without loosening task path safety.
- Improve:
  - Consider clearer human wording for outside-root and non-Markdown paths in a separate compatibility-aware change.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-11: JSON Error Output for Invalid Create-Task Output Paths

- Task contract: `.agentloop/tasks/archive/2026-06-11-add-json-error-output-for-invalid-create-task-output-paths.md`
- Trigger:
  - `agentloop create-task --json` returned structured success output, but invalid `--out` paths still used the global human error path.
- Implementation:
  - Added a `TaskOutputPathError` carrying `requestedOut`, `tasksDir`, and `reason`.
  - Added JSON error handling for outside-directory and non-Markdown output paths.
  - Kept default invalid-output-path errors human-readable on stderr.
  - Documented the behavior in README, task-contract docs, and the changelog.
- Verification run:
  - Red focused create-task tests failed because invalid output paths printed human errors to stderr.
  - Focused create-task suite passed: 10 tests.
  - `.agentloop/reports/2026-06-11-03-41-verification-report.md`, overall status pass.
- What worked well:
  - The structured error gives agents a recovery reason without changing write safety.
- Improve:
  - Keep `create-task` path validation strict; do not auto-correct or rewrite unsafe output paths.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-11: JSON Error Output for Invalid Artifact Paths

- Task contract: `.agentloop/tasks/archive/2026-06-11-return-json-errors-for-invalid-artifact-paths.md`
- Trigger:
  - `agentloop summarize`, `handoff`, and `report` accepted explicit missing input artifact paths and still produced output.
- Implementation:
  - Added shared validation for explicit task, verification, and handoff Markdown artifact paths.
  - Added JSON error handling for invalid explicit paths on `summarize`, `handoff`, and `report`.
  - Kept implicit latest-task, latest-report, and latest-handoff fallback behavior unchanged.
  - Documented the behavior in README, HTML report docs, PR summary docs, and the changelog.
- Verification run:
  - Red focused summary/report tests failed because invalid explicit paths exited `0`.
  - Focused handoff and HTML report suites passed: 12 tests.
  - `.agentloop/reports/2026-06-11-03-52-verification-report.md`, overall status pass.
  - Post-build smoke confirmed missing verification and handoff paths return `ARTIFACT_PATH_INVALID` JSON errors.
- What worked well:
  - The same validator now protects command paths that assemble reviewer evidence from local artifacts.
- Improve:
  - Consider consolidating duplicate JSON-error printing helpers after the `0.28.0` batch if the next pass adds more structured errors.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-11: JSON Error Output for Invalid npm Registry Files

- Task contract: `.agentloop/tasks/archive/2026-06-11-return-json-errors-for-invalid-npm-registry-files.md`
- Trigger:
  - `agentloop npm-status --registry-json <path> --json` used the global human error path for missing captured files and treated malformed captured JSON as an `unknown` status with exit code `0`.
- Implementation:
  - Added captured registry-file validation before `npm-status` compares versions.
  - Added JSON errors for missing, unreadable, malformed, or wrong-shape captured npm view JSON files.
  - Kept live `npm view` registry failures on the existing `unknown` status path.
  - Documented the behavior in README, npm-status docs, and the changelog.
- Verification run:
  - Red focused npm-status tests failed for missing files, malformed JSON, and wrong-shape captured npm view JSON.
  - Focused npm-status suite passed: 9 tests.
  - `.agentloop/reports/2026-06-11-04-00-verification-report.md`, overall status pass.
  - Built CLI smoke confirmed missing and malformed captured registry files return `NPM_STATUS_REGISTRY_JSON_INVALID` errors with non-zero exits.
- What worked well:
  - The release-safety command now tells automation whether the captured input file is missing, unreadable, or invalid.
- Improve:
  - Keep live npm registry errors as status evidence instead of command-argument errors.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-11: JSON Error Output for Init Local-Only Setup Failures

- Task contract: `.agentloop/tasks/archive/2026-06-11-return-json-errors-for-init-local-only-setup-failures.md`
- Trigger:
  - `agentloop init --local-only --json` outside a Git repository used the global human error path.
- Implementation:
  - Added a typed init setup error with `mode`, `reason`, and `nextCommand`.
  - Added JSON output for local-only setup failures when `--json` is requested.
  - Kept default non-JSON setup failures on the existing human-readable stderr path.
  - Documented the behavior in README, getting-started docs, and the changelog.
- Verification run:
  - Red focused init test failed because JSON mode still wrote the local-only setup error to stderr.
  - Focused init suite passed: 19 tests.
  - `.agentloop/reports/2026-06-11-04-09-verification-report.md`, overall status pass.
  - Built CLI smoke from a non-Git temp directory confirmed `INIT_SETUP_ERROR` with `mode: local-only` and `reason: git-repository-required`.
- What worked well:
  - First-run automation now gets the exact setup fix without weakening the local-only safety rule.
- Improve:
  - Consider structured JSON for other init setup guards only when the CLI can test them without touching real user directories.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-11: JSON Error Output for Invalid npm-status Timeouts

- Task contract: `.agentloop/tasks/archive/2026-06-11-return-json-errors-for-invalid-npm-status-timeouts.md`
- Trigger:
  - `agentloop npm-status --timeout-ms <value> --json` let Commander reject invalid timeout values before the command could return JSON.
- Implementation:
  - Moved timeout validation into the `npm-status` command action.
  - Added JSON errors for non-integer, zero, and negative timeout values.
  - Kept default non-JSON timeout failures on the human-readable stderr path.
  - Documented the behavior in README, npm-status docs, and the changelog.
- Verification run:
  - Red focused npm-status tests failed because invalid timeout values produced no JSON body.
  - Focused npm-status suite passed: 12 tests.
  - `.agentloop/reports/2026-06-11-04-18-verification-report.md`, overall status pass.
  - `.agentloop/handoffs/2026-06-11-04-21-pr-summary.md` captured the review handoff.
  - Built CLI smoke confirmed `NPM_STATUS_TIMEOUT_INVALID` with `requestedTimeout: nope`.
- What worked well:
  - Release automation now receives a parseable input error before any registry check runs.
- Improve:
  - Keep timeout validation strict; do not accept partial values such as `10abc`.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-11: JSON Error Output for Invalid Verify Task Paths

- Task contract: `.agentloop/tasks/archive/2026-06-11-return-json-errors-for-invalid-verify-task-paths.md`
- Trigger:
  - `agentloop verify --task <bad path> --json` still wrote a normal verification result, while other explicit artifact-path commands returned structured JSON errors.
- Implementation:
  - Added JSON-mode task artifact validation to `verify`.
  - Kept default non-JSON behavior: invalid task paths are reported as unavailable inside the verification report.
  - Confirmed invalid JSON-mode task paths do not run configured commands and do not write reports.
  - Documented the behavior in README, verification report docs, and the changelog.
- Verification run:
  - Red focused verification test failed because invalid JSON task paths exited `0`.
  - Focused verification suite passed: 21 tests.
  - `.agentloop/reports/2026-06-11-04-28-verification-report.md`, overall status pass.
  - `.agentloop/handoffs/2026-06-11-04-30-pr-summary.md` captured the review handoff.
  - Built CLI smoke confirmed `ARTIFACT_PATH_INVALID` and no command execution for invalid task paths.
- What worked well:
  - The existing artifact-path error shape fit `verify` without adding a new public error contract.
- Improve:
  - Consider extracting the repeated artifact-path JSON printer after the `0.28.0` batch if more commands need it.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-11: JSON Config Errors for Loop State Commands

- Task contract: `.agentloop/tasks/archive/2026-06-11-return-json-config-errors-for-loop-state-commands.md`
- Trigger:
  - `agentloop status --json`, `agentloop next --json`, and `agentloop check-gates --json` fell back to the global stderr path when `agentloop.config.json` was invalid.
- Implementation:
  - Added a shared CLI JSON error printer for `AgentLoopError` values.
  - Added command-level `ConfigError` handling to `status`, `next`, and `check-gates` in JSON mode.
  - Kept human output on the existing global stderr path.
  - Documented the behavior in README, status docs, check-gates docs, and the changelog.
- Verification run:
  - Red focused loop-state tests failed because JSON stdout was empty for invalid config.
  - Focused loop-state suites passed: 27 tests.
  - `.agentloop/reports/2026-06-11-04-38-verification-report.md`, overall status pass.
  - `.agentloop/handoffs/2026-06-11-04-39-pr-summary.md` captured the review handoff.
  - Built CLI smoke confirmed `CONFIG_ERROR` JSON for all three commands.
- What worked well:
  - The shared JSON printer keeps future command-level setup errors consistent without changing global human error handling.
- Improve:
  - Consider applying the same helper to other config-loading commands in small, tested passes.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-11: JSON Config Errors for Evidence Commands

- Task contract: `.agentloop/tasks/archive/2026-06-11-return-json-config-errors-for-evidence-commands.md`
- Trigger:
  - Evidence-producing JSON commands still used the global stderr path when `agentloop.config.json` was invalid.
- Implementation:
  - Added a shared config loader for JSON commands that prints `CONFIG_ERROR` and exits non-zero on invalid config.
  - Applied it to `verify`, `summarize`, `handoff`, `report`, `badge`, `ci-summary`, and `release-notes`.
  - Kept human output on the existing global stderr path.
  - Confirmed invalid config prevents command execution and generated artifact writes.
  - Documented the behavior in README, command docs, and the changelog.
- Verification run:
  - Red focused evidence tests failed because JSON stdout was empty for invalid config.
  - Focused evidence suites passed: 53 tests.
  - `.agentloop/reports/2026-06-11-04-50-verification-report.md`, overall status pass.
  - `.agentloop/handoffs/2026-06-11-04-51-pr-summary.md` captured the review handoff.
  - Built CLI smoke confirmed `CONFIG_ERROR` JSON for all seven evidence commands.
- What worked well:
  - The shared config loader removed repeated command-level try/catch code for this class of setup errors.
- Improve:
  - Reuse the loader in remaining config-loading commands in small passes, keeping command-specific JSON details intact.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-11: JSON Config Errors for Task and Policy Commands

- Task contract: `.agentloop/tasks/archive/2026-06-11-return-json-config-errors-for-task-and-policy-commands.md`
- Trigger:
  - `create-task --json`, `task ... --json`, and `policy ... --json` still used the global human stderr path when `agentloop.config.json` was invalid.
- Implementation:
  - Reused the shared JSON config loader in `create-task`, all task subcommands, and policy subcommands.
  - Kept non-JSON failures on the existing human stderr path.
  - Confirmed invalid config prevents task creation, task status changes, task archiving, active-task clearing, and policy reads.
  - Documented the behavior in README, task-contract docs, policy docs, and the changelog.
- Verification run:
  - Red focused task and policy tests failed because JSON stdout was empty for invalid config.
  - Focused create-task, task-state, and policy suites passed: 49 tests.
  - `.agentloop/reports/2026-06-11-05-03-verification-report.md`, overall status pass.
  - Built CLI smoke confirmed `CONFIG_ERROR` JSON for `task list --json`.
- What worked well:
  - The existing helper fit the remaining config-loading JSON commands without changing command-specific error details.
- Improve:
  - Keep the global error handler human-readable and continue handling machine-readable setup failures at command boundaries.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-11: Summarize and Handoff Format Validation

- Task contract: `.agentloop/tasks/archive/2026-06-11-validate-summarize-and-handoff-output-formats.md`
- Trigger:
  - `summarize` and `handoff` documented `--format` as `markdown` or `json`, but unsupported values fell back to Markdown.
- Implementation:
  - Added explicit output-format validation for `summarize` and `handoff`.
  - Kept `--format markdown`, `--format json`, and `--json` behavior unchanged.
  - Added JSON-mode `UNSUPPORTED_OUTPUT_FORMAT` errors with `requestedFormat` and `supportedFormats`.
  - Confirmed invalid handoff formats do not write handoff artifacts.
  - Documented the behavior in README, PR summary docs, and the changelog.
- Verification run:
  - Red focused handoff tests failed because unsupported formats exited `0`.
  - Focused handoff suite passed: 11 tests.
  - `.agentloop/reports/2026-06-11-05-15-verification-report.md`, overall status pass.
  - Built CLI smoke confirmed `handoff --format xml --json` returns `UNSUPPORTED_OUTPUT_FORMAT` and writes no handoff.
- What worked well:
  - Validating format before config loading keeps bad input from doing any artifact work.
- Improve:
  - Keep command-specific JSON errors explicit when the error includes useful fields beyond `code` and `message`.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-11: Malformed Config JSON Errors

- Task contract: `.agentloop/tasks/archive/2026-06-11-return-config-errors-for-malformed-json-config.md`
- Trigger:
  - JSON commands documented invalid `agentloop.config.json` as `CONFIG_ERROR`, but malformed JSON still surfaced as a raw `SyntaxError`.
- Implementation:
  - Normalized `JSON.parse` failures in `loadAgentLoopConfig` to `ConfigError`.
  - Kept schema-invalid config behavior unchanged.
  - Confirmed `status --json` returns `CONFIG_ERROR` for malformed config.
  - Confirmed default human output keeps a clear `agentloop: Invalid AgentLoopKit config` message.
  - Documented the behavior in configuration docs and the changelog.
- Verification run:
  - Red focused config and status tests failed because malformed JSON threw `SyntaxError`.
  - Focused config and status suites passed: 17 tests.
  - `.agentloop/reports/2026-06-11-05-24-verification-report.md`, overall status pass.
  - Built CLI smoke confirmed malformed config returns `CONFIG_ERROR` JSON.
- What worked well:
  - Fixing the loader updated all command-level `ConfigError` handlers without command-by-command patches.
- Improve:
  - Keep config parse errors normalized at the loader boundary so commands can stay small.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-11: Repo-Relative Config Paths

- Task contract: `.agentloop/tasks/archive/2026-06-11-reject-unsafe-config-paths.md`
- Trigger:
  - `agentloop.config.json` accepted arbitrary string path values for AgentLoopKit artifact directories.
  - Absolute paths or parent traversal could move configured task, report, or handoff locations outside the current repo boundary.
- Implementation:
  - Added config validation that rejects empty paths, null bytes, absolute paths, and `..` segments across POSIX and Windows-style separators.
  - Updated the shipped JSON schema to document the same repo-relative path rule for editors.
  - Documented the behavior in README, configuration docs, changelog, and decisions.
- Verification run:
  - Red focused config/schema tests failed because unsafe paths were accepted and schema metadata was absent.
  - Focused config/schema tests passed after the validation and schema update.
  - Full `npm test`, `npm run lint`, `npm run typecheck`, `npm run check:links`, `npm run build`, `git diff --check`, and `npx --yes projscan doctor --format markdown` passed.
  - Dogfood report: `.agentloop/reports/2026-06-11-07-05-verification-report.md`, overall status pass.
  - Handoff summary: `.agentloop/handoffs/2026-06-11-07-09-pr-summary.md`.
- What worked well:
  - The existing `ConfigError` path means JSON-capable commands can report unsafe path config through the same `CONFIG_ERROR` setup failure.
- Improve:
  - Keep future config path customization simple and repo-local; do not introduce arbitrary filesystem output targets.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-11: Drive-Qualified Config Path Parity

- Task contract: `.agentloop/tasks/archive/2026-06-11-reject-drive-qualified-config-paths.md`
- Trigger:
  - The shipped JSON schema rejected Windows drive-qualified paths such as `C:agentloop\reports`, but runtime config validation accepted them because `path.win32.isAbsolute` returns `false` for drive-relative paths.
- Implementation:
  - Added a focused runtime check for leading Windows drive prefixes in config path values.
  - Added a failing-first config test for `C:agentloop\reports`.
  - Updated README, configuration docs, changelog, decisions, schema descriptions, and backlog wording to name drive-qualified paths explicitly.
- Verification run:
  - Red focused config/schema tests failed because `C:agentloop\reports` was accepted.
  - Focused config/schema tests passed after the runtime validator fix.
  - Full `npm test`, `npm run lint`, `npm run typecheck`, `npm run check:links`, `npm run build`, `git diff --check`, and `npx --yes projscan doctor --format markdown` passed.
  - Dogfood report: `.agentloop/reports/2026-06-11-07-19-verification-report.md`, overall status pass.
  - Handoff summary: `.agentloop/handoffs/2026-06-11-07-20-pr-summary.md`.
- What worked well:
  - The existing schema pattern already encoded the intended safety rule, so the fix stayed limited to parser parity and wording.
- Improve:
  - Keep schema descriptions and runtime validation examples in sync whenever config path rules change.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-11: Artifact Root Symlink Guard

- Task contract: `.agentloop/tasks/archive/2026-06-11-reject-artifact-root-symlink-escapes.md`
- Trigger:
  - Repo-relative config paths still allowed generated artifacts to follow a configured root directory that was itself a symlink outside the repo.
- Implementation:
  - Added a realpath check that rejects configured artifact roots that resolve outside the current repo.
  - Routed default generated outputs for task contracts, verification reports, handoffs, HTML reports, badges, CI summaries, and release notes through the guard.
  - Added JSON `OUTPUT_PATH_INVALID` handling for `verify`, `summarize`, and `handoff`.
  - Documented the behavior in README, configuration docs, command docs, changelog, and decisions.
- Verification run:
  - Red focused artifact tests failed because the CLI exited `0` and wrote through the symlinked roots.
  - Focused artifact suites passed after the guard: 7 files and 89 tests.
  - Full `npx pnpm@10.12.1 test` passed: 36 files and 275 tests.
  - `npx pnpm@10.12.1 lint`, `typecheck`, `check:links`, `build`, `git diff --check`, and `npx --yes projscan doctor --format markdown` passed.
  - Dogfood report: `.agentloop/reports/2026-06-11-07-38-verification-report.md`, overall status pass.
  - Handoff summary: `.agentloop/handoffs/2026-06-11-07-39-pr-summary.md`.
- What worked well:
  - One shared output resolver covered several generated artifact commands without adding a new dependency.
- Improve:
  - Consider a later pass for non-artifact writes such as agent installation and local-only exclude files.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-11: Install-Agent Symlink Guard

- Task contract: `.agentloop/tasks/archive/2026-06-11-reject-install-agent-symlink-escapes.md`
- Trigger:
  - `install-agent` could write through `.agentloop/agents` or `AGENTS.md` when either path was a symlink to a location outside the repo.
- Implementation:
  - Reused the output-path guard for `.agentloop/agents/*.md` and `AGENTS.md`.
  - Validated both target paths before reading or writing, so an unsafe `AGENTS.md` symlink cannot leave a partially written agent file behind.
  - Added JSON `OUTPUT_PATH_INVALID` handling for `install-agent <agent>` and `install-agent all`.
  - Documented the behavior in README, changelog, decisions, and backlog.
- Verification run:
  - Red focused install-agent tests failed because the CLI exited `0` and followed symlinked targets.
  - Focused install-agent suite passed after the guard: 1 file and 8 tests.
  - Full `npx pnpm@10.12.1 test` passed: 36 files and 277 tests.
  - `npx pnpm@10.12.1 lint`, `typecheck`, `check:links`, `build`, `git diff --check`, and `npx --yes projscan doctor --format markdown` passed.
  - Dogfood report: `.agentloop/reports/2026-06-11-07-47-verification-report.md`, overall status pass.
  - Handoff summary: `.agentloop/handoffs/2026-06-11-07-49-pr-summary.md`.
- What worked well:
  - The existing output-path error shape fit install-agent without adding a second JSON error contract.
- Improve:
  - Review `init` writes next, especially pre-existing `.agentloop` or root Markdown symlinks.
  - Keep this unreleased until the planned `0.28.0` batch.

## 2026-06-11: Init Symlink Guard

- Task contract: `.agentloop/tasks/archive/2026-06-11-reject-init-symlink-escapes.md`
- Trigger:
  - `agentloop init` could follow pre-existing symlinks for `.agentloop/`, `AGENTS.md`, `AGENTLOOP.md`, or `agentloop.config.json`, which could redirect first-run harness files outside the target repo.
- Implementation:
  - Added a preflight pass for every generated init target before any harness file is written.
  - Reused the existing output-path guard so `init --json` returns `OUTPUT_PATH_INVALID` for unsafe targets.
  - Resolved init write paths again at each write/read point, including `AGENTS.md` append behavior and local-only notices.
  - Updated README, changelog, decisions, and backlog with the repo-local init rule.
- Verification run:
  - Red focused init tests failed first because unsafe symlink targets exited `0`.
  - Focused init suite passed after the guard: 1 file and 21 tests.
  - Dogfood verification report passed: `.agentloop/reports/2026-06-11-08-00-verification-report.md`.
  - Handoff summary: `.agentloop/handoffs/2026-06-11-08-02-pr-summary.md`.
  - Full `npx pnpm@10.12.1 test` passed: 36 files and 279 tests.
  - `npx pnpm@10.12.1 lint`, `typecheck`, `check:links`, `build`, `git diff --check`, and `npx --yes projscan doctor --format markdown` passed.
- What worked well:
  - The existing `OutputPathError` shape covered init without adding a new error contract.
- Improve:
  - Consider adding packed-release smoke coverage for symlinked init targets before the `0.28.0` release batch.

## 2026-06-11: Task State Symlink Guard

- Task contract: `.agentloop/tasks/archive/2026-06-11-reject-task-state-symlink-escapes.md`
- Trigger:
  - Task pinning uses `.agentloop/state.json`, and a pre-existing symlinked state file or configured state directory could redirect active-task state outside the repo.
- Implementation:
  - Added a repo-local task-state output guard for `.agentloop/state.json`.
  - Made unsafe task-state reads behave like no active task, so `task current`, `status`, and `list` do not read outside repo state.
  - Made unsafe task-state writes and clears fail with `OUTPUT_PATH_INVALID` in JSON mode.
  - Updated README, changelog, decisions, and backlog.
- Verification run:
  - Red focused task-state tests failed first because `task set`, `task current`, and `task clear` followed unsafe state symlinks.
  - Focused task-state suite passed after the guard: 1 file and 33 tests.
  - Dogfood verification report passed: `.agentloop/reports/2026-06-11-08-09-verification-report.md`.
  - Handoff summary: `.agentloop/handoffs/2026-06-11-08-12-pr-summary.md`.
  - Full `npx pnpm@10.12.1 test` passed: 36 files and 283 tests.
  - `npx pnpm@10.12.1 lint`, `typecheck`, `check:links`, `build`, `git diff --check`, and `npx --yes projscan doctor --format markdown` passed.
- What worked well:
  - Treating unsafe state reads as empty state keeps read-only commands safe and quiet.
- Improve:
  - Add packed-release smoke coverage for the safety guards before cutting `0.28.0`.

## 2026-06-11: Task Archive Symlink Guard

- Task contract: `.agentloop/tasks/archive/2026-06-11-reject-task-archive-symlink-escapes.md`
- Trigger:
  - `agentloop task archive` resolved the source task safely but did not resolve a pre-existing `.agentloop/tasks/archive` symlink before moving the file.
- Implementation:
  - Added a repo-local task archive destination guard before archive existence checks, directory creation, and rename.
  - Added JSON `OUTPUT_PATH_INVALID` handling for unsafe archive destinations.
  - Updated README, changelog, decisions, and backlog.
- Verification run:
  - Red focused task-state tests failed first because core and CLI archive paths followed the symlink and exited successfully.
  - Focused task-state suite passed after the guard: 1 file and 35 tests.
  - Dogfood verification report passed: `.agentloop/reports/2026-06-11-08-18-verification-report.md`.
  - Handoff summary: `.agentloop/handoffs/2026-06-11-08-21-pr-summary.md`.
  - Full `npx pnpm@10.12.1 test` passed: 36 files and 285 tests.
  - `npx pnpm@10.12.1 lint`, `typecheck`, `check:links`, `build`, `git diff --check`, and `npx --yes projscan doctor --format markdown` passed.
- What worked well:
  - Reusing `resolveOutputArtifactPath` kept task archive errors consistent with reports, handoffs, init, and state writes.
- Improve:
  - Add packed-release smoke coverage for these filesystem safety guards before cutting `0.28.0`.

## 2026-06-11: Packed Symlink Safety Smoke

- Task contract: `.agentloop/tasks/archive/2026-06-11-add-packed-symlink-safety-smoke.md`
- Trigger:
  - The source-level tests covered symlink safety, but `npm run smoke:release` did not verify the same behavior in the packed CLI.
- Implementation:
  - Added packed smoke steps for unsafe symlinked init harness targets and unsafe symlinked task archive destinations.
  - Updated the packed verify task-path smoke to expect the current `ARTIFACT_PATH_INVALID` JSON error instead of the older unavailable-context behavior.
  - Added focused helper coverage for the expanded smoke-step list.
- Verification run:
  - Red focused release-smoke test failed because the new smoke steps were missing.
  - Initial `npm run smoke:release` failed because the verify task-path smoke expected old behavior.
  - Focused release-smoke suite passed after the script update: 1 file and 8 tests.
  - Direct `npm run smoke:release` passed after updating the verify task-path assertion.
  - Dogfood verification report passed: `.agentloop/reports/2026-06-11-08-29-verification-report.md`.
  - Handoff summary: `.agentloop/handoffs/2026-06-11-08-31-pr-summary.md`.
  - Full `npx pnpm@10.12.1 test` passed: 36 files and 285 tests.
  - `npx pnpm@10.12.1 lint`, `typecheck`, `check:links`, `build`, `git diff --check`, and `npx --yes projscan doctor --format markdown` passed.
- What worked well:
  - Running the packed smoke script inside the task verification caught stale release-smoke expectations before the next release batch.
- Improve:
  - Keep packed smoke focused on representative safety and packaging failures so it remains fast enough to run before release.

## 2026-06-11: Public Release Docs Cleanup

- Task contract: `.agentloop/tasks/2026-06-11-compact-public-release-docs-for-0-28-0-batch.md`
- Trigger:
  - Public maintainer docs still carried stale incident-style publishing history after trusted publishing, GHCR, and MCP Registry releases were working.
  - The README was already clean, but release-adjacent docs and examples could train future contributors to reintroduce unsupported channel claims or old npm mismatch wording.
- Implementation:
  - Rewrote `docs/npm-publishing.md`, `docs/release-status.md`, `docs/launch-checklist.md`, `docs/release-checklist-example.md`, and `examples/release-checklist/README.md` around the current release path.
  - Renamed the public GitHub label template from `product-panel` to `planning`.
  - Added packed-release smoke helper coverage for unsupported install-channel claims and maintainer-only release chatter in normal public docs.
- Verification run:
  - Red focused release-smoke test first failed on stale release-checklist examples and then on a named unsupported channel in the new launch checklist.
  - Focused release-smoke suite passed after docs cleanup: 1 file and 12 tests.
  - Dogfood verification report passed: `.agentloop/reports/2026-06-11-08-50-verification-report.md`.
  - Full `npx pnpm@10.12.1 test` passed: 36 files and 289 tests.
  - `npx pnpm@10.12.1 lint`, `typecheck`, `check:links`, `build`, `npm run smoke:release`, `git diff --check`, and `npx --yes projscan doctor --format markdown` passed.
- What worked well:
  - Putting the public-doc claim check inside packed-release smoke catches README/npm-package regressions before publish.
- Improve:
  - Consider adding a small dedicated public-doc lint script later if the smoke helper starts doing too many unrelated checks.

## 2026-06-11: Read-Only Artifact Root Guard

- Task contract: `.agentloop/tasks/2026-06-11-guard-read-only-artifact-roots-from-symlink-escapes.md`
- Trigger:
  - The previous symlink-safety work protected writes and explicit task paths, but read-only discovery still trusted configured task, report, handoff, and policy roots.
  - Status, gates, CI summaries, HTML reports, release notes, MCP tools, task listing, and policy reads could treat a symlinked artifact root outside the repo as local evidence.
- Implementation:
  - Added a shared `resolvesInsidePath` helper for read-side repo-boundary checks.
  - Made latest Markdown discovery optionally ignore roots that resolve outside the current repo.
  - Applied the guard to status, gates, PR summaries, HTML reports, badges, CI summaries, release notes, MCP report/handoff tools, task listing, and policy inspection.
  - Replaced duplicate latest-report/latest-handoff helpers in badge and HTML report code with the shared artifact helper.
  - Updated changelog, decisions, and backlog without changing package version or publishing.
- Verification run:
  - Red focused tests first failed because status, check-gates, CI summary, MCP tools, and policy reads exposed outside symlinked roots.
  - Expanded focused suite passed after the guard: 9 files and 115 tests.
  - Full `npx pnpm@10.12.1 test` passed: 36 files and 296 tests.
  - `npx pnpm@10.12.1 lint`, `typecheck`, `check:links`, `npm run build`, `npm run smoke:release`, and `npx --yes projscan doctor --format markdown` passed.
  - Dogfood verification report passed: `.agentloop/reports/2026-06-11-09-09-verification-report.md`.
  - Handoff summary: `.agentloop/handoffs/2026-06-11-09-14-pr-summary.md`.
- What worked well:
  - Treating unsafe read roots as missing local evidence preserved existing read-only command UX while closing the content exposure.
  - Consolidating latest-artifact lookup removed duplicate filesystem scanning code.
- Improve:
  - Keep any future read-only artifact feature on the shared latest-artifact helper or an equivalent repo-bound guard.
  - Continue batching this work into the planned `0.28.0` release instead of cutting a patch for every bug-pass slice.

## 2026-06-11: Check-Gates Required File Symlink Guard

- Task contract: `.agentloop/tasks/2026-06-11-treat-unsafe-gate-file-symlinks-as-missing.md`
- Trigger:
  - After read-only artifact root guards, `check-gates` still used simple existence checks for required root, harness, and policy files.
  - A required file such as `AGENTS.md` or `.agentloop/policies/secrets-policy.md` could be a symlink to an outside file and still satisfy the review gate.
- Implementation:
  - Changed `check-gates` required-file checks to count a file as present only when its resolved path stays inside the current repo.
  - Preserved existing gate severity: unsafe required files are reported as missing, producing the same warning behavior as absent harness or policy files.
  - Added a regression test covering an outside `AGENTS.md` symlink and an outside policy-file symlink.
  - Updated README, changelog, decisions, and backlog without a version bump or release.
- Verification run:
  - Red focused `check-gates` test failed first because the gate stayed `pass`.
  - Focused `npx pnpm@10.12.1 test tests/check-gates.test.ts` passed after the fix: 1 file and 9 tests.
  - Full `npx pnpm@10.12.1 test` passed: 36 files and 297 tests.
  - `npx pnpm@10.12.1 lint`, `typecheck`, `check:links`, `npm run build`, `npm run smoke:release`, and `npx --yes projscan doctor --format markdown` passed.
  - Dogfood verification report passed: `.agentloop/reports/2026-06-11-09-23-verification-report.md`.
  - Handoff summary: `.agentloop/handoffs/2026-06-11-09-27-pr-summary.md`.
- What worked well:
  - Reusing `resolvesInsidePath` kept the check consistent with the other repo-local read and write guards.
- Improve:
  - Watch for any other pass/fail gates that use existence checks without repo-bound resolution.

## 2026-06-11: Create-Task Risk Note Flags

- Task contract: `.agentloop/tasks/archive/2026-06-11-add-create-task-risk-note-flags.md`
- Trigger:
  - Dogfooding showed that agents can fill most task contract fields non-interactively, but Risk Notes still required manual editing.
  - `agentloop create-task --risk` was the natural command shape, but Commander rejected it as an unknown option.
- Implementation:
  - Added repeatable `create-task --risk` and `--risk-note` flags.
  - Passed parsed risk notes into the existing task contract renderer without changing task headings or defaults.
  - Added focused CLI coverage for help output and repeated risk-note flags.
  - Updated README, changelog, decisions, and backlog without a version bump or release.
- Verification run:
  - Red focused `create-task` tests failed first because the help text and flags were missing.
  - Focused `npx pnpm@10.12.1 test tests/create-task.test.ts` passed after the fix: 1 file and 14 tests.
  - Full `npx pnpm@10.12.1 test` passed: 36 files and 298 tests.
  - `npx pnpm@10.12.1 lint`, `typecheck`, `check:links`, `npm run build`, `npm run smoke:release`, and `npx --yes projscan doctor --format markdown` passed.
  - Dogfood verification report passed: `.agentloop/reports/2026-06-11-09-36-verification-report.md`.
  - Handoff summary: `.agentloop/handoffs/2026-06-11-09-40-pr-summary.md`.
- What worked well:
  - Keeping Risk Notes as plain task-contract bullets avoided new concepts while making non-interactive task creation complete.
- Improve:
  - If users need richer risk modeling later, add it as a separate policy feature instead of overloading `create-task`.

## 2026-06-11: VS Code and Open VSX Extension Design

- Task contract: `.agentloop/tasks/archive/2026-06-10-explore-vscode-open-vsx-extension.md`
- Trigger:
  - The deferred distribution backlog still included a VS Code/Open VSX extension question.
  - Building an editor extension now would add a second product surface before the CLI workflow needs it.
- Implementation:
  - Added `docs/designs/vscode-open-vsx-extension.md`.
  - Recorded the decision to defer implementation until command-palette shortcuts have clear demand.
  - Updated distribution docs, roadmap, backlog, decisions, changelog, and final handoff notes.
  - Did not build an extension, webview, dashboard, policy editor, or new package.
- Verification run:
  - `npx pnpm@10.12.1 check:links` passed: 868 Markdown files checked.
  - `npx pnpm@10.12.1 lint` passed.
  - `git diff --check` passed.
  - `npx --yes projscan doctor --format markdown` passed with health score A.
  - Dogfood verification report passed: `.agentloop/reports/2026-06-11-09-49-verification-report.md`.
  - Handoff summary: `.agentloop/handoffs/2026-06-11-09-51-pr-summary.md`.
- What worked well:
  - Treating the extension as a design decision kept the product lightweight while still closing the deferred question.
- Improve:
  - Do not pick up more deferred distribution tasks until the maintainer explicitly asks for them.

## 2026-06-11: Extended 0.28.0 Launch-Hardening Queue

- Task contract: `.agentloop/tasks/2026-06-11-run-extended-0-28-0-launch-hardening-queue.md`
- Trigger:
  - The product needed a deeper release-quality pass without cutting another npm version.
  - The approved queue focused on release readiness, evidence inventory, doctor guidance, docs drift, GitHub Action ergonomics, examples, and dogfooding.
- Implementation:
  - Added `agentloop release-check` with human, JSON, and strict modes.
  - Added `agentloop artifacts --type <type>` and `--latest`.
  - Added structured doctor `nextActions` and a human `## Next Steps` section.
  - Added a CLI docs drift guard for help, README, CLI reference, and completions.
  - Hardened the composite GitHub Action with validated `install-mode`, local dependency mode, working-directory-aware install, and lockfile-free npm install.
  - Added `examples/end-to-end/README.md`.
  - Updated README, CLI reference, GitHub Action docs, changelog, decisions, and backlog without bumping the package version.
- Verification run:
  - Red focused tests failed first for `release-check`, doctor next actions, docs drift, action install modes, end-to-end example, and the handoff next-step copy bug.
  - Focused suites passed after implementation:
    - `tests/release-check.test.ts`: 4 tests.
    - `tests/doctor.test.ts`: 9 tests.
    - `tests/cli-docs-drift.test.ts` and `tests/completion.test.ts`: 10 tests.
    - `tests/artifacts.test.ts`: 13 tests.
    - `tests/distribution-artifacts.test.ts`: 9 tests.
    - `tests/examples.test.ts`: 1 test.
  - Full `npm test` passed: 40 files and 321 tests.
  - `npm run lint`, `npm run typecheck`, `npm run check:links`, `npm run build`, `node scripts/smoke-cli.mjs`, `npm run smoke:release`, and `npx --yes projscan doctor --format markdown` passed.
  - Built command checks passed:
    - `node dist/cli/index.js release-check --json`.
    - `node dist/cli/index.js artifacts --json`.
  - Dogfood verification report passed: `.agentloop/reports/2026-06-11-11-48-verification-report.md`.
  - Handoff summary: `.agentloop/handoffs/2026-06-11-11-50-pr-summary.md`.
- What worked well:
  - The new drift guard caught the missing `artifacts` shell completion entry.
  - Reviewing the artifacts next-step copy caught an invalid `agentloop handoff --write` suggestion before commit.
  - `projscan doctor --format markdown` stayed clean after the batch.
- Improve:
  - Do not run smoke scripts in parallel with `npm run build`; `dist/` cleanup can race template copies.
  - Consider adding a dedicated `release-check` docs page if the command grows beyond the CLI reference.

## 2026-06-11: Two-Hour Product And Security Hardening Pass

- Task contract: `.agentloop/tasks/2026-06-11-run-two-hour-product-security-hardening-pass.md`
- Trigger:
  - The maintainer asked for a focused two-hour product-quality pass covering bugs, improvements, and security review without cutting another version.
  - Two read-only subagents audited security/trust risks and product/UX failure modes.
- Implementation:
  - Added `doctor --strict` for CI-style setup gates.
  - Added `status --brief` for compact loop state and next-action output.
  - Hardened `init --local-only` so it uses Git's real metadata directory before writing `info/exclude`.
  - Replaced the composite GitHub Action's shell-interpolated AgentLoop command with a tested Node runner that validates inputs and spawns commands with argument arrays.
  - Added npm package-name validation to `npm-status`.
  - Added stale-verification handling across `check-gates`, `handoff`, `release-notes`, and `release-check`.
  - Added the `CHANGELOG.md` `Unreleased` gate to `release-check`.
  - Added Git ref validation and `--end-of-options` handling to `release-notes`.
  - Pinned and SHA-256 checked the MCP publisher download in the MCP Registry workflow.
  - Bounded doctor risk-file scans and added truncation reporting.
  - Added `verify --timeout-ms` with timed-out commands recorded as failed evidence.
  - Updated README, CLI docs, status docs, verification docs, release docs, MCP docs, changelog, decisions, and backlog.
- Verification run:
  - Red focused tests failed first for each behavior: strict doctor, brief status, local-only fake `.git`, Unreleased release-check, action runner, npm package-name validation, stale evidence, Git ref validation, risk-scan truncation, and verification timeout.
  - Focused suites passed after implementation:
    - `tests/doctor.test.ts`
    - `tests/status.test.ts`
    - `tests/init.test.ts`
    - `tests/release-check.test.ts`
    - `tests/github-action-runner.test.ts`
    - `tests/distribution-artifacts.test.ts`
    - `tests/npm-status.test.ts`
    - `tests/check-gates.test.ts`
    - `tests/pr-summary.test.ts`
    - `tests/release-notes.test.ts`
    - `tests/safety.test.ts`
    - `tests/verification.test.ts`
  - Full release checks passed:
    - `npm run lint`
    - `npm run typecheck`
    - `npm test`
    - `npm run check:links`
    - `npm run build`
    - `node scripts/smoke-cli.mjs`
    - `npm run smoke:release`
    - `npx --yes projscan doctor --format markdown`
  - Dogfood verification report passed: `.agentloop/reports/2026-06-11-12-59-verification-report.md`.
  - Handoff summary: `.agentloop/handoffs/2026-06-11-13-01-pr-summary.md`.
- What worked well:
  - The subagent audits found real release-readiness and stale-evidence bugs, not just polish.
  - The existing task/report/handoff structure made it straightforward to dogfood fixes without adding a backend or telemetry.
- Improve:
  - Add option-level CLI/docs drift coverage so new public flags such as `--strict`, `--brief`, and `--timeout-ms` cannot be missed in docs.
  - Consider a config-level verification timeout later if users repeatedly pass the same `--timeout-ms`.

## 2026-06-11: Parent Config Workspace Discovery

- Task contract: `.agentloop/tasks/2026-06-11-run-agentloopkit-commands-from-repo-subdirectories.md`
- Trigger:
  - The continued product pass found a real workflow bug: after root setup, agents can work from nested folders where `agentloop.config.json` is not present.
  - Commands such as `status`, `create-task`, and `verify` should still use the initialized AgentLoop root instead of failing or writing nested artifacts.
- Implementation:
  - Added a workspace loader that searches upward for the nearest `agentloop.config.json`.
  - Kept `agentloop init` current-directory based.
  - Rewired non-init repo commands to use the discovered workspace root for local evidence, policies, release helpers, MCP state, and npm-status package metadata.
  - Updated README, CLI reference, configuration, status, task, verification, and npm-status docs.
- Verification run:
  - Red focused tests failed first for nested `status`, `create-task`, `verify`, and `doctor`.
  - Focused suites passed after implementation:
    - `tests/config.test.ts`
    - `tests/status.test.ts`
    - `tests/create-task.test.ts`
    - `tests/verification.test.ts`
    - `tests/doctor.test.ts`
  - Full release checks passed:
    - `npm run lint`
    - `npm run typecheck`
    - `npm test`
    - `npm run check:links`
    - `npm run build`
    - `node scripts/smoke-cli.mjs`
    - `npm run smoke:release`
    - `npx --yes projscan doctor --format markdown`
  - Dogfood verification report passed: `.agentloop/reports/2026-06-11-13-24-verification-report.md`.
  - Handoff summary: `.agentloop/handoffs/2026-06-11-13-26-pr-summary.md`.
- What worked well:
  - The fix keeps first-run setup explicit while making everyday commands easier for agents working in subdirectories.
- Improve:
  - Add broader nested-cwd smoke coverage later for `handoff`, `check-gates`, `policy`, and `install-agent`.

## 2026-06-11: Missing Config Setup Errors

- Task contract: `.agentloop/tasks/2026-06-11-return-clear-errors-when-agentloop-config-is-missing.md`
- Trigger:
  - The continued product pass found a setup UX bug: JSON-capable commands run before `init` could leak raw filesystem errors instead of a stable AgentLoop error.
  - Agents and scripts need parseable setup failures so they can tell the user to initialize the repo instead of parsing `ENOENT`.
- Implementation:
  - Normalized missing `agentloop.config.json` reads into `ConfigError`.
  - Kept upward workspace discovery and `init` behavior unchanged.
  - Updated configuration, status, task-contract docs, changelog, decisions, and backlog.
- Verification run:
  - Red focused tests failed first for missing config in the workspace loader, `status --json`, human `status`, and `create-task --json`.
  - Focused suites passed after implementation:
    - `tests/config.test.ts`
    - `tests/status.test.ts`
    - `tests/create-task.test.ts`
  - Full release checks passed:
    - `npm run lint`
    - `npm run typecheck`
    - `npm test`
    - `npm run check:links`
    - `npm run build`
    - `node scripts/smoke-cli.mjs`
    - `npm run smoke:release`
    - `npx --yes projscan doctor --format markdown`
  - Dogfood verification report passed: `.agentloop/reports/2026-06-11-13-41-verification-report.md`.
  - Handoff summary: `.agentloop/handoffs/2026-06-11-13-43-pr-summary.md`.
- What worked well:
  - The fix improves both human and automation paths without adding setup side effects.
- Improve:
  - Add a small CLI smoke case for uninitialized `status --json` later so the behavior is covered outside unit tests.

## 2026-06-11: Task Command Markdown Safety

- Task contract: `.agentloop/tasks/2026-06-11-harden-task-command-markdown-output.md`
- Trigger:
  - The continued hardening pass found that `agentloop task` lifecycle output and `task doctor` diagnostics still rendered local task values raw.
  - Backticks in task titles, statuses, paths, messages, or recommendations could make reviewer-facing Markdown harder to read.
- Implementation:
  - Wrapped `task list`, `task current`, `task set`, `task status`, `task archive`, and `task doctor` human-output values with the shared inline-code formatter.
  - Kept JSON output and task state behavior unchanged.
  - Added regression coverage for task titles, paths, statuses, and recommendations containing backticks.
- Verification run:
  - Red focused tests failed first in `tests/task-state.test.ts` for raw lifecycle output and raw task-doctor output.
  - Focused suite passed after implementation:
    - `npm test -- tests/task-state.test.ts`
  - Dogfood verification initially produced `.agentloop/reports/2026-06-11-19-33-verification-report.md` with one false timeout in the aggregate invalid-config task subcommand test.
  - The test now uses the shared CLI subprocess timeout per command and an explicit aggregate timeout for the eight-command loop.
  - Dogfood verification passed after the timeout fix: `.agentloop/reports/2026-06-11-19-46-verification-report.md`.
  - Handoff summary: `.agentloop/handoffs/2026-06-11-19-54-pr-summary.md`.
- What worked well:
  - The shared Markdown formatter made the fix small and consistent with recent doctor, gates, status, and release-output hardening.
- Improve:
  - Continue scanning remaining human-output surfaces such as badge/report write confirmations for raw path values.

## 2026-06-11: CLI Write Confirmation Markdown Safety

- Task contract: `.agentloop/tasks/2026-06-11-harden-cli-write-confirmation-output.md`
- Trigger:
  - The continued hardening pass found raw generated paths and status/message values in human write-confirmation output.
  - These outputs are commonly pasted into handoffs and CI logs, so backticks in local paths should not break Markdown.
- Implementation:
  - Wrapped human confirmation values for `create-task`, `verify`, `summarize`/`handoff`, `report`, `badge`, `ci-summary`, `release-notes`, and `install-agent`.
  - Kept JSON output and artifact write behavior unchanged.
  - Added regression coverage with backticks in generated paths and confirmation values.
- Verification run:
  - Red focused suites failed first across the affected command tests.
  - Focused suites passed after implementation:
    - `npm test -- tests/create-task.test.ts tests/verification.test.ts tests/handoff.test.ts tests/html-report.test.ts tests/badge.test.ts tests/ci-summary.test.ts tests/release-notes.test.ts tests/agent-installation.test.ts`
  - Dogfood verification passed: `.agentloop/reports/2026-06-11-20-16-verification-report.md`.
  - Handoff summary: `.agentloop/handoffs/2026-06-11-20-22-pr-summary.md`.
- What worked well:
  - The shared inline-code formatter kept the implementation mechanical and consistent.
- Improve:
  - Continue scanning non-write human output in lower-traffic commands before the 0.28.0 batch release.

## 2026-06-11: npm Status Registry Error Markdown Safety

- Task contract: `.agentloop/tasks/2026-06-11-harden-npm-status-registry-error-markdown.md`
- Trigger:
  - The continued roadmap hardening pass found that `agentloop npm-status` still rendered npm registry stderr directly into Markdown.
  - Backticks or newlines in npm output could corrupt reviewer-facing registry status reports even though package and version labels were already safe.
- Implementation:
  - Added a regression using a fake npm failure with a backtick and newline in stderr.
  - Rendered registry errors as one Markdown-safe inline-code value in human Markdown output.
  - Preserved the exact `source.error` string in structured JSON output.
- Verification run:
  - Red focused test failed first in `tests/npm-status.test.ts` because the registry error was raw Markdown.
  - Focused suite passed after implementation:
    - `npm test -- tests/npm-status.test.ts`
  - Broader local checks passed:
    - `git diff --check`
    - `npm run lint`
    - `npm run typecheck`
    - `npm run check:links`
    - `npx --yes projscan doctor --format markdown`
    - `npx pnpm@10.12.1 audit --prod`
    - `npm test`
    - `npm run build`
    - `node scripts/smoke-cli.mjs`
    - `npm run smoke:release`
  - Dogfood verification passed: `.agentloop/reports/2026-06-11-20-36-verification-report.md`.
  - Handoff summary: `.agentloop/handoffs/2026-06-11-20-44-pr-summary.md`.
- What worked well:
  - The existing shared inline-code helper made the presentation fix small.
  - Keeping JSON exact while normalizing human Markdown keeps both automation and reviewer readability intact.
- Improve:
  - Continue scanning generated verification report task-context fields, which still include some raw task metadata.

## 2026-06-11: Verification Task Context Markdown Safety

- Task contract: `.agentloop/tasks/2026-06-11-harden-verification-task-context-markdown.md`
- Trigger:
  - The roadmap hardening pass found that verification reports still rendered task context path, title, task type, and status directly into Markdown.
  - Backticks in task filenames or metadata could corrupt the evidence section even though command labels and CI metadata were already safe.
- Implementation:
  - Added a regression task fixture with backticks in the task path, title, type, and status.
  - Rendered readable task-context values with the shared inline-code formatter.
  - Rendered unavailable task-context paths and statuses safely too.
- Verification run:
  - Red focused test failed first in `tests/verification.test.ts` for raw task-context metadata.
  - Focused suite passed after implementation:
    - `npm test -- tests/verification.test.ts`
  - Broader local checks passed:
    - `git diff --check`
    - `npm run lint`
    - `npm run typecheck`
    - `npm run check:links`
    - `npx --yes projscan doctor --format markdown`
    - `npx pnpm@10.12.1 audit --prod`
    - `npm test`
    - `npm run build`
    - `node scripts/smoke-cli.mjs`
    - `npm run smoke:release`
  - Dogfood verification passed: `.agentloop/reports/2026-06-11-20-58-verification-report.md`.
  - Handoff summary: `.agentloop/handoffs/2026-06-11-21-06-pr-summary.md`.
- What worked well:
  - The same shared formatter now covers verification command labels, CI metadata, and task context consistently.
- Improve:
  - Continue scanning lower-traffic Markdown outputs for raw local values before the 0.28.0 release batch.

## 2026-06-11: Verification Report Metadata Markdown Safety

- Task contract: `.agentloop/tasks/2026-06-11-harden-verification-report-metadata-markdown.md`
- Trigger:
  - The roadmap hardening pass found that verification report top-level metadata still rendered repo and Git values directly into Markdown.
  - A local repo folder or branch containing backticks could corrupt reviewer-facing evidence.
- Implementation:
  - Added a regression using a temporary repo directory with a backtick in its basename.
  - Rendered timestamp, repo, branch, commit, and working-tree values with the shared inline-code formatter.
  - Kept `Overall status` plain so downstream AgentLoop parsers keep reading existing and new reports.
- Verification run:
  - Red focused test failed first in `tests/verification.test.ts` because report metadata values were raw Markdown.
  - Focused suite passed after implementation:
    - `npm test -- tests/verification.test.ts`
  - Broader local checks passed:
    - `git diff --check`
    - `npm run lint`
    - `npm run typecheck`
    - `npm run check:links`
    - `npx --yes projscan doctor --format markdown`
    - `npx pnpm@10.12.1 audit --prod`
    - `npm test`
    - `npm run build`
    - `node scripts/smoke-cli.mjs`
    - `npm run smoke:release`
  - Dogfood verification passed: `.agentloop/reports/2026-06-11-21-22-verification-report.md`.
  - Handoff summary: `.agentloop/handoffs/2026-06-11-21-29-pr-summary.md`.
- What worked well:
  - Preserving `Overall status` as a parseable enum avoided unnecessary downstream parser churn.
- Improve:
  - Continue scanning `task-contract` and user-authored Markdown generation boundaries separately; those files intentionally contain user prose and need different rules than evidence summaries.

## 2026-06-11: PR Summary Task Context Markdown Safety

- Task contract: `.agentloop/tasks/2026-06-11-harden-pr-summary-task-metadata-markdown.md`
- Trigger:
  - The roadmap hardening pass found that PR summaries and handoffs still rendered the top task title directly into Markdown.
  - A task title containing backticks could corrupt reviewer-facing handoff metadata even though changed-file paths were already safe.
- Implementation:
  - Added a red regression in `tests/pr-summary.test.ts` for a task title containing backticks.
  - Rendered the top `Task context` value with the shared inline-code formatter.
  - Updated the handoff regression expectation because `handoff` shares the PR summary renderer.
  - Kept verification status text plain so `Overall status: pass|fail|not-run` remains parseable.
- Verification run:
  - Red focused test failed first in `tests/pr-summary.test.ts` because the task title was raw Markdown.
  - Focused suites passed after implementation:
    - `npm test -- tests/pr-summary.test.ts`
    - `npm test -- tests/pr-summary.test.ts tests/handoff.test.ts`
  - Broader local checks passed:
    - `git diff --check`
    - `npm run lint`
    - `npm run typecheck`
    - `npm run check:links`
    - `npx --yes projscan doctor --format markdown`
    - `npx pnpm@10.12.1 audit --prod`
    - `npm test`
    - `npm run build`
    - `node scripts/smoke-cli.mjs`
    - `npm run smoke:release`
  - Dogfood verification passed: `.agentloop/reports/2026-06-11-21-45-verification-report.md`.
  - Handoff summary: `.agentloop/handoffs/2026-06-11-21-53-pr-summary.md`.
- What worked well:
  - The shared formatter kept the behavior change to one renderer line.
  - The full suite caught the shared handoff expectation that the focused PR summary test alone did not cover.
- Improve:
  - Continue looking for remaining lower-traffic Markdown outputs that mix local values with reviewer-facing evidence.

## 2026-06-11: PR Summary Diff Stat Markdown Safety

- Task contract: `.agentloop/tasks/2026-06-11-harden-pr-summary-diff-stat-markdown.md`
- Trigger:
  - The roadmap hardening pass found that `git diff --stat` output was still inserted directly under the PR summary `Diff Stats` section.
  - Diff stat text can include repo paths or punctuation that should be treated as evidence text, not Markdown structure.
- Implementation:
  - Added a red regression in `tests/pr-summary.test.ts` for diff stat text containing backticks and a triple-backtick run.
  - Rendered non-empty diff stats inside the shared adaptive `text` code fence.
  - Preserved the existing trimmed diff-stat behavior and kept `No diff stats available.` as plain fixed copy.
- Verification run:
  - Red focused test failed first in `tests/pr-summary.test.ts` because diff stats were raw Markdown.
  - Focused suites passed after implementation:
    - `npm test -- tests/pr-summary.test.ts`
    - `npm test -- tests/pr-summary.test.ts tests/handoff.test.ts`
  - Broader local checks passed:
    - `git diff --check`
    - `npm run lint`
    - `npm run typecheck`
    - `npm run check:links`
    - `npx --yes projscan doctor --format markdown`
    - `npx pnpm@10.12.1 audit --prod`
    - `npm test`
    - `npm run build`
    - `node scripts/smoke-cli.mjs`
    - `npm run smoke:release`
  - Dogfood verification passed: `.agentloop/reports/2026-06-11-22-05-verification-report.md`.
  - Handoff summary: `.agentloop/handoffs/2026-06-11-22-12-pr-summary.md`.
- What worked well:
  - The final handoff visibly confirmed the new fenced diff-stat section.
- Improve:
  - Continue scanning remaining release and report surfaces for raw multi-line command or Git output.

## 2026-06-11: Release Note Commit Markdown Safety

- Task contract: `.agentloop/tasks/2026-06-11-harden-release-note-commit-markdown.md`
- Trigger:
  - The roadmap hardening pass found that `agentloop release-notes` rendered Git commit subjects directly into Markdown.
  - Commit subjects can include backticks or Markdown-looking syntax, so release notes should treat them as evidence values.
- Implementation:
  - Added a red regression in `tests/release-notes.test.ts` using a real temp Git repo with commit subject `Add \`release\` hook`.
  - Rendered commit subjects with the shared inline-code formatter.
  - Preserved raw commit subjects in the structured `commits` array and kept the empty commits fallback as fixed plain text.
- Verification run:
  - Red focused test failed first in `tests/release-notes.test.ts` because the commit subject was raw Markdown.
  - Focused suite passed after implementation:
    - `npm test -- tests/release-notes.test.ts`
  - Broader local checks passed:
    - `git diff --check`
    - `npm run lint`
    - `npm run typecheck`
    - `npm run check:links`
    - `npx --yes projscan doctor --format markdown`
    - `npx pnpm@10.12.1 audit --prod`
    - `npm test`
    - `npm run build`
    - `node scripts/smoke-cli.mjs`
    - `npm run smoke:release`
  - Dogfood verification passed: `.agentloop/reports/2026-06-11-22-28-verification-report.md`.
  - Handoff summary: `.agentloop/handoffs/2026-06-11-22-37-pr-summary.md`.
- What worked well:
  - The existing shared inline-code helper made release-note commit hardening a one-line renderer change.
- Improve:
  - Continue scanning release-note changelog/fallback boundaries separately; changelog content is authored Markdown and should not be blindly escaped.

## 2026-06-11: Release Note Missing Ref Markdown Safety

- Task contract: `.agentloop/tasks/2026-06-11-harden-release-note-missing-ref-markdown.md`
- Trigger:
  - The roadmap hardening pass found that `agentloop release-notes` rendered missing `--from` refs directly inside fallback Markdown copy.
  - Git refs are validated but can still contain backticks, so the rendered fallback should treat the ref as an evidence value.
- Implementation:
  - Added a red regression in `tests/release-notes.test.ts` with missing ref `v1.2.2\`missing`.
  - Rendered only the requested missing ref with the shared inline-code formatter.
  - Preserved raw structured `fallbackReason` data and kept the fixed no-previous-tag fallback as plain prose.
- Verification run:
  - Red focused test failed first in `tests/release-notes.test.ts` because the missing ref was raw Markdown.
  - Focused suite passed after implementation:
    - `npm test -- tests/release-notes.test.ts`
  - Broader local checks passed:
    - `git diff --check`
    - `npm run lint`
    - `npm run typecheck`
    - `npm run check:links`
    - `npx --yes projscan doctor --format markdown`
    - `npx pnpm@10.12.1 audit --prod`
    - `npm test`
    - `npm run build`
    - `node scripts/smoke-cli.mjs`
    - `npm run smoke:release`
  - Dogfood verification passed: `.agentloop/reports/2026-06-11-22-54-verification-report.md`.
  - Handoff summary: `.agentloop/handoffs/2026-06-11-23-03-pr-summary.md`.
- What worked well:
  - Keeping the raw fallback reason in JSON avoided automation churn while improving Markdown safety.
- Improve:
  - Continue leaving authored changelog sections untouched unless a future task defines a more precise boundary.

## 2026-06-11: Policy Command Markdown Safety

- Task contract: `.agentloop/tasks/2026-06-11-harden-policy-command-human-markdown.md`
- Trigger:
  - The roadmap hardening pass found that `agentloop policy list/status` rendered local policy titles, statuses, and paths directly into Markdown.
  - Policy titles come from repo-local Markdown headings, and paths can contain backticks, so the command should treat those values as evidence, not trusted Markdown.
- Implementation:
  - Added a red regression in `tests/policy.test.ts` using a policy heading and filename containing backticks.
  - Rendered policy list/status titles, statuses, and paths with the shared inline-code formatter.
  - Preserved JSON output and raw `agentloop policy show` document output.
- Verification run:
  - Red focused test failed first in `tests/policy.test.ts` because the policy title/path were raw Markdown.
  - Focused suite passed after implementation:
    - `npm test -- tests/policy.test.ts`
  - Broader local checks passed:
    - `git diff --check`
    - `npm run lint`
    - `npm run typecheck`
    - `npm run check:links`
    - `npx --yes projscan doctor --format markdown`
    - `npx pnpm@10.12.1 audit --prod`
    - `npm test`
    - `npm run build`
    - `node scripts/smoke-cli.mjs`
    - `npm run smoke:release`
  - Dogfood verification passed: `.agentloop/reports/2026-06-11-23-19-verification-report.md`.
  - Handoff summary: `.agentloop/handoffs/2026-06-11-23-28-pr-summary.md`.
- What worked well:
  - `policy show` staying raw made the boundary clear: list/status are evidence output, show is document output.
- Improve:
  - The next product layer should turn these scattered evidence commands into one acceptance command: `agentloop ship`.

## 2026-06-12: Local Acceptance Layer Commands

- Task contract: `.agentloop/tasks/2026-06-11-build-local-acceptance-layer-commands.md`
- Trigger:
  - The product direction shifted from toolkit primitives toward a local acceptance layer for agent-generated code.
  - The new core promise is: make agent-generated code reviewable, verifiable, and merge-ready.
- Implementation:
  - Added deterministic review-readiness scoring.
  - Added `agentloop ship` to compose task, Git, verification, gates, handoff, and risk evidence into a ship report.
  - Added `agentloop prepare-pr` for PR title/body generation and GitHub-comment Markdown.
  - Added `.agentloop/runs/`, `runs`, `show-run`, and `intent <file>`.
  - Added read-only `maintainer-check`.
  - Updated README, CLI reference, GitHub Actions docs, end-to-end example, completions, smoke tests, changelog, decisions, backlog, and final handoff.
- Verification run:
  - Red tests failed first for missing `readiness-score`, `ship`, `prepare-pr`, `runs`, and `maintainer-check`.
  - Focused tests passed:
    - `npm test -- tests/readiness-score.test.ts tests/ship.test.ts tests/prepare-pr.test.ts tests/runs.test.ts tests/maintainer-check.test.ts`
  - Broader local checks passed:
    - `git diff --check`
    - `npm run lint`
    - `npm run typecheck`
    - `npm run check:links`
    - `npx --yes projscan doctor --format markdown`
    - `npx pnpm@10.12.1 audit --prod`
    - `npm test`
    - `npm run build`
    - `node scripts/smoke-cli.mjs`
    - `npm run smoke:release`
  - Dogfood verification passed: `.agentloop/reports/2026-06-11-23-57-verification-report.md`.
  - Dogfood ship report: `.agentloop/reports/2026-06-12-00-04-ship-report.md`.
  - Dogfood run ledger entry: `.agentloop/runs/2026-06-12-00-04-ship/`.
  - Dogfood PR summary: `.agentloop/handoffs/2026-06-12-00-04-pr-summary.md`.
  - Dogfood PR description: `.agentloop/handoffs/2026-06-12-00-04-pr-description.md`.
  - Dogfood maintainer-check returned `warn` because the change set is broad.
- What worked well:
  - `ship` gave one acceptance-layer report instead of forcing agents to manually connect status, gates, handoff, and verification evidence.
  - `prepare-pr --github-comment` produced CI-postable Markdown without token handling inside AgentLoopKit.
- Improve:
  - Consider a future `ship --no-handoff` or `ship --reuse-handoff` mode if users want strictly read-only scoring.
  - Consider ledger support for explicit `verify` and `handoff` runs after the `ship` flow settles.

## 2026-06-12: MCP Review Context Snapshot

- Task contract: `.agentloop/tasks/2026-06-12-expose-review-context-through-mcp.md`
- Trigger:
  - The MCP server had strong read-only primitives, but MCP clients still had to orchestrate several tool calls to understand review readiness before continuing agent work.
  - The product direction is shifting toward AgentLoopKit as the local acceptance layer for agent-generated code.
- Implementation:
  - Added read-only MCP `agentloop_review_context`.
  - The payload combines status, review gates, policy status, artifact inventory, recent run summaries, latest ship score, and an explicit safety block.
  - The tool does not run commands, write files, read `.env` contents, call external APIs, or include full task/report/handoff/policy Markdown bodies.
  - Added regression coverage that rejects absolute temp-path leakage in the aggregate payload.
- Verification run:
  - Red focused test failed first in `tests/mcp-tools.test.ts` because `agentloop_review_context` was not listed and unknown at dispatch.
  - Focused suite passed after implementation:
    - `npm test -- tests/mcp-tools.test.ts`
  - Broader local checks passed:
    - `npm run typecheck`
    - `npm run lint`
    - `npm run check:links`
    - `git diff --check`
    - `npm run build`
    - `npm test`
    - `node scripts/smoke-cli.mjs`
    - `npx pnpm@10.12.1 audit --prod`
    - `npx --yes projscan doctor --format markdown`
    - `npm run smoke:release`
  - Dogfood verification passed: `.agentloop/reports/2026-06-12-07-22-verification-report.md`.
  - Dogfood runs:
    - `.agentloop/runs/2026-06-12-07-26-verify/`
    - `.agentloop/runs/2026-06-12-07-26-handoff/`
    - `.agentloop/runs/2026-06-12-07-26-ship/`
  - Dogfood handoff: `.agentloop/handoffs/2026-06-12-07-26-pr-summary.md`.
  - Dogfood ship report: `.agentloop/reports/2026-06-12-07-26-ship-report.md` with score `96`/100.
- What worked well:
  - The existing local readers made the MCP slice small and kept it read-only.
  - `ship` caught the medium-sized change set and made the scope warning explicit.
- Improve:
  - Avoid broad Prettier runs on long Markdown tables such as `.agentloop/backlog.md`; touched-file formatting can still create review noise.
  - Consider a future MCP `agentloop_review_context` option for smaller or larger snapshots only if real client usage shows the default is too broad.

## 2026-06-12: CLI Review Context Snapshot

- Task contract: `.agentloop/tasks/2026-06-12-expose-review-context-through-the-cli.md`
- Trigger:
  - Non-MCP agent sessions should not have to stitch together `status`, `check-gates`, `policy status`, `artifacts`, and `runs` just to understand review readiness.
  - The MCP review context was useful enough to expose as a normal local CLI command.
- Implementation:
  - Added shared `src/core/review-context.ts`.
  - Added `agentloop review-context` and `agentloop review-context --json`.
  - Rewired MCP `agentloop_review_context` to use the shared core builder.
  - Added shell completion, README, CLI reference, changelog, roadmap, final handoff, and smoke coverage.
  - Added a regression that ensures review-context output does not leak absolute temp repo paths from run metadata.
- Verification run:
  - Red focused tests failed first because `review-context` was missing from CLI help/dispatch and docs/completions.
  - A focused green run initially found a real path-normalization bug where absolute run metadata could appear as `../../...` on macOS temp paths.
  - Focused tests passed after the path guard:
    - `npm test -- tests/review-context.test.ts tests/cli-docs-drift.test.ts tests/mcp-tools.test.ts`
  - Broader local checks passed:
    - `npm run typecheck`
    - `npm run lint`
    - `npm run check:links`
    - `git diff --check`
    - `npm run build`
    - `node scripts/smoke-cli.mjs`
    - `npm test`
    - `npx pnpm@10.12.1 audit --prod`
    - `npx --yes projscan doctor --format markdown`
    - `npm run smoke:release`
  - Dogfood verification passed: `.agentloop/reports/2026-06-12-07-43-verification-report.md`.
  - Dogfood runs:
    - `.agentloop/runs/2026-06-12-07-47-verify/`
    - `.agentloop/runs/2026-06-12-07-47-handoff/`
    - `.agentloop/runs/2026-06-12-07-48-ship/`
  - Dogfood handoffs:
    - `.agentloop/handoffs/2026-06-12-07-47-pr-summary.md`
    - `.agentloop/handoffs/2026-06-12-07-48-pr-summary.md`
  - Dogfood ship report: `.agentloop/reports/2026-06-12-07-48-ship-report.md` with score `96`/100.
- What worked well:
  - The docs-drift test made the public command-surface work explicit.
  - The CLI test caught the path-normalization issue before commit.
- Improve:
  - Consider sharing the same path-normalization helper with all MCP run-summary tools, not only the review-context path.
  - Consider a `review-context --brief` mode only if the default Markdown proves too verbose in real agent sessions.

## 2026-06-12: Safe MCP Run Artifact Display Paths

- Task contract: `.agentloop/tasks/2026-06-12-harden-mcp-run-artifact-path-normalization.md`
- Trigger:
  - The CLI review-context tests found that absolute run metadata paths can render as `../..` paths when macOS temp path prefixes differ.
  - MCP run summary/detail/intent tools used their own local formatter and could expose the same kind of path.
- Implementation:
  - Added shared `toSafeDisplayPath` in `src/core/display-path.ts`.
  - Reused it in `src/core/review-context.ts` and `src/core/mcp-tools.ts`.
  - Added MCP regression coverage for an outside absolute verification report path in run metadata.
  - Kept run ledger files unchanged; only read/API display values changed.
- Verification run:
  - Red focused test failed first because MCP returned a `../agentloopkit-.../private-verification-report.md` path.
  - Focused tests passed after the shared formatter:
    - `npm test -- tests/mcp-tools.test.ts tests/review-context.test.ts`
  - Broader local checks passed:
    - `npm run typecheck`
    - `npm run lint`
    - `npm run check:links`
    - `git diff --check`
    - `npm run build`
    - `npm test`
    - `node scripts/smoke-cli.mjs`
    - `npx pnpm@10.12.1 audit --prod`
    - `npx --yes projscan doctor --format markdown`
    - `npm run smoke:release`
  - Dogfood verification passed: `.agentloop/reports/2026-06-12-08-02-verification-report.md`.
  - Dogfood runs:
    - `.agentloop/runs/2026-06-12-08-05-verify/`
    - `.agentloop/runs/2026-06-12-08-06-handoff/`
    - `.agentloop/runs/2026-06-12-08-06-ship/`
  - Dogfood handoff: `.agentloop/handoffs/2026-06-12-08-06-pr-summary.md`.
  - Dogfood ship report: `.agentloop/reports/2026-06-12-08-06-ship-report.md` with score `96`/100.
- What worked well:
  - The previous dogfood learning directly produced a small safety hardening task.
  - The regression checks both the unsafe path shape and the existing `.agentloop/...` display behavior.
- Improve:
  - Consider direct unit coverage for `toSafeDisplayPath` if more commands start using it.

## 2026-06-12: Safe Run Ledger Display Paths

- Task contract: `.agentloop/tasks/2026-06-12-sanitize-run-ledger-display-paths.md`
- Trigger:
  - The previous MCP hardening fixed consumer formatting, but the run ledger reader still returned raw stored paths.
  - Public `runs`, `show-run`, `intent`, MCP run tools, and `review-context` should not need separate path-safety logic.
- Implementation:
  - Moved run metadata path normalization into `src/core/runs.ts`.
  - New run records store display-safe task, artifact, and changed-file paths.
  - Older run records with absolute paths remain readable and are sanitized on read.
  - Simplified MCP and review-context run consumers so they use the ledger output directly.
- Verification run:
  - Red focused run `npm test -- tests/runs.test.ts` failed because `listRuns` returned raw absolute run metadata paths.
  - Green focused runs passed:
    - `npm test -- tests/runs.test.ts`
    - `npm test -- tests/runs.test.ts tests/mcp-tools.test.ts tests/review-context.test.ts`
  - Broader local checks passed:
    - `npm run typecheck`
    - `npm run lint`
    - `npm run check:links`
    - `git diff --check`
    - `npm run build`
    - `npm test`
    - `node scripts/smoke-cli.mjs`
    - `npx pnpm@10.12.1 audit --prod`
    - `npx --yes projscan doctor --format markdown`
    - `npm run smoke:release`
  - Dogfood verification passed: `.agentloop/reports/2026-06-12-08-35-verification-report.md`.
  - Dogfood runs:
    - `.agentloop/runs/2026-06-12-08-40-verify/`
    - `.agentloop/runs/2026-06-12-08-40-ship/`
  - Dogfood handoff: `.agentloop/handoffs/2026-06-12-08-40-pr-summary.md`.
  - Dogfood ship report: `.agentloop/reports/2026-06-12-08-40-ship-report.md` with score `96`/100.
- What worked well:
  - The dogfood trail from the MCP path bug identified the next boundary to harden.
  - Moving the behavior into the run reader reduced duplicate formatting in MCP and review-context code.
- Improve:
  - Keep treating run ledger paths as review evidence, not filesystem authority.

## 2026-06-12: README Demo Refresh And Public Artifact Path Output

- Task contract: `.agentloop/tasks/2026-06-12-refresh-readme-launch-copy-and-demo-assets.md`
- Trigger:
  - The README demo still showed an older CLI loop and did not explain the current acceptance-layer flow.
  - Dogfooding `ship --json` showed that public command results could still expose absolute local artifact paths after run ledger metadata was sanitized.
- Implementation:
  - Refreshed README launch copy, VHS terminal demo, and Playwright showcase screenshot around `create-task`, task-aware `verify`, `ship`, `prepare-pr`, `review-context`, `runs`, and `intent`.
  - Changed public CLI JSON and human write-confirmation output for generated artifacts to use repo-relative `.agentloop/...` paths.
  - Kept internal core write paths usable for implementation code and tests that need to read generated files.
  - Updated smoke tests and long-running subprocess tests so full-suite load does not create false timeout failures.
- Verification run:
  - Red focused tests failed first because `ship`, `prepare-pr`, and `verify` returned absolute local paths in public JSON.
  - Green focused path tests passed:
    - `npm test -- tests/ship.test.ts tests/prepare-pr.test.ts tests/verification.test.ts tests/handoff.test.ts tests/runs.test.ts`
  - Broader local checks passed:
    - `npm run lint`
    - `npm run typecheck`
    - `npm run check:links`
    - `git diff --check`
    - `npm run build`
    - `npm test`
    - `node scripts/smoke-cli.mjs`
    - `npm run smoke:release`
    - `npx pnpm@10.12.1 audit --prod`
    - `npx --yes projscan doctor --format markdown`
  - Dogfood verification passed: `.agentloop/reports/2026-06-12-09-34-verification-report.md`.
  - Dogfood runs:
    - `.agentloop/runs/2026-06-12-09-38-verify/`
    - `.agentloop/runs/2026-06-12-09-38-ship/`
  - Dogfood handoff: `.agentloop/handoffs/2026-06-12-09-38-pr-summary.md`.
  - Dogfood ship report: `.agentloop/reports/2026-06-12-09-38-ship-report.md` with score `92`/100.
- What worked well:
  - The README demo now matches the product's current review-readiness loop.
  - The built CLI smoke script caught the public path contract change before release prep.
- Improve:
  - Consider whether gate JSON should also offer a repo-redacted mode for `git.root`; this pass focused on generated artifact paths.

## 2026-06-12: Redacted Git-Root Output Mode

- Task contract: `.agentloop/tasks/archive/2026-06-12-add-redacted-path-output-mode.md`
- Trigger:
  - The previous public-path hardening made generated AgentLoop artifact paths repo-relative, but `status` and `check-gates` still showed the absolute local Git root.
  - Public PRs, issues, and CI logs need an easy way to hide the local machine path without changing default JSON for scripts.
- Implementation:
  - Added `--redact-paths` to `agentloop status` and `agentloop check-gates`.
  - Redacted only the public `git.root` value to `[git-root]`.
  - Kept `targetIsRoot`, branch, commit, changed-file counts, gate decisions, and repo-relative `.agentloop/...` paths intact.
  - Documented the flag in the README safety model, CLI reference, status docs, check-gates docs, release status, changelog, roadmap, final handoff, and internal backlog.
- Verification run:
  - Red focused tests failed first because the CLI did not recognize `--redact-paths`.
  - Focused regression tests passed after implementation:
    - `npm test -- tests/status.test.ts tests/check-gates.test.ts tests/cli-docs-drift.test.ts`
  - Broader local checks passed:
    - `npm run lint`
    - `npm run typecheck`
    - `npm run check:links`
    - `git diff --check`
    - `npm run build`
    - `npm test`
    - `node scripts/smoke-cli.mjs`
    - `npm run smoke:release`
    - `npx pnpm@10.12.1 audit --prod`
    - `npx --yes projscan doctor --format markdown`
  - Built CLI smoke confirmed:
    - `node dist/cli/index.js status --redact-paths`
    - `node dist/cli/index.js status --json --redact-paths`
    - `node dist/cli/index.js check-gates --redact-paths`
    - `node dist/cli/index.js check-gates --json --redact-paths`
  - Dogfood verification passed: `.agentloop/reports/2026-06-12-10-08-verification-report.md`.
  - Dogfood runs:
    - `.agentloop/runs/2026-06-12-10-14-verify/`
    - `.agentloop/runs/2026-06-12-10-14-ship/`
  - Dogfood handoff: `.agentloop/handoffs/2026-06-12-10-14-pr-summary.md`.
  - Dogfood ship report: `.agentloop/reports/2026-06-12-10-14-ship-report.md` with score `96`/100.
- What worked well:
  - The flag keeps existing script behavior stable while giving users a public-log-safe path.
  - The same regression shape now covers Markdown and JSON for both commands.
- Improve:
  - Consider a future global `--public` output mode only if more command families need the same redaction controls.

## 2026-06-12: Acceptance-Layer Redacted Git Roots

- Task contract: `.agentloop/tasks/archive/2026-06-12-redact-acceptance-layer-git-roots.md`
- Trigger:
  - `status` and `check-gates` gained `--redact-paths`, but dogfooding showed `ship --json` still returned the nested gate result with the absolute local Git root.
  - `prepare-pr` can refresh ship evidence, so it needed to accept the same redaction option for public PR-prep output.
- Implementation:
  - Added `--redact-paths` to `agentloop ship`.
  - Added `--redact-paths` to `agentloop prepare-pr`.
  - Propagated the option through `createShipReport` into `checkGates`.
  - Preserved default JSON behavior unless the user passes `--redact-paths`.
  - Updated README, CLI reference, changelog, release status, roadmap, final handoff, and backlog.
- Verification run:
  - Red focused tests failed first because both commands rejected `--redact-paths`.
  - Focused regression tests passed after implementation:
    - `npm test -- tests/ship.test.ts tests/prepare-pr.test.ts`
    - `npm test -- tests/ship.test.ts tests/prepare-pr.test.ts tests/cli-docs-drift.test.ts`
  - Broader local checks passed:
    - `npm run typecheck`
    - `npm run lint`
    - `npm run check:links`
    - `git diff --check`
    - `npm run build`
    - `node scripts/smoke-cli.mjs`
    - `npm run smoke:release`
    - `npx pnpm@10.12.1 audit --prod`
    - `npx --yes projscan doctor --format markdown`
  - Dogfood verification passed: `.agentloop/reports/2026-06-12-10-29-verification-report.md`.
  - Full Vitest inside dogfood verification passed with 48 files and 415 tests.
  - Built CLI redaction smoke passed:
    - `node dist/cli/index.js ship --json --redact-paths`
    - `node dist/cli/index.js ship --github-comment --redact-paths`
    - `node dist/cli/index.js prepare-pr --json --github-comment --redact-paths`
  - Dogfood runs:
    - `.agentloop/runs/2026-06-12-10-33-verify/`
    - `.agentloop/runs/2026-06-12-10-34-ship/`
    - `.agentloop/runs/2026-06-12-10-34-ship-2/`
  - Dogfood handoff: `.agentloop/handoffs/2026-06-12-10-34-pr-summary.md`.
  - Dogfood ship report: `.agentloop/reports/2026-06-12-10-34-ship-report.md`.
  - Archived completed task contract: `.agentloop/tasks/archive/2026-06-12-redact-acceptance-layer-git-roots.md`.
- What worked well:
  - The nested gate-output regression caught the exact place public JSON still leaked local machine paths.
  - The option keeps automation-compatible defaults intact.
- Improve:
  - If more commands need the same behavior, consolidate public-output redaction into a shared CLI option helper.

## 2026-06-12: Release Gate For 0.28.0

- Task contract: `.agentloop/tasks/2026-06-12-release-agentloopkit-0-28-0.md`
- Trigger:
  - The 0.28.0 batch was ready for the normal release gate.
  - The release needed package metadata, changelog, release notes, local verification, package proof, GitHub release, npm trusted publishing, GHCR, and MCP Registry proof.
- Implementation:
  - Updated `package.json` and `server.json` to `0.28.0`.
  - Moved `CHANGELOG.md` entries into a `0.28.0` section and left `Unreleased` empty.
  - Wrote concise public release notes at `.agentloop/handoffs/2026-06-12-10-59-release-notes.md`.
  - Corrected package metadata before packaging so the tarball exposes the CLI through `bin` and does not include an accidental `main` field.
- Verification run:
  - Dogfood verification passed: `.agentloop/reports/2026-06-12-11-00-verification-report.md`.
  - Full Vitest passed twice inside the release gate and npm dry-run:
    - `48` test files
    - `415` tests
  - Release task commands passed:
    - `npm run lint`
    - `npm run typecheck`
    - `npm test`
    - `npm run check:links`
    - `node scripts/prepublish-check.mjs`
    - `git diff --check`
    - `npm run build`
    - `npm run smoke:release`
    - `node scripts/smoke-cli.mjs`
    - `node dist/cli/index.js artifacts --json`
    - `npx --yes projscan doctor --format markdown`
  - Dogfood run ledger:
    - `.agentloop/runs/2026-06-12-11-07-verify/`
    - `.agentloop/runs/2026-06-12-11-08-ship/`
  - Dogfood handoff: `.agentloop/handoffs/2026-06-12-11-08-pr-summary.md`.
  - Dogfood ship report: `.agentloop/reports/2026-06-12-11-08-ship-report.md` with score `96`/100.
  - Packed tarball: `/tmp/agentloopkit-0.28.0.tgz`
  - Tarball SHA-256: `82049976512173bcef3edadadef3b5aead76ea29531d2d2f02deafa945dd900c`
  - `npm publish --access public --dry-run` passed and would publish `agentloopkit@0.28.0`.
  - GitHub release `v0.28.0`: <https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.28.0>
  - GitHub release asset digest matched the local tarball SHA-256.
  - CI run `27406452797`: pass.
  - CLI Smoke run `27406452854`: pass on Ubuntu, macOS, and Windows.
  - npm Publish workflow `27406646825`: pass, published `agentloopkit@0.28.0`.
  - Docker workflow `27406646793`: pass, published GHCR image `ghcr.io/abhiyoheswaran1/agentloopkit:0.28.0`.
  - GHCR manifest digest: `sha256:d3d4b708363f452c69a8fa701bc1909922bcc7b8ed7a066ba8e5f55664c3c410`.
  - MCP Registry workflow `27406850637`: pass.
  - `npm view agentloopkit version versions --json` reports latest `0.28.0`.
  - Clean temp-directory install smoke confirmed `agentloop`, `agentloopkit`, `init --dry-run --json`, and `mcp-server --help` from `agentloopkit@0.28.0`.
- What worked well:
  - The release task caught package metadata before the tag was cut.
  - The release notes stayed concise enough for GitHub while release evidence stayed local.
- Improve:
  - Add a future package-metadata test that fails if npm default fields such as `main: eslint.config.js` appear in the packed package.

## 2026-06-12: Post-Release Task Folder Cleanup

- Task contract: `.agentloop/tasks/archive/2026-06-12-archive-shipped-0-28-0-review-tasks.md`
- Trigger:
  - After `0.28.0`, the active task folder still contained shipped review-state tasks from the release batch.
  - `agentloop status --brief` recommended archiving the completed release task before new work.
- Implementation:
  - Archived the completed `0.28.0` release task.
  - Created a cleanup task to keep the action auditable.
  - Archived shipped `review` tasks from the `0.28.0` batch.
  - Kept `.agentloop/tasks/2026-06-10-add-scoop-winget-manifests.md` in place with status `deferred`.
- Verification run:
  - Dogfood verification passed: `.agentloop/reports/2026-06-12-11-34-verification-report.md`.
  - Full Vitest passed:
    - `48` test files
    - `415` tests
  - `npm run lint`, `npm run typecheck`, and `npm run build` passed through `agentloop verify`.
  - Task-specific commands passed:
    - `node dist/cli/index.js task doctor --json`
    - `node dist/cli/index.js status --brief`
  - Dogfood run ledger:
    - `.agentloop/runs/2026-06-12-11-38-verify/`
    - `.agentloop/runs/2026-06-12-11-38-ship/`
  - Dogfood handoff: `.agentloop/handoffs/2026-06-12-11-38-pr-summary.md`.
  - Dogfood ship report: `.agentloop/reports/2026-06-12-11-38-ship-report.md` with score `89`/100.
  - Final task hygiene:
    - `node dist/cli/index.js task doctor --json` reported `pass`.
    - `node dist/cli/index.js task list --json` shows only the deferred Scoop/WinGet task in the active task folder.
- What worked well:
  - The release evidence made it clear which review tasks had shipped and could move to the archive.
- Improve:
  - Consider a future `task archive --status review --before <release>` helper only if this cleanup repeats.

## 2026-06-12: Repeatable Dogfood Gate And Official Icon Assets

- Task contract: `.agentloop/tasks/2026-06-12-add-repeatable-dogfood-gate-and-official-icon-assets.md`
- Trigger:
  - AgentLoopKit dogfooding still depended on remembering a set of CLI checks.
  - README and generated launch visuals did not use the official icon assets from `docs/logo/`.
- Implementation:
  - Added `npm run dogfood` for a read-only local self-check.
  - Added `npm run dogfood:strict` for final handoff and release-prep gates.
  - Added `scripts/dogfood.mjs` with an allowlisted child-process environment.
  - Added Vitest coverage for the dogfood step plan, strict mode, and token-like env filtering.
  - Added the official icon assets under `docs/logo/`.
  - Updated README, contributor docs, and README screenshot sources to use the official icon.
  - Regenerated README screenshots with Playwright.
- Verification run:
  - Dogfood verification passed: `.agentloop/reports/2026-06-12-12-21-verification-report.md`.
  - Full Vitest passed:
    - `49` test files
    - `421` tests
  - Task-specific commands passed:
    - `npm test -- tests/dogfood-script.test.ts`
    - `npm run dogfood`
    - `npm run lint`
    - `npm run typecheck`
    - `npm test`
    - `npm run check:links`
    - `npm run build`
    - `npx --yes projscan doctor --format markdown`
  - `npm run dogfood:strict` passed after fresh verification evidence existed.
- What worked well:
  - Dogfooding immediately exposed that default dogfood should report stale evidence during active work without failing.
  - Strict mode still blocks when gate evidence is not ready.
  - The official SVG avoided the white-edge artifact risk in README visuals.
- Improve:
  - Consider teaching `maintainer-check` to distinguish package metadata script changes from dependency version changes.

## 2026-06-12: Release 0.28.1

- Task contract: `.agentloop/tasks/archive/2026-06-12-release-agentloopkit-0-28-1.md`
- Trigger:
  - The dogfood gate, official icon assets, and release-hygiene cleanup were ready for a small patch release.
- Implementation:
  - Bumped package and MCP server metadata to `0.28.1`.
  - Updated `CHANGELOG.md`.
  - Created GitHub release `v0.28.1` with `agentloopkit-0.28.1.tgz`.
  - Let npm trusted publishing release `agentloopkit@0.28.1`.
  - Verified Docker/GHCR and MCP Registry workflows.
- Verification run:
  - AgentLoop verification passed: `.agentloop/reports/2026-06-12-12-35-verification-report.md`.
  - Full Vitest passed:
    - `49` test files
    - `421` tests
  - Release-specific checks passed:
    - `npm run check:links`
    - `node scripts/prepublish-check.mjs`
    - `npm run smoke:release`
    - `npm run dogfood:strict`
    - `npx --yes projscan doctor --format markdown`
    - `git diff --check`
  - `agentloop ship` reported review readiness `100`/100.
  - npm latest is `0.28.1`.
  - Clean temp-directory npx smoke confirmed `npx --yes agentloopkit@0.28.1 version` and `npx --yes agentloopkit@0.28.1 init --dry-run --json`.
  - GHCR manifest for `ghcr.io/abhiyoheswaran1/agentloopkit:0.28.1` resolves with digest `sha256:d1a4c66e70d98cf6a18a261f513fce273b9c92727017c7ba910da391cfc11ea8`.
  - MCP Registry workflow `27410894807` passed.
- What worked well:
  - The release moved through the normal GitHub release, trusted npm publishing, GHCR, and MCP Registry path without manual npm publish.
  - The new dogfood gate gave a repeatable local self-check before the release.
- Improve:
  - Add a future release-status command that records npm, GitHub release, GHCR, and MCP proof into docs from one deterministic local report.

## 2026-06-12: Published Package Smoke Helper

- Task contract: `.agentloop/tasks/2026-06-12-add-published-package-smoke-helper.md`
- Trigger:
  - During `0.28.1` verification, running `npx agentloopkit@0.28.1` from inside the package repo showed that maintainer smoke commands can behave differently from real user temp-directory usage.
- Implementation:
  - Added `npm run smoke:published`.
  - Added `scripts/smoke-published-package.mjs`.
  - Added Vitest coverage for the smoke plan, cross-platform bin paths, token-like env filtering, dry-run output summaries, and installed-bin display labels.
  - Updated release docs and launch checklist to use the helper after npm publish.
- Verification run:
  - AgentLoop verification passed: `.agentloop/reports/2026-06-12-13-08-verification-report.md`.
  - Full Vitest passed:
    - `50` test files
    - `427` tests
  - `npm run smoke:published -- --version 0.28.1` passed and verified:
    - `npm view agentloopkit@0.28.1 version`
    - `npx --yes agentloopkit@0.28.1 version`
    - `npx --yes agentloopkit@0.28.1 init --dry-run --json`
    - installed `agentloop` and `agentloopkit` bin aliases
  - `npm run lint`, `npm run typecheck`, `npm run check:links`, `npm run build`, and ProjScan passed.
- What worked well:
  - Dogfooding exposed the difference between testing from the package repo and testing the real user path.
  - The helper now keeps post-release proof repeatable and concise.
- Improve:
  - Consider adding a future `agentloop release-status` report that gathers npm, GitHub release, GHCR, MCP, and published smoke proof in one command.

## 2026-06-12: Bulk Task Archive Mode

- Task contract: `.agentloop/tasks/archive/2026-06-12-add-bulk-task-archive-mode.md`
- Trigger:
  - Dogfooding release batches left finished task contracts in the active task folder because archiving them one at a time was easy to skip.
- Product-panel decision:
  - Lina wanted less cleanup friction after long agent sessions.
  - Maya and Samir limited the bulk path to `done` tasks and required a dry-run path so parked or active work is not swept accidentally.
  - Nora pushed for parseable JSON output so future scripts can preview the move list.
- Implementation:
  - Added `agentloop task archive --status done --dry-run`.
  - Added `agentloop task archive --status done`.
  - Preserved `agentloop task archive <path>` output and behavior.
  - Added focused CLI tests in `tests/task-archive.test.ts`.
  - Updated README, CLI reference, task docs, status docs, and repo harness guidance.
  - Used the new bulk archive command on this task after verification and handoff.
- Verification run:
  - AgentLoop verification passed: `.agentloop/reports/2026-06-12-13-30-verification-report.md`.
  - Run ledger entry: `.agentloop/runs/2026-06-12-13-31-verify`.
  - Ship report: `.agentloop/reports/2026-06-12-13-33-ship-report.md` with review readiness `96`/100.
  - Handoff summary: `.agentloop/handoffs/2026-06-12-13-34-pr-summary.md`.
  - PR description: `.agentloop/handoffs/2026-06-12-13-33-pr-description.md`.
  - Bulk archive dry-run reported `1` task and the actual archive moved `1` task.
  - Task-specific commands passed:
    - `npm test -- tests/task-archive.test.ts`
    - `npm run lint`
    - `npm run typecheck`
    - `npm run build`
    - `npx --yes projscan doctor --format markdown`
- What worked well:
  - TDD caught the missing CLI surface before implementation.
  - JSON output made the dry-run contract easy to assert.
  - The existing single-task archive helper kept path safety and active-task clearing in one place.
- Improve:
  - `agentloop verify --task --task-commands` also runs configured repo commands unless each `--no-*` flag is passed. A future `--only-task-commands` shortcut would make focused dogfood verification clearer.

## 2026-06-12: Archived Task Gate Evidence

- Task contract: `.agentloop/tasks/2026-06-12-accept-archived-task-evidence-in-gates.md`
- Trigger:
  - After the bulk archive task was verified, shipped, handed off, and archived, `npm run dogfood:strict` failed because `check-gates --strict` no longer saw task evidence.
- Root cause:
  - `check-gates` looked only at the active/latest open task under `.agentloop/tasks/`.
  - The latest ship run still referenced the task, but the task file had moved into `.agentloop/tasks/archive/`.
- Implementation:
  - Added a narrow gate fallback that resolves the latest run task to an existing active or archived Markdown contract when no active/open task remains.
  - Kept the failure path when no task evidence exists anywhere.
  - Added regression coverage in `tests/check-gates.test.ts`.
- Verification:
  - `npm test -- tests/check-gates.test.ts` passed with `13` tests.
  - AgentLoop verification passed: `.agentloop/reports/2026-06-12-13-48-verification-report.md`.
  - Run ledger entry: `.agentloop/runs/2026-06-12-13-51-verify`.
  - Ship report: `.agentloop/reports/2026-06-12-13-51-ship-report.md` with review readiness `92`/100.
  - Handoff summary: `.agentloop/handoffs/2026-06-12-13-51-pr-summary.md`.
  - PR description: `.agentloop/handoffs/2026-06-12-13-51-pr-description.md`.
- What worked well:
  - The new bulk archive flow immediately exposed the next gate edge case.
- Improve:
  - The final dogfood gate should stay part of every post-handoff cleanup check.

## 2026-06-12: Archived Task Maintainer Evidence

- Trigger:
  - After `check-gates` accepted archived task evidence, `npm run dogfood:strict` still failed because `maintainer-check` reported the task contract as missing.
- Root cause:
  - `maintainer-check` still used the current-task-only evidence lookup.
- Implementation:
  - Moved the archived latest-run task resolver into the shared evidence layer.
  - Updated `check-gates` and `maintainer-check` to use the same resolver.
  - Added regression coverage in `tests/maintainer-check.test.ts`.
- Verification:
  - `npm test -- tests/maintainer-check.test.ts` passed with `2` tests.
  - `npm test -- tests/check-gates.test.ts` passed with `13` tests.
  - `npm run dogfood:strict` passed after both completed tasks were archived.
- What worked well:
  - Running dogfood after archiving caught the second consumer that needed the same evidence behavior.
- Improve:
  - Consider making `maintainer-check` warnings easier to summarize in dogfood output when the gate still exits successfully.
