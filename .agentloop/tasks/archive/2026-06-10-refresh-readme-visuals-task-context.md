# Refresh README visuals for task-linked verification

- Created date: 2026-06-10
- Task type: docs
- Status: done

## Problem Statement
The README visuals exist, but they show older verification evidence and do not demonstrate task-linked verification reports. The VHS tape also installs a hardcoded local tarball version, which makes future visual refreshes brittle.

## Desired Outcome
Refresh the README visual sources and generated assets so they show current AgentLoopKit behavior: task context in verification reports, current test counts, and a reproducible CLI GIF that does not depend on a hardcoded package version.

## Constraints
- Keep the work local-first and docs/assets-only.
- Use Playwright for screenshots.
- Use VHS for the terminal GIF if the local toolchain renders successfully.
- Do not add runtime dependencies.
- Do not bump the package version.
- Do not change CLI behavior unless a rendering blocker exposes a real bug.

## Non-Goals
- No npm publish.
- No GitHub release.
- No new frontend app, cloud service, telemetry, or dashboard.
- No screenshots that claim real users or adoption.

## Assumptions
- README images use raw GitHub URLs, so committed assets must stay in `docs/assets/readme/`.
- The local build can be packed and installed into a clean VHS temp repository.

## Likely Files or Areas
- `README.md`
- `docs/assets/readme/README.md`
- `docs/assets/readme/showcase.html`
- `docs/assets/readme/verification.html`
- `docs/assets/readme/agentloopkit-cli.tape`
- `docs/assets/readme/*.png`
- `docs/assets/readme/*.gif`
- `.agentloop/backlog.md`
- `.agentloop/dogfood-log.md`

## Files or Areas Not to Touch
- `package.json` version
- npm publishing workflows
- CLI command implementation, unless rendering exposes a real bug

## Acceptance Criteria
- The verification screenshot shows task context and current command evidence.
- The showcase screenshot does not show stale test counts.
- The VHS tape installs the latest local packed tarball without hardcoding `0.21.0`.
- README asset instructions remain reproducible.
- Generated PNG assets are refreshed with Playwright.
- The terminal GIF is refreshed with VHS, or the exact local rendering blocker is recorded.

## Verification Commands
- npx playwright screenshot --viewport-size=1440,960 "file://$(pwd | sed 's/ /%20/g')/docs/assets/readme/showcase.html" docs/assets/readme/agentloopkit-showcase.png
- npx playwright screenshot --viewport-size=1440,960 "file://$(pwd | sed 's/ /%20/g')/docs/assets/readme/verification.html" docs/assets/readme/agentloopkit-verification.png
- npx pnpm@10.12.1 build
- vhs docs/assets/readme/agentloopkit-cli.tape
- npx pnpm@10.12.1 check:links
- npx projscan doctor --format markdown
- npx tsx src/cli/index.ts verify --task .agentloop/tasks/2026-06-10-refresh-readme-visuals-task-context.md

## Implementation Plan
- Update HTML screenshot sources for current verification/task-context behavior.
- Make the VHS tape install the latest packed local tarball.
- Regenerate Playwright screenshots.
- Regenerate the VHS GIF if the local toolchain works.
- Update README asset instructions if commands changed.
- Record dogfood evidence and generate a handoff.

## Risk Notes
- Binary asset churn can create large diffs, so keep the visual refresh scoped.
- VHS rendering depends on local terminal/font tooling and may fail independently from package correctness.

## Rollback Notes
Revert the README asset source files, regenerated PNG/GIF files, and AgentLoop dogfood artifacts from this task.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
