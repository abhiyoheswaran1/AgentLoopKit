# Verification Report

- Timestamp: `2026-06-15T14:43:06.979Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `db1991f`
- Working tree: `dirty`
- Overall status: fail


## Task Context
- Path: `.agentloop/tasks/2026-06-15-support-redacted-handoff-output.md`
- Title: `Support redacted handoff output`
- Task type: `bugfix`
- Status: `in-progress`




## Failure Summary
### task: `` `npm test -- tests/pr-summary.test.ts` ``

- Exit code: 127

```text
/bin/sh: >: command not found
```

### task: `` `npm run test:unit` ``

- Exit code: 127

```text
/bin/sh: >: command not found
```

### task: `` `npm run typecheck` ``

- Exit code: 127

```text
/bin/sh: >: command not found
```

### task: `` `npm run check:public-docs` ``

- Exit code: 127

```text
/bin/sh: >: command not found
```

### task: `` `npm run build` ``

- Exit code: 127

```text
/bin/sh: >: command not found
```


## Commands Run
### task: `` `npm test -- tests/pr-summary.test.ts` ``

- Exit code: 127
- Status: fail


```text
/bin/sh: >: command not found
```

### task: `` `npm run test:unit` ``

- Exit code: 127
- Status: fail


```text
/bin/sh: >: command not found
```

### task: `` `npm run typecheck` ``

- Exit code: 127
- Status: fail


```text
/bin/sh: >: command not found
```

### task: `` `npm run check:public-docs` ``

- Exit code: 127
- Status: fail


```text
/bin/sh: >: command not found
```

### task: `` `npm run build` ``

- Exit code: 127
- Status: fail


```text
/bin/sh: >: command not found
```

## Not Run
- test
- lint
- typecheck
- build

## Recommended Next Actions
- Fix failing commands before claiming completion.
