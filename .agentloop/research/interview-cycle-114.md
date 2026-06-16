# Interview Cycle 114

## Context

AgentLoopKit already preserves same-minute generated task contracts, verification reports, ship reports, PR summaries, CI summaries, release notes, and run evidence. During a dogfood audit, `prepare-pr --write` still used an exact generated PR description path, so a fast rerun could replace a reviewer-facing draft.

This is simulated internal product-panel feedback, not real user research.

## Personas interviewed

- Open Source Maintainer
- Claude Code Power User
- AI-Skeptical Senior Engineer
- Platform Engineer

## Feedback summary

The strongest signal was trust: generated PR descriptions are review evidence, and evidence should not disappear because an agent reran a command in the same minute. The fix should be boring and invisible unless a collision happens.

## Raw simulated feedback

### Open Source Maintainer

- What they liked: PR descriptions are generated from local evidence and can be reviewed without tokens or network calls.
- What confused them: A rerun replacing the first draft would make it hard to compare what changed between agent attempts.
- What they would need before using it: Stable artifact history for review notes.
- What would make them recommend/star it: Small safety behaviors that protect evidence without extra setup.
- What would make them abandon it: Silent replacement of reviewer-facing files.

### Claude Code Power User

- What they liked: `prepare-pr --write` gives a copyable draft after `ship`.
- What confused them: Minute-based filenames look deterministic, but repeated agent loops can happen inside one minute.
- What they would need before using it: Reruns that preserve prior drafts automatically.
- What would make them recommend/star it: The CLI behaving well during long autonomous loops.
- What would make them abandon it: Losing a prior draft after an agent retry.

### AI-Skeptical Senior Engineer

- What they liked: The fix is deterministic and does not claim to measure code quality.
- What confused them: Why an evidence tool would ever overwrite evidence by default.
- What they would need before using it: Proof through regression tests.
- What would make them recommend/star it: Conservative defaults that make review safer.
- What would make them abandon it: More methodology without concrete artifact safety.

### Platform Engineer

- What they liked: Numeric suffixes match existing local artifact behavior.
- What confused them: Whether this should introduce retention or cleanup policy.
- What they would need before using it: Existing cleanup and artifact inventory commands are enough for now.
- What would make them recommend/star it: Consistent behavior across generated artifacts.
- What would make them abandon it: A new database or global state just for filenames.

## Product council debate

- Abhi: Keep the wedge clear: reviewable, verifiable, merge-ready. Evidence preservation belongs in the core.
- Maya: Use the existing unique artifact allocator. No registry, no new option, no broad refactor.
- Elias: Changelog and CLI reference are enough. Do not turn this into marketing copy.
- Nora: The terminal behavior should feel normal. Only show suffixes when necessary.
- Samir: Silent overwrite of review evidence is a safety bug.
- Lina: Long-running agents rerun commands quickly. This is exactly where AgentLoopKit should be disciplined.
- Tom: This is practical value, not AI ceremony.
- Rachel: Consistent evidence history helps teams trust agent-assisted PRs later.

## Decision

Change default generated `prepare-pr --write` output to allocate a numeric suffix when the minute-based PR description path already exists.

## Non-decisions

- Do not add a `prepare-pr --out` flag.
- Do not change PR body formatting.
- Do not change ship scoring or run-ledger schema.
- Do not add retention policy in this slice.
- Do not release or publish.

## Resulting tasks

- Add a regression test that runs `prepare-pr --write` twice with the same timestamp.
- Use the existing collision-safe output artifact allocator in `prepare-pr`.
- Update CLI reference, changelog, dogfood log, and backlog.
- Run focused, static, full, and dogfood verification.

## Success criteria

- The first PR description remains intact after a same-minute rerun.
- The second generated PR description gets a deterministic numeric suffix.
- Fresh ship evidence reuse still works.
- Tests and dogfood gates pass.
