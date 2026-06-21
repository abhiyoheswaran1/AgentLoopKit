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
- decisions or follow-up task contracts

AgentLoopKit does not run participant sessions, recruit participants, analyze private data automatically, call external services, or prove market traction. If a team uses simulated personas, label that output as internal decision support and do not present it as external evidence.
