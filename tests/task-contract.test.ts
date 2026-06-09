import { describe, expect, test } from 'vitest';
import { generateTaskContract } from '../src/core/task-contract.js';

describe('task contract generation', () => {
  test('generates a complete markdown task contract', () => {
    const markdown = generateTaskContract({
      title: 'Add settings page',
      type: 'feature',
      createdDate: '2026-06-09',
      problemStatement: 'Users cannot configure preferences.',
      desiredOutcome: 'Users can update settings.',
      constraints: ['No database changes'],
      nonGoals: ['Do not redesign navigation'],
      assumptions: ['Settings are local for now'],
      likelyFiles: ['src/settings.ts'],
      forbiddenFiles: ['migrations/'],
      acceptanceCriteria: ['Settings page renders'],
      verificationCommands: ['pnpm test'],
      rollbackNotes: 'Revert the feature files.',
    });

    expect(markdown).toContain('# Add settings page');
    expect(markdown).toContain('Task type: feature');
    expect(markdown).toContain('No database changes');
    expect(markdown).toContain('## Handoff Requirements');
  });
});
