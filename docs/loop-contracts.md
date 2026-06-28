# AgentLoop Loop Contracts

AgentLoopKit can record a local control loop without becoming a coding agent. The loop contract gives a goal, a budget, stop conditions, suggested commands, token receipts, and readiness decisions. A human or an external runner still performs the implementation work.

```bash
agentloop loop create \
  --goal "Keep AgentLoopKit release-ready" \
  --cadence manual \
  --budget-tokens 50000 \
  --max-iterations 5

agentloop loop tick
agentloop loop status
agentloop loop report
agentloop ready
```

When you want AgentLoopKit to drive one bounded implementation pass through a local runner, configure that runner when the loop is created:

```bash
agentloop loop create \
  --goal "Keep AgentLoopKit release-ready" \
  --runner-command "node scripts/agentloop-runner.mjs" \
  --runner-timeout-ms 600000 \
  --budget-tokens 50000 \
  --max-iterations 5

agentloop loop run
agentloop loop status
agentloop loop report
agentloop ready --strict
```

Loop contracts are stored as JSON under `.agentloop/loops/<loop-id>/loop.json`. Each loop also creates a normal AgentLoopKit task contract under `.agentloop/tasks/`. That keeps loop work connected to the same task, scope, acceptance, verification, handoff, and ship evidence used by the rest of AgentLoopKit.

## What A Loop Records

The loop contract records:

- goal and cadence
- native task path
- maximum estimated tokens and maximum iterations
- suggested commands to run outside the loop controller
- stop conditions
- readiness status for each iteration
- source handles used for compact context
- token receipt for the initial contract and each tick
- configured runner command, exit code, changed files, and bounded output when `loop run` is used
- whether the loop continued, stopped, or became ready

`agentloop loop tick` does not execute the suggested commands. It reads local AgentLoopKit evidence, evaluates readiness, builds a compact context pack, records a token receipt, and decides the next loop state.

`agentloop loop run` executes only the runner command stored in the loop contract. It does not accept a different command unless the override exactly matches the configured command. After the runner exits, AgentLoopKit records the exit code, bounded output, changed files, token receipt, readiness state, and next loop decision.

## Runner Guardrails

Runner execution is opt-in. A loop without `--runner-command` cannot run external work.

AgentLoopKit applies these guardrails before each runner pass:

- no shell execution; commands run with `shell: false`
- shell metacharacters such as pipes, redirection, command substitution, and `&&` are rejected
- shell interpreters are blocked
- direct delete commands are blocked
- `git add`, `git commit`, `git push`, `git reset`, `git clean`, `git checkout`, `git switch`, `git rebase`, `git merge`, `git tag`, `git stash`, and `git restore` are blocked
- package publishing and package-version commands are blocked
- GitHub release and Docker publish/login commands are blocked
- runner output is capped in the loop contract
- max-iteration and token-budget stop conditions still apply

Put complex automation in a reviewed repo script, then configure the loop to run that script directly. AgentLoopKit should control the goal, budget, evidence, and stop decision. The runner should do one bounded piece of work.

## Token Receipts

AgentLoopKit estimates context with a transparent heuristic: `ceil(character_count / 4)`. The receipt reports:

- estimated broad context tokens
- estimated compact context tokens
- estimated AgentLoopKit overhead tokens
- estimated gross context reduction
- estimated net context reduction
- the command that can reproduce the compact context

If the local evidence is too small for AgentLoopKit to likely save context, the receipt warns:

```text
AgentLoopKit may cost more context than it avoids for this repo state. Use compact output or narrow scope.
```

The estimate is planning guidance. It is not provider tokenizer output and it is not a billing claim.

## Readiness Gates

Use `agentloop ready` when you need the current review-readiness decision without creating or ticking a loop.

```bash
agentloop ready
agentloop ready --json
agentloop ready --strict
```

Readiness checks:

- current task contract
- acceptance criteria placeholders
- verification evidence
- scope drift
- forbidden file changes
- context-budget pressure

`--strict` exits non-zero when readiness is blocked. The command is read-only and does not run verification.

## Presets

Presets create a loop goal and suggested commands without executing those commands:

```bash
agentloop loop create --preset agentloopkit-maintenance
agentloop loop create --preset docs-drift
agentloop loop create --preset release-readiness
agentloop loop create --preset baseframe-integration
```

Use `agentloopkit-maintenance` for the local self-check loop in this repository. Use `docs-drift` when CLI behavior and docs need to stay aligned. Use `release-readiness` to prepare evidence before a maintainer-approved release. Use `baseframe-integration` to check local ProjScan, AgentLoopKit, and AgentFlight artifact compatibility.

## Safety Boundary

Loop commands do not call an LLM, run a coding agent, execute suggested commands, publish packages, create tags, push commits, upload files, read `.env` contents, or modify external services. `loop run` executes only the configured local runner command and records the result.

The contract is agent-neutral. Codex, Claude Code, Cursor, AgentFlight, a CI job, or a custom runner can consume the loop state, but AgentLoopKit owns the goal, scope, budget, gates, evidence, and stop decision.
