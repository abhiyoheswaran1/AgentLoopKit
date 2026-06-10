# Interview Cycle 73

## Context

AgentLoopKit `0.18.0` added `agentloop policy status`, which reports local policy files as `current`, `modified`, `missing`, or `extra`. The command is read-only and compares local Markdown with bundled templates. The remaining gap is guidance: maintainers need to know what to do with those statuses when their repo intentionally customizes policy text.

## Personas interviewed

- Platform Engineer
- Open Source Maintainer
- Security Reviewer
- Power User / Agentic Engineer
- AI-Skeptical Senior Engineer

## Feedback summary

The strongest signal is that policy status needs a human workflow around it. `modified` can mean a useful repo-specific decision, not a defect. `missing` can mean a deliberate deletion, not an automatic repair. The docs should tell maintainers how to review local policy changes and tell agents how to treat customized policy files during autonomous work.

## Raw simulated feedback

### Platform Engineer

- What they liked: Policy files are plain Markdown and can live in every repo.
- What confused them: They need rules for when local policy drift is acceptable.
- What they would need before using it: A review workflow for policy edits and upgrades.
- What would make them recommend/star it: Guidance that works across many repos without central administration.
- What would make them abandon it: Automatic policy rewrites or hidden compliance claims.

### Open Source Maintainer

- What they liked: Reviewers can inspect policy files without another service.
- What confused them: Contributors may assume `modified` is a failure.
- What they would need before using it: README and docs language saying modified policies are repo decisions to review.
- What would make them recommend/star it: Clear PR expectations for policy changes.
- What would make them abandon it: Noisy policy warnings without next steps.

### Security Reviewer

- What they liked: `policy status` does not scan source code or read secrets.
- What confused them: A policy diff could be mistaken for evidence of compliance.
- What they would need before using it: Explicit language that policies guide agents and reviewers; they do not prove enforcement.
- What would make them recommend/star it: A rule that policy changes require human review when they weaken safety guidance.
- What would make them abandon it: Any automated migration command that overwrites local safety rules.

### Power User / Agentic Engineer

- What they liked: Agents can check policies before risky edits.
- What confused them: Agents need to know whether to obey modified local policies or bundled defaults.
- What they would need before using it: Generated harness guidance that local policy files are authoritative for the repo.
- What would make them recommend/star it: A small checklist before changing policy text.
- What would make them abandon it: A vague "ask human" rule for every policy status.

### AI-Skeptical Senior Engineer

- What they liked: Plain Markdown and deterministic status beat vague AI process claims.
- What confused them: What practical action follows each status value?
- What they would need before using it: A short table mapping status to maintainer action.
- What would make them recommend/star it: Reviewable policy changes tied to task contracts.
- What would make them abandon it: Treating generated templates as sacred.

## Product council debate

- Abhi: This keeps the wedge practical. We help teams use policies without building a governance product.
- Maya: No runtime behavior change. This is docs and generated guidance only.
- Elias: Put the status-action table in `docs/policies.md`; README can stay brief.
- Nora: Make the workflow copy-pasteable and terse.
- Samir: Say weakened safety policy needs explicit human review.
- Lina: Agents should follow local policy files first and use bundled templates only as comparison context.
- Tom: Avoid compliance language. Policies are instructions, not proof.
- Rachel: This supports teams later without moving toward SaaS.

## Decision

Add policy customization guidance to public docs and generated harness templates. The guidance should explain status meanings, maintainer actions, agent behavior, and review expectations for policy changes. Keep the CLI read-only and do not add enforcement.

## Non-decisions

- No policy editor.
- No auto-migration command.
- No compliance scoring.
- No organization policy registry.
- No remote policy packs.

## Resulting tasks

- Update `docs/policies.md` with a status-action table and customization workflow.
- Add a brief README pointer to policy customization.
- Update generated AgentLoop guidance so agents treat local policy files as authoritative repo guidance.
- Update harness command and review checklist templates.
- Record dogfood evidence and run verification.

## Success criteria

- Maintainers know what to do with `current`, `modified`, `missing`, and `extra`.
- Agents know to follow local policy Markdown during repo work.
- Docs avoid enforcement, compliance, and automatic migration claims.
- No source behavior changes are required.
