# Interview Cycle 154

## Context

During the create-task warning implementation, `agentloop ship` correctly listed a new untracked research file in Changed Files, but the Diff Stat block came from `git diff --stat` and omitted untracked files. This can make reviewer-facing evidence understate new non-evidence files.

This is simulated internal product-panel feedback plus dogfood observation. It is not real user research.

## Personas Interviewed

- Open Source Maintainer
- AI-Skeptical Senior Engineer
- Platform Engineer
- Dogfood Steward

## Feedback Summary

The panel preferred a compact marker over synthesized diffs. Reviewers need to see that new files exist, but AgentLoopKit should not read untracked file contents or invent line-level stats. The existing changed-file JSON should remain the source of truth for scripts.

## Product Council Debate

- Elias: Reviewer-facing ship evidence should not hide new docs or source files in the diff-stat section.
- Tom: A compact `path | untracked` marker is honest; fake insertion counts would be misleading.
- Samir: Do not read untracked file contents and do not expand generated AgentLoop evidence churn.
- Maya: Keep this local to ship report rendering unless other surfaces prove the same gap.
- Lina: Preserve JSON and run-ledger changed-file evidence exactly so agents do not need to handle a schema change.

## Decision

Append untracked non-evidence files to ship diff stats as `path | untracked`, while keeping Git's tracked-file diff stat output intact. Do not include generated AgentLoop evidence files in this appended diff-stat list.

## Non-Decisions

- Do not synthesize full file diffs.
- Do not read untracked file contents.
- Do not change JSON `changedFiles`.
- Do not redesign `prepare-pr` changed-file grouping.
- Do not add release or publishing work.

## Success Criteria

- Ship report Markdown diff stats include untracked non-evidence files.
- Tracked `git diff --stat` output remains present.
- JSON changed files and run changed-files evidence remain unchanged.
- Focused ship tests and typecheck pass.
