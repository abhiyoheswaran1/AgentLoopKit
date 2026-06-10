import path from 'node:path';
import { execa } from 'execa';
import { describe, expect, test } from 'vitest';
import { renderCompletionScript } from '../src/core/completions.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

describe('completion scripts', () => {
  test('renders zsh completions for commands, task statuses, and agent names', () => {
    const script = renderCompletionScript('zsh');

    expect(script).toContain('#compdef agentloop agentloopkit');
    expect(script).toContain('report:Write a local HTML evidence report');
    expect(script).toContain('badge:Write a local SVG evidence badge');
    expect(script).toContain('policy:List or inspect local AgentLoopKit policies');
    expect(script).toContain('show:Show a local policy');
    expect(script).toContain('status:Show local policy template status');
    expect(script).toContain('task:List, inspect, update, or archive task contracts');
    expect(script).toContain('status:Update a task contract status');
    expect(script).toContain('in-progress');
    expect(script).toContain('claude-code');
    expect(script).toContain('github-copilot-cli');
  });

  test('renders bash completions for nested task and install-agent values', () => {
    const script = renderCompletionScript('bash');

    expect(script).toContain('_agentloop_completion()');
    expect(script).toContain('COMPREPLY');
    expect(script).toContain('list show set status archive current clear');
    expect(script).toContain('compgen -W "list show status"');
    expect(script).toContain(
      'codex claude-code cursor opencode gemini-cli github-copilot-cli generic all',
    );
  });

  test('renders fish completions without mutating shell config', () => {
    const script = renderCompletionScript('fish');

    expect(script).toContain('complete -c agentloop');
    expect(script).toContain("complete -c agentloop -n '__fish_seen_subcommand_from task'");
    expect(script).toContain("complete -c agentloop -n '__fish_seen_subcommand_from policy'");
    expect(script).toContain('review');
    expect(script).not.toContain('config.fish');
  });

  test('rejects unsupported shells', () => {
    expect(() => renderCompletionScript('powershell')).toThrow('Unsupported shell');
  });
});

describe('completion command', () => {
  test('prints a zsh completion script from the CLI', async () => {
    const result = await execa(tsxPath, [cliPath, 'completion', 'zsh']);

    expect(result.stdout).toContain('#compdef agentloop agentloopkit');
    expect(result.stdout).toContain('install-agent');
  });

  test('fails clearly for unsupported shells from the CLI', async () => {
    const result = await execa(tsxPath, [cliPath, 'completion', 'powershell'], {
      reject: false,
    });

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('Unsupported shell');
  });
});
