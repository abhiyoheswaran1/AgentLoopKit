# Dogfood Log

Internal log of AgentLoopKit used on AgentLoopKit itself.

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
