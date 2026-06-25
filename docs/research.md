# Research Tasks

Use a `research` task when work starts with a question instead of an implementation change.

```bash
agentloop create-task --type research --title "Understand checkout drop-off" \
  --problem "We do not know which checkout step creates the most friction." \
  --outcome "Summarize evidence, limits, and the next scoped product or engineering task." \
  --acceptance "Research question, evidence source, findings, and limits are recorded" \
  --verification "npm run check:links" \
  --rollback "Remove the research note or mark findings superseded"
```

A good research task records:

- research question
- audience, system, or workflow being studied
- evidence source and privacy boundary
- findings with confidence and limits
- decision or recommendation with owner/status, plus follow-up task contracts

## Research-To-Decision Shape

Use this shape when the work needs a product or engineering decision:

- Question: the thing the team needs to learn.
- Evidence source: interviews, support notes, analytics exports, repo artifacts, competitive notes, or internal simulations.
- Boundary: privacy, consent, sampling, freshness, and what the evidence cannot prove.
- Findings: short bullets with confidence and source.
- Decision or recommendation: what the named owner accepted, deferred, or rejected.
- Follow-up task: the next scoped AgentLoop task contract when implementation should start.

A useful research handoff states the recommendation or recorded decision with enough source context for review.

## Agent Workflow

```bash
agentloop create-task --type research --title "Understand checkout drop-off"
agentloop start --for generic --goal research --redact-paths
agentloop context pack --for generic --goal research --redact-paths
agentloop context handles --redact-paths
agentloop context show task:active --redact-paths
```

Use `start --goal research` before broad note reads. Use `context handles` to list available local evidence, then `context show <handle>` when the agent needs exact source truth. When research turns into implementation, create a new `feature`, `bugfix`, or `docs` task instead of widening the research task.

AgentLoopKit does not run participant sessions, recruit participants, analyze private data automatically, call external services, or prove market traction. If a team uses simulated personas, label that output as internal decision support and do not present it as external evidence.
