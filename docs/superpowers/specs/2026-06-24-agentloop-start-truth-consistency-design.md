# AgentLoop Start Truth Consistency Design

## Goal

Make `agentloop start` and `agentloop context pack` trustworthy when no current task is active. They must not present archived, terminal, deferred, or AgentFlight placeholder evidence as active implementation work.

## Problem

The evidence map can reuse latest run task evidence, including archived task contracts. That is useful for review, ship, and artifacts surfaces, but it is too permissive for the agent entry point. A clean repo after release cleanup can have no active task while the latest run still points to an archived task. In that state, Start and Context can label the archived task as active and route the agent toward `agentloop ship`.

## Approach

Keep the existing evidence-map fallback behavior for review surfaces, but add a stricter current-work evidence mode for Start and Context. Current-work mode accepts only a non-placeholder task that is not archived, terminal, or deferred. It may fall back to the newest open task contract. It must not fall back to archived latest-run evidence.

## Behavioral Contract

- `agentloop start` uses current-work task evidence.
- `agentloop context budget`, `context pack`, and `context show evidence-map:current` use current-work task evidence.
- `context show task:active` expands only a current-work task.
- No-current-task Start output keeps the active-task section explicit: no active task contract was found.
- No-current-task Context output records the absence instead of guessing scope.
- Existing review-oriented evidence-map consumers keep their current fallback unless they explicitly opt into current-work mode.

## Safety Boundary

The change remains read-only for Start and Context. It does not run verification, read changed file contents, read `.env` contents, call external services, intercept provider traffic, post comments, publish packages, create tags, bump versions, or mutate task state.

## Verification

Add regression tests for archived latest-run task evidence, archived active pointers, and no-current-task next actions. Run focused tests first, then unit, typecheck, docs hygiene, dogfood, and targeted performance/security checks.
