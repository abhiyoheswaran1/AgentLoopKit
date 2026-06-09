# Interview Cycle 8

## Context

AgentLoopKit has launch docs, visuals, issue templates, a PR template, CI, task contracts, verification reports, status, and handoff summaries. The next low-risk launch polish item is to make GitHub contribution templates ask for the same evidence the tool generates.

This is simulated internal product-panel feedback. It is not real user research.

## Personas interviewed

- Open Source Contributor
- Open Source Maintainer
- AI-Skeptical Senior Engineer
- Developer Experience Designer

## Feedback summary

The strongest signal: contributors need concrete prompts for AgentLoopKit artifacts at the moment they open issues and PRs. The panel chose template polish over new automation.

## Raw simulated feedback

### Open Source Contributor

- Liked: setup and tests are documented.
- Confused: which AgentLoopKit artifacts maintainers expect in PRs.
- Would need before contributing: a PR template that names task, status, verification, and handoff evidence.
- Would recommend/star it if: contribution expectations feel lightweight.
- Would abandon it if: every issue requires a long process.

### Open Source Maintainer

- Liked: deterministic reports and summaries.
- Confused: issue templates do not yet prompt for status output.
- Would need before using it: contributors should paste evidence without being asked later.
- Would recommend/star it if: templates reduce review back-and-forth.
- Would abandon it if: templates become bureaucracy.

### AI-Skeptical Senior Engineer

- Liked: evidence-first workflow.
- Confused: a plain PR checklist can miss the specific AgentLoopKit loop.
- Would need before using it: task contract and verification evidence in reviews.
- Would recommend/star it if: the repo demands auditable work from humans and agents.
- Would abandon it if: the process asks for AI-flavored prose instead of checks.

### Developer Experience Designer

- Liked: short templates.
- Confused: feature requests should identify whether they affect a command, template, policy, or agent workflow.
- Would need before using it: simple fields users can fill quickly.
- Would recommend/star it if: templates guide without slowing people down.
- Would abandon it if: the templates feel like enterprise forms.

## Product council debate

- Abhi: This reinforces the wedge at GitHub review time.
- Maya: Keep it as Markdown templates. No bot.
- Elias: This helps the repo feel maintained from day one.
- Nora: Ask for artifacts, not essays.
- Samir: Do not ask users to paste secrets or `.env` contents.
- Lina: Agents can fill these fields after `summarize`.
- Tom: This is practical. It asks for evidence.
- Rachel: Teams can copy this pattern into their own repos.

## Decision

Update bug report, feature request, and PR templates to ask for AgentLoopKit status, verification, task, and handoff evidence when relevant.

## Non-decisions

- No issue forms migration yet.
- No GitHub bot.
- No label automation.
- No required template enforcement.

## Resulting tasks

- Update `.github/ISSUE_TEMPLATE/bug_report.md`.
- Update `.github/ISSUE_TEMPLATE/feature_request.md`.
- Update `.github/PULL_REQUEST_TEMPLATE.md`.
- Update backlog and dogfood notes.

## Success criteria

- Templates stay short.
- PR template asks for task, status, verification, and handoff evidence.
- Bug template asks for `agentloop status` when available.
- Verification and `projscan` pass.
