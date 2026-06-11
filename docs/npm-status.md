# npm Status

`agentloop npm-status` checks whether npm latest matches the local package version. Use it after a release attempt or before updating public docs that mention npm availability.

```bash
agentloop npm-status
agentloop npm-status --agentloopkit
agentloop npm-status --json
agentloop npm-status --expect-current
agentloop npm-status --registry-json npm-view.json
```

## What It Checks

By default, the command runs:

```bash
npm view <package> version versions --json
```

It compares that registry output with `package.json` in the current directory.

Use `--agentloopkit` when you are checking AgentLoopKit itself from a release smoke directory, CI workspace, or another folder:

```bash
agentloop npm-status --agentloopkit --expect-current
```

That mode checks the published `agentloopkit` package and compares it with the running CLI package version. It does not read the current folder's `package.json` for the package name or version unless you pass `--package-name` or `--local-version`.

Human output includes:

- package name
- local package version
- npm latest
- whether the registry contains the local version
- registry versions
- status
- next recommendation
- safety note

JSON output includes the same fields for scripts.

## Post-Publish Smoke Check

Use `--expect-current` after npm publish:

```bash
agentloop npm-status --expect-current
```

The command exits with code `1` unless npm latest equals the local package version. This makes it useful as a post-publish smoke check. It does not publish anything.

## Captured Registry JSON

Use `--registry-json` when CI or a release handoff already captured registry output:

```bash
npm view agentloopkit version versions --json > npm-view.json
agentloop npm-status --agentloopkit --registry-json npm-view.json --json
```

In this mode, AgentLoopKit does not run `npm view`. It reads the captured file and reports the same status.

With `--json`, invalid captured files return an error object:

```json
{
  "error": {
    "code": "NPM_STATUS_REGISTRY_JSON_INVALID",
    "message": "Captured npm registry JSON file was not found: missing-npm-view.json",
    "registryJson": "missing-npm-view.json",
    "reason": "missing"
  }
}
```

Reasons are `missing`, `unreadable`, or `invalid-json`.

## Safety

`npm-status` does not:

- publish packages
- create tags
- create GitHub releases
- read npm tokens
- read `.env` files
- upload files
- change package metadata

It treats registry errors as `unknown`, not success. Do not claim npm availability until `npm latest` matches the local version or a newer intended release.
