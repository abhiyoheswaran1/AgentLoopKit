# Baseframe Suite Integration v1

Baseframe Suite v1 keeps each tool independent and connects them through local, versioned JSON artifacts.

```text
ProjScan finds the risk.
AgentLoopKit controls the work.
AgentFlight proves the result.
```

## Workflow

1. ProjScan assesses the repository and writes `.baseframe/evidence/<task-id>/projscan-assessment.json`.
2. AgentLoopKit validates that assessment, creates or updates the native `.agentloop/tasks/` task, writes `.baseframe/evidence/<task-id>/agentloopkit-task.json`, and updates `.baseframe/agent-workflow.json`.
3. AgentFlight consumes the ProjScan assessment plus the AgentLoopKit task contract, then later writes `.baseframe/evidence/<task-id>/agentflight-result.json`.
4. AgentLoopKit can reconcile the AgentFlight result against required gates without requiring AgentFlight for normal standalone use.

The shared artifact layout is:

```text
.baseframe/
  agent-workflow.json
  evidence/
    <task-id>/
      projscan-assessment.json
      agentloopkit-task.json
      agentflight-result.json
```

AgentLoopKit does not import ProjScan or AgentFlight internals.

## Create A Task From ProjScan

```bash
projscan assess \
  --intent "Implement password reset" \
  --task-id auth-password-reset-20260626-01 \
  --emit-baseframe

agentloopkit create-task \
  --from-projscan .baseframe/evidence/auth-password-reset-20260626-01/projscan-assessment.json
```

Optional human overrides can add scope and acceptance criteria:

```bash
agentloopkit create-task \
  --from-projscan .baseframe/evidence/auth-password-reset-20260626-01/projscan-assessment.json \
  --title "Implement password reset" \
  --allow "src/auth/**" \
  --allow "tests/auth/**" \
  --acceptance "Reset tokens expire" \
  --acceptance "Reset tokens cannot be reused"
```

ProjScan provides assessment evidence, impacted areas, review focus, risks, and suggested checks. It does not provide complete acceptance criteria. If no `--acceptance` values are supplied, AgentLoopKit writes an explicit unknown acceptance placeholder and keeps the Baseframe task contract in `draft` status.

The machine-readable task contract is written to:

```text
.baseframe/evidence/auth-password-reset-20260626-01/agentloopkit-task.json
```

That is the file AgentFlight should consume next.

## Manifest Behavior

AgentLoopKit reads and updates `.baseframe/agent-workflow.json` using repo-relative paths. It preserves existing `projscan` and `agentflight` sections, updates only the `agentloopkit` section plus timestamps, and writes the manifest atomically.

## Gate Reconciliation

After AgentFlight writes its result artifact, reconcile required gates with:

```bash
agentloopkit check-gates \
  --baseframe-task-id auth-password-reset-20260626-01 \
  --from-agentflight .baseframe/evidence/auth-password-reset-20260626-01/agentflight-result.json
```

This mode matches AgentFlight verification commands against AgentLoopKit verification gates, marks gates as passed, failed, pending, or skipped, and surfaces incomplete verification, proof gaps, and scope drift in the task contract risks. It does not mark the native AgentLoopKit task complete automatically.

Plain `agentloopkit check-gates` remains the standalone AgentLoopKit review-evidence command and does not require ProjScan or AgentFlight.

## Package API

The package exports the v1 types and helpers:

```ts
import {
  createTaskFromProjScan,
  evaluateAgentFlightResult,
  type ProjScanAssessmentV1,
  type AgentLoopKitTaskContractV1,
  type AgentFlightResultV1,
} from "agentloopkit";
```
