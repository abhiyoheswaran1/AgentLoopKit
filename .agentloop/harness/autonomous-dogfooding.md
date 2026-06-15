# Autonomous Dogfooding

This repo uses AgentLoopKit as its own operating loop and uses Baseframe Labs companion tools as local proof sources.

## Required Tools

- AgentLoopKit: task contracts, verification reports, ship reports, PR handoffs, release proof, run ledger, and gates.
- ProjScan: repo health, repo understanding, risk signals, and agent-oriented project inspection.
- AgentFlight: local session flight recorder, status, proof reports, replay, and resume prompts.

## Operating Loop

Use this loop for meaningful product changes:

Build -> Test -> Review -> Simulated user feedback -> Product panel debate -> Decision -> Backlog update -> Iterate -> Verify -> Document

Do not skip the task contract. Do not skip verification. Do not cut a version unless the maintainer explicitly asks for release prep.

## Start A Session

Start the flight recorder first, wait for it to finish, then create or update the AgentLoop task contract. Do not start AgentFlight and `agentloop create-task` in parallel. Parallel starts can leave a generic AgentFlight-derived task contract active instead of the detailed AgentLoop task.

```bash
npx --yes agentflight start --task "Describe the change" --yes
agentloop create-task --type feature --title "Describe the change"
agentloop status --brief --redact-paths
npx --yes projscan start
```

If a task already exists, read it first:

```bash
agentloop task list
agentloop task show <path>
agentloop task set <path>
```

## During Implementation

Use the internal decision files before choosing scope:

- `.agentloop/product-panel.md`
- `.agentloop/user-personas.md`
- `.agentloop/backlog.md`
- `.agentloop/research/`

Synthetic feedback is internal decision support, not public evidence. Do not write public docs that claim real users, teams, adoption, interviews, testimonials, or demand unless the repo contains real evidence.

Use the panel roles as reviewers:

- Abhi: product wedge and adoption value
- Maya: architecture and maintainability
- Elias: open-source trust and README clarity
- Nora: CLI and onboarding experience
- Samir: safety, registry, env-file, and supply-chain risk
- Lina: agentic engineering workflow
- Tom: deterministic value for skeptical reviewers
- Rachel: lightweight team consistency

## Verification

Use focused checks while editing, then record proof:

```bash
npm run test:unit
npm run check:public-docs
npm run check:links
npm run build
agentloop verify --task-commands --write-run
npm run dogfood:strict
npx --yes projscan doctor --format markdown
npx --yes agentflight doctor
```

For release work, run the release gate only after the maintainer asks for a release:

```bash
npm run release-flow
agentloop release-proof
```

## Handoff

Before stopping:

```bash
agentloop ship
agentloop prepare-pr
agentloop handoff --write-run
npx --yes agentflight snapshot --note "Handoff ready"
npx --yes agentflight report
```

Keep the handoff honest:

- What changed
- What was verified
- What failed or was not checked
- Which personas or panel concerns shaped the decision
- What should happen next

## Local Artifacts

Commit AgentLoopKit evidence when it is part of the repo task. Keep noisy local caches out of review:

- `.projscan-memory/`
- `.projscan-cache/`
- `.agentflight/current/`
- `.agentflight/sessions/*.json`

Commit `.agentflight/config.json` so future agents share the same local-first setup. Commit curated AgentFlight reports only when they are intentionally redacted and useful review evidence for this repo. Do not commit live session JSON, credentials, `.env` files, npm tokens, GitHub tokens, or machine-specific secrets.
