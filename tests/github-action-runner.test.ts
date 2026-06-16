import { readFile } from 'node:fs/promises';
import { describe, expect, test } from 'vitest';
// @ts-expect-error The GitHub Action runner is a plain checked-in ESM script.
// prettier-ignore
import { createActionPlan, parseCommandInput, validateAgentLoopKitVersion } from '../scripts/github-action-runner.mjs';

describe('github action runner', () => {
  test('parses trusted command strings without invoking a shell', async () => {
    expect(parseCommandInput('check-gates --strict')).toEqual(['check-gates', '--strict']);
    expect(parseCommandInput('verify --task ".agentloop/tasks/task with space.md"')).toEqual([
      'verify',
      '--task',
      '.agentloop/tasks/task with space.md',
    ]);
  });

  test('rejects shell metacharacters in command input', async () => {
    expect(() => parseCommandInput('check-gates --strict; echo leaked')).toThrow(
      'Command input contains unsupported shell metacharacters',
    );
  });

  test('validates npm package versions before install', async () => {
    expect(validateAgentLoopKitVersion('latest')).toBe('latest');
    expect(validateAgentLoopKitVersion('0.27.0')).toBe('0.27.0');
    expect(validateAgentLoopKitVersion('1.2.3-beta.1')).toBe('1.2.3-beta.1');
    expect(() => validateAgentLoopKitVersion('--registry=https://example.invalid')).toThrow(
      'Unsupported agentloopkit-version',
    );
  });

  test('creates a safe action plan from environment inputs', async () => {
    expect(
      createActionPlan({
        AGENTLOOPKIT_INSTALL_MODE: 'npm',
        AGENTLOOPKIT_VERSION: '0.27.0',
        AGENTLOOPKIT_COMMAND: 'status --brief',
      }),
    ).toEqual({
      installMode: 'npm',
      packageSpec: 'agentloopkit@0.27.0',
      commandArgs: ['status', '--brief'],
    });
  });

  test('declares GitHub Marketplace metadata with safe input copy', async () => {
    const actionYaml = await readFile('action.yml', 'utf8');

    expect(actionYaml).toContain("name: 'AgentLoopKit'");
    expect(actionYaml).toContain(
      "description: 'Run AgentLoopKit review-readiness checks in GitHub Actions.'",
    );
    expect(actionYaml).toContain("author: 'Baseframe Labs'");
    expect(actionYaml).toContain('branding:');
    expect(actionYaml).toContain("icon: 'check-circle'");
    expect(actionYaml).toContain("color: 'orange'");
    expect(actionYaml).toContain('Do not pass untrusted pull request or user input to command.');
    expect(actionYaml).toContain(
      'Do not pass untrusted pull request or user input to agentloopkit-version.',
    );
    expect(actionYaml).toContain('Do not pass untrusted pull request or user input to install-mode.');
  });
});
