import path from 'node:path';
import { execa } from 'execa';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { JSON_COMMANDS } from '../../src/core/stable-surface.js';
import { makeTempDir, removeTempDir } from '../helpers.js';
import { shapeOf } from './shape.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

// Commands in JSON_COMMANDS that were audited (WS3, Task 5) and found to emit
// non-JSON on stdout, or otherwise cannot be shape-locked via this harness.
// Empty as of Task 5: every JSON_COMMANDS entry produced parseable JSON with
// `--json --redact-paths` against a freshly-initialized repo. Keep this array
// as the documented escape hatch for the WS2 audit (Task 7) rather than
// silently dropping a command from coverage.
const KNOWN_NON_JSON: string[] = [];

let repo: string;

beforeAll(async () => {
  repo = await makeTempDir();
  await execa('git', ['init'], { cwd: repo });
  await execa(tsxPath, [cliPath, 'init'], { cwd: repo });
});

afterAll(async () => {
  await removeTempDir(repo);
});

describe('JSON output shape contract', () => {
  for (const command of JSON_COMMANDS.filter((c) => !KNOWN_NON_JSON.includes(c))) {
    test(`--json shape for "${command}" is locked`, async () => {
      const { stdout } = await execa(
        tsxPath,
        [cliPath, command, '--json', '--redact-paths'],
        { cwd: repo, reject: false },
      );
      const parsed = JSON.parse(stdout);
      expect(shapeOf(parsed)).toMatchSnapshot();
    });
  }

  // Documents commands deferred from the shape lock because they did not
  // produce parseable JSON stdout during the Task 5 audit. See the WS2 audit
  // (Task 7) report for the resolution. This suite is a no-op while
  // KNOWN_NON_JSON is empty; it exists so a future addition to that list is
  // self-documenting instead of a silent coverage gap.
  test.skip.each(KNOWN_NON_JSON)('--json shape for "%s" is deferred (KNOWN_NON_JSON)', (command) => {
    expect(KNOWN_NON_JSON).toContain(command);
  });
});
