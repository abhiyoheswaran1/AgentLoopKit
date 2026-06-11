# Dogfood Log

Internal log of AgentLoopKit used on AgentLoopKit itself.

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
