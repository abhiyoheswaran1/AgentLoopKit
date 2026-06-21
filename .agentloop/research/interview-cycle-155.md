# Interview Cycle 155

## Context

After adding untracked-file markers to `agentloop ship`, dogfooding showed the same review gap in deterministic summaries, handoffs, and HTML reports. Those surfaces also rendered Git's native diff stat, which omits untracked files.

This is simulated internal product-panel feedback plus dogfood observation. It is not real user research.

## Personas Interviewed

- Open Source Maintainer
- AI-Skeptical Senior Engineer
- Security Reviewer
- Dogfood Steward

## Feedback Summary

The panel preferred one shared path-only renderer over separate surface-specific fixes. Reviewers need consistent evidence, but AgentLoopKit should not inspect untracked file contents, invent line-level stats, or change the JSON changed-file contract used by automation.

## Product Council Debate

- Elias: Handoff and report readers should not need to cross-check Changed Files to learn that a new doc or source file exists.
- Tom: The marker must stay visibly different from Git's line-count diff stat so it does not imply a real diff.
- Samir: Reuse Git status entries only and continue excluding generated AgentLoop evidence churn.
- Lina: Keep JSON changed-file arrays and run-ledger changed-file evidence stable for scripts.
- Dogfood Steward: Use the source CLI for evidence while dogfooding AgentLoopKit itself, because the installed CLI can lag the current implementation.

## Decision

Move untracked-aware diff-stat rendering into shared Git core and reuse it in ship, summarize/handoff, and HTML report generation. The marker remains `path | untracked`.

## Non-Decisions

- Do not read untracked file contents.
- Do not synthesize full diffs or line counts.
- Do not change JSON changed-file arrays.
- Do not change run-ledger changed-file evidence.
- Do not include generated AgentLoop evidence churn in appended markers.
- Do not add release or publishing work.

## Success Criteria

- Deterministic handoff summaries include untracked non-evidence markers in Diff Stats.
- HTML reports include untracked non-evidence markers in Diff Stats.
- Ship reports continue to include untracked non-evidence markers through the shared helper.
- Focused summary, report, ship tests and typecheck pass.
