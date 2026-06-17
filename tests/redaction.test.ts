import { describe, expect, test } from 'vitest';
import { redactLocalRoots } from '../src/core/redaction.js';

describe('redaction', () => {
  test('redacts Windows root path variants with slash and drive-letter changes', () => {
    const root = 'D:\\a\\AgentLoopKit\\repo';
    const text = [
      'D:\\a\\AgentLoopKit\\repo\\.agentloop\\state.json',
      'D:/a/AgentLoopKit/repo/.agentloop/state.json',
      'd:\\a\\AgentLoopKit\\repo\\.agentloop\\state.json',
      'd:/a/AgentLoopKit/repo/.agentloop/state.json',
    ].join('\n');

    const redacted = redactLocalRoots(text, [root]);

    expect(redacted).toContain('[git-root]\\.agentloop\\state.json');
    expect(redacted).toContain('[git-root]/.agentloop/state.json');
    expect(redacted).not.toContain('D:\\a\\AgentLoopKit\\repo');
    expect(redacted).not.toContain('D:/a/AgentLoopKit/repo');
    expect(redacted).not.toContain('d:\\a\\AgentLoopKit\\repo');
    expect(redacted).not.toContain('d:/a/AgentLoopKit/repo');
  });

  test('infers local roots from absolute AgentLoop artifact paths', () => {
    const text = [
      'Report: D:\\a\\AgentLoopKit\\repo\\.agentloop\\reports\\local-report.md',
      'Handoff: /tmp/agentloopkit/repo/.agentloop/handoffs/local-handoff.md',
    ].join('\n');

    const redacted = redactLocalRoots(text, []);

    expect(redacted).toContain('[git-root]\\.agentloop\\reports\\local-report.md');
    expect(redacted).toContain('[git-root]/.agentloop/handoffs/local-handoff.md');
    expect(redacted).not.toContain('D:\\a\\AgentLoopKit\\repo');
    expect(redacted).not.toContain('/tmp/agentloopkit/repo');
  });

  test('infers local roots from labeled absolute paths', () => {
    const text = [
      'Smoke repo root: D:\\a\\AgentLoopKit\\repo',
      'Smoke real git root: /tmp/agentloopkit/repo',
    ].join('\n');

    const redacted = redactLocalRoots(text, []);

    expect(redacted).toContain('Smoke repo root: [git-root]');
    expect(redacted).toContain('Smoke real git root: [git-root]');
    expect(redacted).not.toContain('D:\\a\\AgentLoopKit\\repo');
    expect(redacted).not.toContain('/tmp/agentloopkit/repo');
  });
});
