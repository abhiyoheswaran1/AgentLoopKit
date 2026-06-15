# Autonomous Work Rules

Agents may proceed without asking when:

- The task contract is clear.
- The change avoids protected areas.
- The implementation is small and reversible.
- Verification commands are known.
- The session has an AgentLoopKit task contract and, for meaningful work, an AgentFlight session.

Agents must pause or ask when:

- Requirements conflict.
- The change touches migrations, secrets, auth, billing, deployment, or public APIs.
- A dependency must be added or upgraded.
- A destructive command seems necessary.
- Verification fails for reasons unrelated to the task.

Before stopping:

- Run verification or explain why it was not run.
- Run `npm run dogfood` or `npm run dogfood:strict` when the change affects AgentLoopKit behavior, docs, packaging, release proof, policy packs, or agent guidance.
- Run ProjScan with `npx --yes projscan doctor --format markdown` or a more specific command when repo-risk context matters.
- Run AgentFlight `status`, `doctor`, and `report` when the work should leave a session record.
- Record product-direction decisions with the product panel, target personas, backlog, and research-cycle files when the change affects roadmap, onboarding, public docs, policy packs, release channels, or agent compatibility.
- Review git diff.
- Generate a handoff summary.

Synthetic persona or product-panel feedback is internal decision support. Do not describe it in public docs as real user feedback, interviews, testimonials, usage, or adoption.
