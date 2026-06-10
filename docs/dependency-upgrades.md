# Dependency Upgrade Workflow

Use a `dependency-upgrade` task when an agent adds, removes, or upgrades a package.

AgentLoopKit does not choose package versions, scan advisories, call registries, run package audits, or enforce policy. It gives the repo a task contract and handoff format so reviewers can see why the dependency changed, which lockfiles changed, which checks ran, and how to roll back.

## Create a scoped upgrade task

```bash
agentloop create-task --type dependency-upgrade --title "Upgrade validation library" \
  --problem-statement "The API validation package needs a patch upgrade for a bugfix" \
  --desired-outcome "The package and lockfile are updated with passing tests and rollback notes" \
  --likely-file package.json \
  --likely-file pnpm-lock.yaml \
  --forbidden-file src/auth \
  --acceptance "Only the intended package and lockfile entries changed" \
  --acceptance "Validation behavior still passes regression tests" \
  --verification "pnpm install --frozen-lockfile" \
  --verification "pnpm test" \
  --verification "pnpm typecheck" \
  --verification "pnpm build" \
  --rollback "Revert package.json and pnpm-lock.yaml"
```

Keep the task narrow. A good dependency-upgrade contract names the package, reason, target version or range, expected lockfile, verification commands, and rollback plan.

## Review the lockfile

Lockfiles are risk files. `agentloop doctor` reports them by path, and reviewers should inspect them when a dependency task changes them.

Ask:

- Did the intended direct dependency change?
- Did transitive dependency churn stay explainable?
- Did the package manager update the matching lockfile?
- Did install scripts, native builds, or postinstall behavior appear?
- Did the task handoff name checks that did not run?

Do not paste lockfile chunks into chat unless reviewers need the exact diff. Point reviewers to the files and summarize what changed.

## Verification

Use the repo's own commands. For JavaScript and TypeScript projects, common checks include:

```bash
agentloop verify --task .agentloop/tasks/2026-06-10-upgrade-validation-library.md
```

Configured commands often include:

- package-manager install check such as `pnpm install --frozen-lockfile`
- tests
- lint
- typecheck
- build

If the repo uses `npm`, `yarn`, or `bun`, replace commands with the project's normal scripts.

## Handoff

The handoff should include:

- package name
- old version and new version when known
- reason for the upgrade
- direct files changed
- lockfiles changed
- verification commands and results
- checks not run
- compatibility risks
- rollback command or files to revert

If a package adds install scripts, native binaries, network behavior, or a new runtime dependency, ask for human review even when tests pass.

## Example

See [`../examples/dependency-upgrade/README.md`](../examples/dependency-upgrade/README.md) for a copyable task, verification report, and PR summary.
