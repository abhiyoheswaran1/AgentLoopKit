import { describe, expect, test } from 'vitest';
import { evaluateReviewReadiness } from '../src/core/readiness-score.js';

const clearTask = `# Fix login redirect bug

- Created date: 2026-06-11
- Task type: bugfix
- Status: in-progress

## Problem Statement
Login redirects users to the wrong page after password reset.

## Desired Outcome
Users land on the intended destination after a successful login.

## Constraints
- Keep the auth callback API unchanged.

## Non-Goals
- Do not redesign the login UI.

## Acceptance Criteria
- Password-reset login redirects to the requested page.
- Existing login redirect tests still pass.

## Verification Commands
- npm test -- auth

## Risk Notes
- Auth flow touched; review redirect edge cases.

## Rollback Notes
Revert the auth callback change.
`;

describe('review readiness scoring', () => {
  test('scores strong review evidence without claiming code quality', () => {
    const result = evaluateReviewReadiness({
      task: {
        path: '.agentloop/tasks/fix-login.md',
        title: 'Fix login redirect bug',
        status: 'in-progress',
        content: clearTask,
      },
      changedFiles: [
        { status: 'M', path: 'src/auth/callback.ts' },
        { status: 'M', path: 'tests/auth/callback.test.ts' },
      ],
      verification: {
        status: 'pass',
        fresh: true,
        path: '.agentloop/reports/2026-06-11-12-00-verification-report.md',
      },
      gates: {
        overallStatus: 'pass',
        gates: [
          { id: 'task-contract', name: 'Task contract', status: 'pass', message: 'Task found.' },
          {
            id: 'verification-report',
            name: 'Verification report',
            status: 'pass',
            message: 'Overall status: pass',
          },
        ],
      },
      handoff: {
        path: '.agentloop/handoffs/2026-06-11-12-05-pr-summary.md',
      },
    });

    expect(result.totalScore).toBeGreaterThanOrEqual(85);
    expect(result.claims).toContain('This is a review-readiness score, not a code-quality score.');
    expect(result.dimensions.map((dimension) => dimension.id)).toEqual([
      'task-clarity',
      'scope-control',
      'verification-evidence',
      'evidence-freshness',
      'policy-gate-compliance',
      'handoff-readiness',
      'risk-flags',
    ]);
    expect(result.blockers).toEqual([]);
    expect(result.strengths).toContain('Task contract has problem, outcome, acceptance criteria, verification commands, risk notes, and rollback notes.');
    expect(result.warnings).toContain('Risk-sensitive files changed: src/auth/callback.ts');
    expect(result.recommendedNextActions).toContain('Review risk-sensitive files before merge.');
  });

  test('reports blockers when task, verification, and gates are missing or stale', () => {
    const result = evaluateReviewReadiness({
      task: null,
      changedFiles: [],
      verification: {
        status: 'missing',
        fresh: false,
      },
      gates: {
        overallStatus: 'fail',
        gates: [
          {
            id: 'task-contract',
            name: 'Task contract',
            status: 'fail',
            message: 'No task contract found.',
          },
        ],
      },
      handoff: null,
    });

    expect(result.totalScore).toBeLessThan(50);
    expect(result.blockers).toContain('No task contract found.');
    expect(result.blockers).toContain('No passing verification evidence found.');
    expect(result.blockers).toContain('Review gates failed.');
    expect(result.warnings).toContain('No changed files detected.');
    expect(result.recommendedNextActions).toEqual([
      'Create or pin a task contract with agentloop create-task or agentloop task set <path>.',
      'Run verification with agentloop verify.',
      'Run agentloop check-gates and resolve failures.',
      'Generate a reviewer handoff with agentloop handoff.',
    ]);
  });
});
