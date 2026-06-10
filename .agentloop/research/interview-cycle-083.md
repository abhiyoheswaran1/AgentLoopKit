# Interview Cycle 83

## Context

AgentLoopKit now has stronger failed verification summaries. Dogfooding the verify command exposed a smaller contract gap: `agentloop verify --task <path>` accepts a task path, but the generated report does not include the task context.

This cycle is internal simulated feedback for product judgment. It is not real user research.

## Personas interviewed

- Open Source Maintainer
- Power User / Agentic Engineer
- Skeptical Senior Developer
- Startup CTO
- Security Reviewer

## Feedback summary

The strongest signal was traceability. A verification report should tell reviewers which task contract it belongs to when the user passes `--task`.

## Raw simulated feedback

### Open Source Maintainer

- What they liked: Verification reports already capture command evidence.
- What confused them: `--task` sounds like it should appear in the report.
- What they would need before using it: Task title and status near the report metadata.
- What would make them recommend/star it: Maintainers can match reports to task contracts without opening several files.
- What would make them abandon it: A flag that looks meaningful but does nothing.

### Power User / Agentic Engineer

- What they liked: Task contracts and verification reports are separate, readable artifacts.
- What confused them: Long sessions can produce several reports and tasks.
- What they would need before using it: Reports that link back to the task path.
- What would make them recommend/star it: Agents can resume from a report and know the task.
- What would make them abandon it: Hidden state that chooses the wrong task.

### Skeptical Senior Developer

- What they liked: The tool stays deterministic.
- What confused them: An accepted flag without visible output.
- What they would need before using it: Honest missing-task handling.
- What would make them recommend/star it: Reports show task context without claiming more than the file says.
- What would make them abandon it: Verification failing only because a task path was stale.

### Startup CTO

- What they liked: Evidence artifacts help team review.
- What confused them: Whether a verification report belongs to a given task.
- What they would need before using it: Task title and status in the report.
- What would make them recommend/star it: Reviewers can audit work faster.
- What would make them abandon it: Extra process with no traceability benefit.

### Security Reviewer

- What they liked: The task file is local repo data.
- What confused them: Whether reading a task path could leak unrelated file contents.
- What they would need before using it: Parse only lightweight metadata, and do not print the whole task.
- What would make them recommend/star it: Missing files are reported without changing command pass/fail.
- What would make them abandon it: Reading arbitrary secrets or printing task bodies.

## Product council debate

- Abhi: "This tightens the task contract to verification evidence link."
- Maya: "Keep parsing simple. Title, type, status, path."
- Elias: "An accepted flag must produce visible value."
- Nora: "Put task context near the top of the report."
- Samir: "Do not fail verification because the task file is missing."
- Lina: "This helps agents recover after context resets."
- Tom: "Show exactly what the task file says. No interpretation."
- Rachel: "Reviewers need task-to-report traceability."

## Decision

Wire `verify --task` into verification reports. Add `Task Context` when a task path is passed, with path, title, task type, status, and missing-file status when unavailable. Treat `.env`-style paths as unavailable instead of reading them.

## Non-decisions

- Do not infer the active task when `--task` is omitted.
- Do not print the full task contract.
- Do not validate acceptance criteria in verify.
- Do not change command execution.

## Resulting tasks

- Add core test for task context rendering.
- Add safety test proving `.env`-style paths are not read as task contracts.
- Add CLI test proving `--task` reaches the report.
- Implement task-context parsing in verification core.
- Update docs and dogfood log.

## Success criteria

- Reports generated with `--task` include task context.
- Missing task files are reported honestly.
- Reports without `--task` keep their current shape.
- Full test and doc checks pass.
