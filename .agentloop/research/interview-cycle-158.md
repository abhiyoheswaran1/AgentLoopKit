# Interview Cycle 158

## Context

After `create-task` gained dirty-work and placeholder-section warnings, the public docs were updated but the generated `.agentloop/tasks/README.md` template still omitted those warning cases. Freshly initialized repos could therefore teach weaker task hygiene than the current product behavior.

This is simulated internal product-panel feedback plus dogfood observation. It is not real user research.

## Personas Interviewed

- Developer Experience Designer
- Security Reviewer
- Agentic Engineer Power User
- Open Source Maintainer

## Feedback Summary

The panel wanted the generated task guidance to mirror the runtime warning behavior. The right fix is concise documentation in the init template, not another command, gate, or cleanup workflow.

## Product Council Debate

- Nora: Fresh installs should explain the warnings where agents read task workflow instructions.
- Samir: The copy must say warnings are advisory and do not read dirty contents or clean files.
- Lina: Agents need the warning codes in generated docs so JSON automation can route them consistently.
- Elias: Keep the copy practical and avoid presenting simulated feedback as public evidence.

## Decision

Update the generated task README template and this repo's local task README so they mention dirty non-evidence file warnings and review-critical placeholder-section warnings.

## Non-Decisions

- Do not change `create-task` runtime behavior.
- Do not add new warning codes.
- Do not add new task-doctor diagnostics.
- Do not block task creation.
- Do not clean, stash, commit, archive, reset, delete, release, or publish.

## Success Criteria

- Fresh init writes task guidance that mentions dirty non-evidence file warnings.
- Fresh init writes task guidance that mentions review-critical placeholder-section warnings.
- The guidance says dirty warnings do not read contents, clean files, or block task creation.
