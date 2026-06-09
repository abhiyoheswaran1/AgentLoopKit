# Interview Cycle 33

Internal simulated feedback. Do not present this as real user research.

## Context

README, docs, examples, product-panel notes, and generated handoff files now form a large launch surface. CI runs code checks but does not catch broken local Markdown links.

## Personas interviewed

- Open Source Maintainer
- Open Source Contributor
- AI-Skeptical Senior Engineer
- Security Reviewer

## Feedback summary

The strongest signal is launch trust. A lightweight local link checker should catch missing repo files in Markdown without crawling the internet or adding dependencies.

## Raw simulated feedback

### Open Source Maintainer

- Liked: docs are now central to adoption.
- Confused: broken links would make the repo feel unfinished.
- Would need before using it: CI coverage for local doc links.
- Would recommend/star it if: the README and docs keep working as the repo changes.
- Would abandon it if: docs drift faster than code.

### Open Source Contributor

- Liked: contribution docs and examples are easy to browse.
- Confused: local links can break during refactors.
- Would need before using it: a simple script contributors can run.
- Would recommend/star it if: CI gives clear file and link errors.
- Would abandon it if: contributors need a heavy docs toolchain.

### AI-Skeptical Senior Engineer

- Liked: deterministic checks beat claims about polish.
- Confused: remote link checks can be flaky.
- Would need before using it: local-only validation.
- Would recommend/star it if: docs quality has the same discipline as tests.
- Would abandon it if: CI fails because a remote website is down.

### Security Reviewer

- Liked: no network calls and no credentials.
- Confused: a link checker might accidentally crawl URLs.
- Would need before using it: external links ignored by default.
- Would recommend/star it if: the script stays transparent and boring.
- Would abandon it if: the checker phones home or scans secrets.

## Product council debate

- Abhi: This is launch polish with low maintenance.
- Maya: Keep it small. No dependency and no full Markdown parser.
- Elias: CI should run it.
- Nora: Error messages need file, link text, and target.
- Samir: Ignore remote links. No network calls.
- Lina: Agents can use it before handoff.
- Tom: This is practical evidence, not methodology theater.
- Rachel: Teams trust docs that fail fast in CI.

## Decision

Add a local Markdown link checker with tests, an npm script, and a CI step.

## Non-decisions

- Do not validate remote URLs.
- Do not add a docs framework.
- Do not add dependencies.
- Do not parse every Markdown edge case.

## Resulting tasks

- Add failing tests for local link checking.
- Implement local Markdown link validation.
- Add `scripts/check-markdown-links.mjs`.
- Add `check:links` to `package.json`.
- Run the script in CI.

## Success criteria

- Missing local Markdown file links fail with useful messages.
- External links are ignored.
- Existing repo Markdown passes.
- CI runs the checker.
