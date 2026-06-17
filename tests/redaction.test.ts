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
});
