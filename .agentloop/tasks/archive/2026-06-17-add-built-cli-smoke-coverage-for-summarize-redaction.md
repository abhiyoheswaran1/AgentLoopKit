# Add built CLI smoke coverage for summarize redaction

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
The packaged CLI smoke exercises summarize and handoff basics, and it separately proves handoff --redact-paths, but it does not yet prove the distributed summarize --write --write-run --json --redact-paths path writes redacted reviewer Markdown and JSON without leaking absolute local paths.

## Desired Outcome
The distribution guard and built CLI smoke script prove summarize --redact-paths redacts local absolute paths in JSON output and written summaries while preserving summary generation, run evidence, and existing handoff smoke coverage.

## Constraints
- Keep this scoped to built CLI smoke coverage and its distribution guard; do not change summarize or handoff runtime behavior unless the smoke exposes a real bug.
- Use TDD: add the distribution guard first, watch it fail, then update the smoke script.
- Do not bump versions, tag, publish, or alter release-channel files.

## Non-Goals
- No release prep, version cut, registry publication, dependency change, or GitHub Marketplace work.

## Assumptions
- summarize --redact-paths behavior already exists at source level; this task adds packaged smoke evidence.

## Likely Files or Areas
- tests/distribution-artifacts.test.ts
- scripts/smoke-cli.mjs

## Files or Areas Not to Touch
- package.json
- pnpm-lock.yaml
- CHANGELOG.md
- .github/workflows

## Acceptance Criteria
- A focused distribution-artifacts test fails before the smoke script covers summarize redaction and passes after implementation.
- scripts/smoke-cli.mjs runs summarize --write --write-run --json --redact-paths against the smoke repo and asserts outPath, run.id, written summary contents, and no smoke repo/git-root path leaks in JSON or Markdown.
- scripts/smoke-cli.mjs logs Summarize redaction smoke passed.
- Full distribution-artifacts tests, build, smoke, dogfood strict, maintenance check, AgentFlight verification, and ProjScan doctor pass before handoff.

## Verification Commands
- npm test -- tests/distribution-artifacts.test.ts -t "summarize redaction"
- npm test -- tests/distribution-artifacts.test.ts
- npx prettier --check tests/distribution-artifacts.test.ts scripts/smoke-cli.mjs
- git diff --name-only -- package.json pnpm-lock.yaml CHANGELOG.md .github/workflows
- npm run build
- node scripts/smoke-cli.mjs

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Remove the summarize redaction guard from tests/distribution-artifacts.test.ts and the summarize redaction smoke block from scripts/smoke-cli.mjs.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
