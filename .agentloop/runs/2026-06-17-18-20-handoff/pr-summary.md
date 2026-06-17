# PR Summary

- Generated: 2026-06-17-18-20
- Task context: `Mirror raw AgentFlight recovery in agent instructions`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `src/templates/agents/claude-code.md`
- M `src/templates/agents/codex.md`
- M `src/templates/agents/cursor.md`
- M `src/templates/agents/gemini-cli.md`
- M `src/templates/agents/generic.md`
- M `src/templates/agents/github-copilot-cli.md`
- M `src/templates/agents/opencode.md`
- M `tests/autonomous-dogfood.test.ts`
- AgentLoop evidence: `6` file(s) grouped under `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`.
- Full paths remain in JSON output and run-ledger evidence.

## Change Areas
### Source
- M `src/templates/agents/claude-code.md`
- M `src/templates/agents/codex.md`
- M `src/templates/agents/cursor.md`
- M `src/templates/agents/gemini-cli.md`
- M `src/templates/agents/generic.md`
- M `src/templates/agents/github-copilot-cli.md`
- M `src/templates/agents/opencode.md`

### Tests
- M `tests/autonomous-dogfood.test.ts`

### AgentLoop Evidence
- AgentLoop evidence: `6` file(s) grouped under `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`.
- Full paths remain in JSON output and run-ledger evidence.

## Diff Stats
```text
src/templates/agents/claude-code.md        |  1 +
 src/templates/agents/codex.md              |  1 +
 src/templates/agents/cursor.md             |  1 +
 src/templates/agents/gemini-cli.md         |  1 +
 src/templates/agents/generic.md            |  1 +
 src/templates/agents/github-copilot-cli.md |  1 +
 src/templates/agents/opencode.md           |  1 +
 tests/autonomous-dogfood.test.ts           | 12 ++++++++++++
 8 files changed, 19 insertions(+)
```

## Behaviour Changed
- Review changed files and task contract to confirm intended behavior.

## Review Focus
- Review source changes for behavior and public API impact.
- Check tests cover the changed behavior.
- Review AgentLoop artifacts for accurate task, verification, and handoff evidence.

## Verification Performed
- Overall status: pass

## Verification Not Performed
- Check the verification report for skipped commands.

## Risks
- Re-check protected files such as migrations, secrets, auth, billing, deployment, and public APIs before merge.

## Rollback Notes
- Revert the changed files or revert the merge commit if this lands as a PR.

## Reviewer Checklist
- [ ] Acceptance criteria match the task contract.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk areas have been reviewed.
- [ ] Rollback plan is clear.

## Follow-Ups
- Capture any deferred work in ROADMAP.md or a new task contract.
