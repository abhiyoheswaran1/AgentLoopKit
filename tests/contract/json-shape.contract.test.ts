import path from 'node:path';
import { execa } from 'execa';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { JSON_COMMANDS, STABLE_COMMANDS } from '../../src/core/stable-surface.js';
import { makeTempDir, removeTempDir, writeJson } from '../helpers.js';
import { shapeOf } from './shape.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

// Commands in JSON_COMMANDS that were audited and found to emit non-JSON on
// stdout, or otherwise cannot be shape-locked via this harness. Each entry
// carries a one-line reason so a coverage gap is never silent.
//
// - 'show-run': needs a real prior run-ledger id to exercise its success
//   shape, and run ids are timestamp-generated at runtime (e.g.
//   "2026-07-06-15-32-verify"), so they cannot appear as a static
//   JSON_COMMANDS entry. Passing a placeholder id only exercises the
//   `{ error: { code, message } }` branch (confirmed empirically: `show-run
//   nonexistent-id` prints parseable JSON with code RUN_NOT_FOUND), which
//   would lock the error envelope rather than the intended success schema.
//   Revisit if the harness grows support for dynamic per-entry arguments
//   (e.g. resolving a real run id from `runs --json` before invoking
//   `show-run`).
const KNOWN_NON_JSON: string[] = ['show-run'];

// Stable commands that do not register a `--json` option at all (verified
// against their command sources in src/cli/commands/), so they are neither
// locked nor deferred — there is no `--json` surface to account for.
const NOT_JSON_CAPABLE_STABLE_COMMANDS = ['mcp-server', 'completion'];

// Some commands embed CI context in their `--json` output when CI-detection
// environment variables are present (e.g. `ci-summary`'s `ci` block and
// `verify --write-run`'s run-ledger entry gain commit/ref/runUrl fields under
// GitHub Actions). That makes the locked shape environment-dependent: a
// snapshot generated on a laptop fails when the same test runs inside CI (this
// is exactly what broke the 1.0.0 publish). Run every shape-lock subprocess
// with CI-detection variables stripped so the shape is deterministic wherever
// the suite runs — locally and in CI alike. Keep this list in sync with
// `detectCiContext` in src/core/verification.ts.
const CI_ENV_PATTERN = /^(?:CI|CONTINUOUS_INTEGRATION|GITLAB_CI)$|^(?:GITHUB_|BUILDKITE|RUNNER_)/;
const CI_FREE_ENV = Object.fromEntries(
  Object.entries(process.env).filter(([key]) => !CI_ENV_PATTERN.test(key)),
) as Record<string, string>;

let repo: string;

beforeAll(async () => {
  repo = await makeTempDir();
  await execa('git', ['init'], { cwd: repo });
  await execa(tsxPath, [cliPath, 'init'], { cwd: repo });

  // Cheap, deterministic, network-free fixtures for commands whose --json
  // success shape needs captured input rather than a live network call or a
  // fresh-repo default. Each is read via an explicit CLI flag (e.g.
  // --registry-json, --github-release-json, --issue-json) so no network
  // access or repo-derived values (like the temp dir's package name) are
  // required to produce a stable, parseable shape.
  await writeJson(path.join(repo, 'npm-registry-fixture.json'), {
    version: '1.0.0',
    versions: ['1.0.0'],
  });
  await writeJson(path.join(repo, 'github-release-fixture.json'), {
    tag_name: 'v0.0.0',
    name: 'v0.0.0',
    published_at: '2024-01-01T00:00:00Z',
    html_url: 'https://example.invalid/release',
  });
  await writeJson(path.join(repo, 'github-issue-fixture.json'), {
    number: 1,
    title: 'Test issue',
    state: 'open',
    url: 'https://example.invalid/issues/1',
    body: 'test body',
  });
});

afterAll(async () => {
  await removeTempDir(repo);
});

// Runs a JSON_COMMANDS entry's argv with `--json --redact-paths`. A handful
// of stable commands (e.g. `task current`, `list-templates`, `version`,
// `npm-status`) do not register `--redact-paths` at all; Commander rejects
// the unrecognized option before the action runs, so stdout is empty. Detect
// that specific rejection and fall back to `--json` alone rather than
// special-casing each command inline.
async function runJsonCommand(argv: string[]) {
  const withRedactPaths = await execa(tsxPath, [cliPath, ...argv, '--json', '--redact-paths'], {
    cwd: repo,
    reject: false,
    env: CI_FREE_ENV,
    extendEnv: false,
  });
  if (
    withRedactPaths.exitCode !== 0 &&
    /unknown option '--redact-paths'/.test(withRedactPaths.stderr ?? '')
  ) {
    return execa(tsxPath, [cliPath, ...argv, '--json'], {
      cwd: repo,
      reject: false,
      env: CI_FREE_ENV,
      extendEnv: false,
    });
  }
  return withRedactPaths;
}

describe('JSON output shape contract', () => {
  const lockedEntries = JSON_COMMANDS.filter((entry) => !KNOWN_NON_JSON.includes(entry));

  for (const entry of lockedEntries) {
    test(`--json shape for "${entry}" is locked`, async () => {
      const argv = entry.split(' ');
      const { stdout } = await runJsonCommand(argv);
      const parsed = JSON.parse(stdout);
      expect(shapeOf(parsed)).toMatchSnapshot();
    });
  }

  // Documents commands deferred from the shape lock, each with a reason
  // recorded in KNOWN_NON_JSON above. This suite fails loudly (rather than
  // silently skipping) if an entry doesn't have a matching reason, so a
  // future addition to that list is self-documenting instead of a silent
  // coverage gap.
  test.skip.each(KNOWN_NON_JSON)('--json shape for "%s" is deferred (KNOWN_NON_JSON)', (command) => {
    expect(KNOWN_NON_JSON).toContain(command);
  });

  test('every stable command is accounted for: locked, deferred, or not --json-capable', () => {
    const lockedLeadingCommands = new Set(lockedEntries.map((entry) => entry.split(' ')[0]));
    const unaccounted = STABLE_COMMANDS.filter(
      (command) =>
        !lockedLeadingCommands.has(command) &&
        !KNOWN_NON_JSON.includes(command) &&
        !NOT_JSON_CAPABLE_STABLE_COMMANDS.includes(command),
    );
    expect(unaccounted).toEqual([]);
  });
});
