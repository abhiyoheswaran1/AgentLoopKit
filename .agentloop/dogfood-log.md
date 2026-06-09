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
