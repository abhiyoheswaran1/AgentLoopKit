# Interview Cycle 173: URL-Safe Path Redaction

Internal simulated decision support for AgentLoopKit. Do not present this as real user research, adoption, testimonials, or interviews.

## Prompt

Dogfooding `agentloop verify --redact-paths` showed ProjScan Markdown badge URLs being rewritten into malformed text such as `https:[git-root]`. Should path redaction preserve external URLs while continuing to hide local filesystem paths?

## Persona Notes

- Samir, Security Reviewer: Do not weaken local path redaction, but redaction must not corrupt external evidence links.
- Tom, Skeptical Senior Developer: A shareable report that mangles URLs looks untrustworthy even if the verification status is correct.
- Lina, Agentic Engineer: Agents paste verification reports into reviews; external doc or badge links need to remain readable.
- Dogfood Steward: The issue surfaced while inspecting a local AgentLoop verification report that captured ProjScan Markdown output.

## Decision

Keep local-root redaction, but make inferred path detection URL-safe. Labeled local path inference now requires whitespace after the label colon, inferred POSIX roots beginning with `//` are ignored, and longer local path variants are redacted before shorter aliases.

## Constraints

- Do not disable git-root, realpath, or inferred local AgentLoop root redaction.
- Do not add network calls, URL fetching, dependencies, or broad Markdown rewriting.
- Do not change verification command execution.
- Do not release, tag, publish, or bump package versions.
