---
name: Good first issue
about: Maintainer template for approachable contributor tasks
title: ''
labels: good first issue, help wanted
assignees: ''
---

## Goal

Describe the small outcome a contributor should deliver.

## Why This Is Approachable

- The expected files are named below.
- The change should not require product architecture decisions.
- The verification commands are listed.

## Suggested Files

- 

## Acceptance Criteria

- [ ] 

## Verification

```bash
npx pnpm@10.12.1 lint
npx pnpm@10.12.1 typecheck
npx pnpm@10.12.1 test
npx pnpm@10.12.1 build
npx projscan doctor --format markdown
```

## AgentLoopKit Handoff

- Task contract:
- Verification report:
- Handoff summary:

## Maintainer Notes

Keep this issue focused. If the task touches security, publishing, dependency policy, public APIs, or generated templates, remove the `good first issue` label.
