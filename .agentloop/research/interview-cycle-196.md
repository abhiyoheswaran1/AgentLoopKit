# Interview Cycle 196: AgentLoop Context Contract

Internal simulated decision support for AgentLoopKit. Do not present this as real user research, adoption, testimonials, or interviews.

## Prompt

Should AgentLoop Context Contract become the next flagship product direction before any Headroom-like reducer or proxy work?

## Evidence Sources

- `.agentloop/product-panel.md`
- `.agentloop/user-personas.md`
- `.agentloop/backlog.md`
- `.agentloop/research/real-repo-usefulness-trials-2026-06-22.md`
- Existing v0.39.0 command surfaces: `guard`, `explain-diff`, `resume-pack`, `review-context`, and context-budget estimates.

## Decision Boundary

This cycle decides product direction only. It does not approve implementation, release work, provider prompt interception, proxy mode, telemetry, external research collection, or public claims that heuristic estimates equal provider tokenization or billing savings.

## Team Persona Notes

- Abhi, Product Lead: Make AgentLoopKit the repo-level context contract for software agents. This is stronger than chasing generic compression because it is specific, lightweight, easy to explain, and aligned with task contracts, verification evidence, and reviewer handoffs.
- Maya, Principal Engineer: Build on existing primitives instead of creating a large new subsystem. A thin `agentloop context` command can compose evidence-map, guard, resume-pack, review-context, runs, and task-state modules if each unit has clear boundaries and tests.
- Elias, Open Source Maintainer: The README needs a 30-second proof: install, initialize, run one context command, see what the agent should read, what was omitted, and how much context was avoided. Avoid broad "saves tokens" claims without local evidence.
- Nora, DX: The product surface must be obvious to both humans and agents. Put `agentloop context pack --for <agent> --goal <goal>` in generated agent instructions, CLI help, docs, and next-action guidance.
- Samir, Security Reviewer: No silent prompt rewriting, traffic interception, secret reads, or hidden network behavior. Context packs must include redaction controls, omitted-source receipts, and local retrieval commands.
- Lina, Agentic Engineer: The agent value is highest at session start, after interruption, before review, and when switching between Codex, Claude Code, Cursor, OpenCode, Gemini CLI, or GitHub Copilot CLI. The pack should be small enough to paste but structured enough for tools to consume.
- Tom, Skeptical Senior Developer: The product must prove practical value with deterministic outputs: fewer stale assumptions, fewer broad reads, clearer review evidence, and exact source handles. Do not sell methodology for its own sake.
- Rachel, Small Team CTO: A shared context contract can become a lightweight team standard across repos. The team value is consistency: every agent starts from the same current evidence instead of a private chat transcript.
- Priya, Future Commercial Buyer: This creates a future path for team-level policy packs, shared context ledgers, audit logs, and dashboards without pulling the open-source core into a hosted app now.

## Target User Persona Notes

- Indie hacker using Codex: Wants one command that makes a new session productive without re-explaining the repo. Success looks like `init`, `create-task`, `context pack`, and `verify` fitting into a short local loop.
- Claude Code power user: Wants repo-specific discipline and continuation packs that work with custom skills. JSON output and source handles matter more than prose summaries.
- Cursor developer: Needs generated `AGENTS.md` and IDE-friendly guidance so Cursor agents know to run the context command before broad file reads.
- Open source maintainer: Needs review-ready evidence: task, diff explanation, verification status, risks, rollback notes, and omitted context receipt.
- Small team CTO: Needs repeatable setup across repos and measurable signals that agent work is controlled, current, and reviewable.
- Automation-skeptical senior engineer: Will accept this only if output is deterministic, inspectable, local-first, and explicitly not a hidden agent wrapper.
- Agency developer: Needs reusable client-friendly setup and handoff artifacts that reduce project re-orientation cost.
- Platform engineer: Needs CLI and MCP surfaces that can become an internal standard without every repo inventing a custom prompt pack.

## Findings

1. AgentLoop Context Contract should become the next flagship direction.
   - Confidence: high.
   - Reason: It directly serves the product wedge: repo-level engineering loops, task contracts, verification evidence, and reviewer handoffs.

2. Quantified usefulness must be a core feature, not marketing copy.
   - Confidence: high.
   - Reason: The current dogfood trial already produced transparent heuristic evidence: 83 changed files, 967 estimated changed-file-list tokens, 101 estimated resume-pack tokens, about 90 percent less estimated continuation context. The product should generalize this measurement per repo and per command.

3. Agent discoverability is as important as human onboarding.
   - Confidence: high.
   - Reason: The strongest adoption path is not asking users to remember another process. Generated agent instructions, MCP tool descriptions, `next`, `doctor`, and CLI help should all route agents toward context packs before broad reads.

