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
