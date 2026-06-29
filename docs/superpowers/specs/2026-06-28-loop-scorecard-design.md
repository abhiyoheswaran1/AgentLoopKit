# Autonomous Loop Scorecard Design

## Goal

Add a read-only scorecard that tells a human, script, or agent whether an AgentLoopKit loop can continue, should ask for human input, should stop, or is ready for review.

## Product Decision

AgentLoopKit already has loop contracts, guarded runners, context packs, token receipts, readiness checks, and evidence maps. The missing step is a deterministic decision surface before the next autonomous iteration. Users should not need to inspect several commands to know whether another loop run is safe or wasteful.

## Command

```bash
agentloop loop scorecard --id <loop-id>
agentloop loop scorecard --id <loop-id> --json
```

When `--id` is omitted, the command uses the newest loop, matching `loop status` and `loop report`.

## API

```ts
export async function scoreLoop(...): Promise<LoopScorecardResult>;
```

The API reads the loop contract, current readiness, current context pack, and loop-local ledger. It does not run the loop runner, project verification, package scripts, agents, or network calls.

## Decision Model

The scorecard returns one action:

- `continue`: the loop can run another iteration.
- `ask-human`: the loop needs human judgment before continuing.
- `stop`: the loop hit a terminal budget, iteration, blocked-runner, or unsafe-state condition.
- `ready`: readiness gates passed.

The result includes ranked reasons and signals:

- readiness status and next action
- iteration count against max iterations
- estimated used tokens and remaining budget
- latest net context reduction
- runner presence and guardrail state
- context handles available to the next agent
- evidence freshness and reviewability from the compact evidence map
- scope drift or unexplained changed-file count

## Safety

The command stays local and read-only. It may inspect Git status through existing AgentLoopKit evidence code. It does not read `.env` contents, execute runner commands, run verification, call an LLM, upload files, publish packages, create tags, push commits, or mutate task state.

## Documentation

Public docs should describe the scorecard as a pre-flight decision gate for autonomous loops. They must not claim billing savings, real user adoption, code-quality certification, or autonomous implementation by AgentLoopKit itself.
