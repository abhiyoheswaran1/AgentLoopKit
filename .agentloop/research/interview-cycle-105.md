# Interview Cycle 105

## Context

AgentLoopKit `0.24.4` is published on npm and GitHub. The last release sequence exposed a release-process gap: tarball smoke checks were hand-written each time. That caught real issues, but one-off shell commands are easy to mistype and hard to review.

This cycle is simulated internal product-panel feedback, not real user research.

## Personas interviewed

- Open Source Maintainer
- Security Reviewer
- Principal Engineer
- Power User / Agentic Engineer
- Developer Experience Designer

## Feedback summary

The strongest signal is release trust. AgentLoopKit now publishes through GitHub trusted publishing, so the next weak link is the local release-candidate check before the tag exists.

## Raw simulated feedback

### Open Source Maintainer

- What they liked: npm and GitHub releases now line up.
- What confused them: Release smoke checks live in terminal history instead of the repo.
- What they would need before using it: One command they can run before publishing.
- What would make them recommend/star it: A release process that looks boring and repeatable.
- What would make them abandon it: npm READMEs or packaged artifacts drifting again.

### Security Reviewer

- What they liked: Recent releases avoid token handling and use trusted publishing.
- What confused them: Manual smoke commands make it hard to prove what was checked.
- What they would need before using it: A local script that states what it will not do.
- What would make them recommend/star it: A smoke script that blocks outside path reads and writes.
- What would make them abandon it: Any script that publishes, reads tokens, or dumps env data.

### Principal Engineer

- What they liked: The tests already cover the core CLI.
- What confused them: Release smoke behavior is duplicated in ad hoc shell.
- What they would need before using it: A small script with testable helpers.
- What would make them recommend/star it: Minimal dependencies and clear failure messages.
- What would make them abandon it: A release framework bigger than the product.

### Power User / Agentic Engineer

- What they liked: AgentLoopKit dogfoods task, verify, and handoff artifacts.
- What confused them: Agents cannot reliably repeat a human's previous smoke commands.
- What they would need before using it: A command agents can run and quote in handoffs.
- What would make them recommend/star it: Packed-package checks that match real `npx` usage.
- What would make them abandon it: Source-only checks that miss packed-package behavior.

### Developer Experience Designer

- What they liked: README visuals are generated, not manually recorded.
- What confused them: Demo refresh and package release can still drift.
- What they would need before using it: A release smoke check that includes packaged README pins.
- What would make them recommend/star it: A clean release loop: build, pack, smoke, publish, verify.
- What would make them abandon it: Stale install examples on npm.

## Product council debate

- Abhi: This is not glamorous, but it protects launch credibility.
- Maya: Keep it as a script, not a public CLI command.
- Elias: Put it in maintainer docs and launch checklist.
- Nora: Make failure output actionable.
- Samir: Block token reads, publishing, tags, GitHub calls, and env-file reads.
- Lina: Make it usable by agents in release handoffs.
- Tom: Real packed-package checks matter more than methodology prose.
- Rachel: Teams will trust the project more if releases are repeatable.

## Decision

Add `scripts/smoke-packed-release.mjs` and `npm run smoke:release`. The script builds, packs, runs the packed binary from isolated temp directories, checks safety guards, and verifies packaged README pins. Keep it local and maintainer-facing.

## Non-decisions

- Do not add a public `agentloop smoke-release` command.
- Do not publish, tag, call GitHub APIs, read npm tokens, or read `.env` files.
- Do not add a release framework or new runtime dependency.

## Resulting tasks

- Add tested release-smoke helper functions.
- Add the maintainer script.
- Add `smoke:release` to `package.json`.
- Document the command in maintainer release docs.
- Dogfood the script before the next release.

## Success criteria

- `npm run test -- tests/release-smoke.test.ts` passes.
- `npm run smoke:release` passes against the packed package.
- Maintainer docs mention the command and safety boundary.
- Future release handoffs can quote one command instead of a custom shell script.
