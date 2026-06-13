import { describe, expect, test } from 'vitest';
import { looksLikePostVerificationGate } from '../src/core/post-verification-gates.js';

describe('post-verification gate detection', () => {
  test.each([
    'agentloop ship',
    'agentloopkit prepare-pr --github-comment',
    'npx --yes agentloopkit prepare-pr --github-comment',
    'npx --no-install agentloop ship',
    'pnpm exec agentloop check-gates --strict',
    'npm exec agentloop maintainer-check',
    'yarn agentloop handoff',
    'node dist/cli/index.js ship --github-comment',
    'tsx src/cli/index.ts prepare-pr',
    'npm run dogfood:strict',
    'node dist/cli/index.js release-check --strict',
  ])('flags %s as a post-verification gate', (command) => {
    expect(looksLikePostVerificationGate(command)).toBe(true);
  });

  test.each([
    'echo agentloop ship',
    'printf "agentloop prepare-pr"',
    'npm run agentloop ship',
    'pnpm run agentloop check-gates',
    'node scripts/print-command.mjs agentloop ship',
    'npm run ship',
    'pnpm ship',
    'ship',
    'prepare-pr',
  ])('does not flag %s when AgentLoop words are not the invoked command', (command) => {
    expect(looksLikePostVerificationGate(command)).toBe(false);
  });
});