4. The first implementation should unify and expose existing behavior before adding reducers.
   - Confidence: high.
   - Reason: `guard`, `explain-diff`, `resume-pack`, and `review-context` already prove the concept. A `context` command can make the feature understandable without risky proxy behavior.

5. Reducers are valuable later, but only after receipts and handles exist.
   - Confidence: medium-high.
   - Reason: Compressing logs, diffs, JSON, and test output can help, but only if critical lines, paths, failures, exit codes, and source artifacts remain retrievable.

## Impact Scorecard

Use these metrics to quantify user impact in docs, trials, and release evidence.

| metric | definition | target for flagship readiness |
| --- | --- | --- |
| Context reduction estimate | Broad changed-file/log evidence estimate versus compact context pack estimate | Show percentage and ratio; avoid billing claims |
| Context freshness | Whether task, verification, guard, and run evidence are current or stale | Warn on stale or missing evidence |
| Agent readiness | Whether generated guidance tells agents how to run, read, and expand context packs | Codex, Claude, Cursor, OpenCode, Gemini CLI, Copilot CLI, and generic guidance covered |
| Source retrievability | Every summary section has a local source path, command, or handle | 100 percent of included sections have retrieval guidance |
| Omission transparency | Pack explains what was omitted and why | Required in human and JSON output |
| Reviewability | Changed non-evidence files are covered by task scope, evidence map, or explicit risk notes | No unexplained changed files in controlled trials |
| Setup success | Fresh repo can initialize, install agent guidance, create a task, and generate a pack | Works in monorepo, app repo, and library repo trials |
| Safety boundary | No secret reads, no provider traffic interception, no hidden network calls, redaction available | Required before public promotion |

## Recommended Product Phases

### Phase 1: Context Contract v1

- Add `agentloop context budget`.
- Add `agentloop context pack --for <agent> --goal <continue|review|debug|handoff>`.
- Add pack receipts: included, omitted, why, freshness, source paths, retrieval commands.
- Add stable handles for active task, latest run, latest verification, guard findings, changed-file explanation, and report artifacts.
- Make `resume-pack` and `review-context` point toward the unified context surface.

### Phase 2: Agent-Native Adoption

- Add JSON schema for context packs.
- Add MCP tools for `context_pack`, `context_budget`, and `context_show`.
- Update generated `AGENTS.md`, `CLAUDE.md`, Cursor rules, and generic agent guidance.
- Teach `doctor` and `next` to recommend context packs when agents would otherwise read broadly.
- Add README and docs demos that show measurable context reduction and source retrieval.

### Phase 3: Safe Reducers

- Add explicit reducers for test logs, build output, JSON reports, file lists, git diffs, and stack traces.
- Preserve error lines, paths, line numbers, exit codes, changed filenames, security warnings, and original artifact handles.
- Add fixtures and regression tests proving critical evidence is not lost.
- Keep reducers opt-in or clearly visible inside `context pack`; do not add silent proxy behavior.

### Phase 4: Advanced Integrations

- Consider optional wrappers only after local context contracts, receipts, handles, reducers, tests, and docs are mature.
- Keep proxy/provider interception explicit, off by default, and separate from the core product promise.

## Decision

Proceed with AgentLoop Context Contract as the next main product direction before Headroom-like reducers or proxy work.

The immediate product promise should be:

> AgentLoopKit gives every software agent the exact repo context it needs, why it matters, what was omitted, how much context was avoided, and how to retrieve the source truth locally.

## Follow-Up Task Candidates

1. Design AgentLoop Context Contract v1.
   - Output: approved design for `agentloop context budget`, `context pack`, `context show`, receipts, handles, JSON shape, docs, and tests.

2. Implement Context Contract v1.
   - Output: unified CLI surface built from existing guard, evidence-map, resume-pack, review-context, run, and task-state primitives.

3. Run multi-repo usefulness trials.
   - Output: monorepo, app, library, and dirty-real-repo measurements for context reduction, setup success, source retrieval, and stale-evidence warnings.

4. Update agent onboarding.
   - Output: generated agent instructions and docs that teach software agents how to set up and use context packs correctly.

5. Add safe reducers only after Context Contract v1 is stable.
   - Output: explicit reducer design and tests for logs, diffs, JSON, and command output.

## Limits

- This is simulated internal decision support, not real user feedback.
- Current context estimates are character-count heuristics, not provider tokenizer counts or billing claims.
- The decision does not approve release work.
- The decision does not approve silent prompt rewriting, provider proxying, telemetry, or external service calls.
