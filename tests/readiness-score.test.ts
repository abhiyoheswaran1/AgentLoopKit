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

const taskWithFinalRiskNotes = `# Fix login redirect bug

- Created date: 2026-06-11
- Task type: bugfix
- Status: in-progress

## Problem Statement
Login redirects users to the wrong page after password reset.

## Desired Outcome
Users land on the intended destination after a successful login.

## Acceptance Criteria
- Password-reset login redirects to the requested page.

## Verification Commands
- npm test -- auth

## Rollback Notes
Revert the auth callback change.

## Risk Notes
- Auth flow touched; review redirect edge cases.
`;

const taskWithFinalPlaceholderRiskNotes = taskWithFinalRiskNotes.replace(
  '- Auth flow touched; review redirect edge cases.',
  '- None recorded yet.',
);

function dimensionById(result: ReturnType<typeof evaluateReviewReadiness>, id: string) {
  return result.dimensions.find((dimension) => dimension.id === id);
}

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

  test('counts rollback notes when the rollback section is final', () => {
    const result = evaluateReviewReadiness({
      task: {
        path: '.agentloop/tasks/fix-login.md',
        title: 'Fix login redirect bug',
        status: 'in-progress',
        content: clearTask,
      },
      changedFiles: [{ status: 'M', path: 'src/status.ts' }],
      verification: { status: 'pass', fresh: true },
      gates: { overallStatus: 'pass', gates: [] },
      handoff: {
        path: '.agentloop/handoffs/2026-06-11-12-05-pr-summary.md',
      },
    });

    expect(dimensionById(result, 'task-clarity')).toMatchObject({
      score: 100,
      reason: '100/100 task evidence present.',
    });
  });

  test('counts final risk notes for risk-sensitive changed files', () => {
    const result = evaluateReviewReadiness({
      task: {
        path: '.agentloop/tasks/fix-login.md',
        title: 'Fix login redirect bug',
        status: 'in-progress',
        content: taskWithFinalRiskNotes,
      },
      changedFiles: [{ status: 'M', path: 'src/auth/callback.ts' }],
      verification: { status: 'pass', fresh: true },
      gates: { overallStatus: 'pass', gates: [] },
      handoff: {
        path: '.agentloop/handoffs/2026-06-11-12-05-pr-summary.md',
      },
    });

    expect(dimensionById(result, 'risk-flags')).toMatchObject({
      score: 70,
      reason: 'Risk-sensitive files changed and risk notes are present.',
    });
  });

  test('ignores placeholder risk notes in final sections', () => {
    const result = evaluateReviewReadiness({
      task: {
        path: '.agentloop/tasks/fix-login.md',
        title: 'Fix login redirect bug',
        status: 'in-progress',
        content: taskWithFinalPlaceholderRiskNotes,
      },
      changedFiles: [{ status: 'M', path: 'src/auth/callback.ts' }],
      verification: { status: 'pass', fresh: true },
      gates: { overallStatus: 'pass', gates: [] },
      handoff: {
        path: '.agentloop/handoffs/2026-06-11-12-05-pr-summary.md',
      },
    });

    expect(dimensionById(result, 'risk-flags')).toMatchObject({
      score: 40,
      reason: 'Risk-sensitive files changed without risk notes.',
    });
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

  test('scores ship scope control from non-evidence changed files', () => {
    const evidenceFiles = Array.from({ length: 30 }, (_, index) => ({
      status: '??' as const,
      path: `.agentloop/reports/2026-06-11-12-${String(index).padStart(2, '0')}-verification-report.md`,
    }));

    const result = evaluateReviewReadiness({
      task: {
        path: '.agentloop/tasks/add-status-copy.md',
        title: 'Add status copy',
        status: 'in-progress',
        content: clearTask,
      },
      changedFiles: [{ status: 'M', path: 'src/status.ts' }, ...evidenceFiles],
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

    const scopeControl = result.dimensions.find((dimension) => dimension.id === 'scope-control');

    expect(scopeControl).toEqual(
      expect.objectContaining({
        score: 100,
        reason: '1 non-evidence changed file(s); 30 AgentLoop evidence file(s) also present (31 total).',
      }),
    );
    expect(result.warnings).not.toContain('Large change set; consider splitting before review.');
  });

  test('summarizes review areas when ship scope is broad', () => {
    const changedFiles = [
      ...Array.from({ length: 14 }, (_, index) => ({
        status: 'M' as const,
        path: `src/feature-${index}.ts`,
      })),
      ...Array.from({ length: 8 }, (_, index) => ({
        status: 'M' as const,
        path: `tests/feature-${index}.test.ts`,
      })),
      ...Array.from({ length: 4 }, (_, index) => ({
        status: 'M' as const,
        path: `docs/feature-${index}.md`,
      })),
      { status: '??' as const, path: '.agentloop/reports/2026-06-11-12-00-ship-report.md' },
    ];

    const result = evaluateReviewReadiness({
      task: {
        path: '.agentloop/tasks/add-feature.md',
        title: 'Add feature',
        status: 'in-progress',
        content: clearTask,
      },
      changedFiles,
      verification: {
        status: 'pass',
        fresh: true,
        path: '.agentloop/reports/2026-06-11-12-00-verification-report.md',
      },
      gates: {
        overallStatus: 'pass',
        gates: [{ id: 'task-contract', name: 'Task contract', status: 'pass', message: 'Task found.' }],
      },
      handoff: {
        path: '.agentloop/handoffs/2026-06-11-12-05-pr-summary.md',
      },
    });

    expect(dimensionById(result, 'scope-control')).toEqual(
      expect.objectContaining({
        score: 45,
        reason:
          '26 non-evidence changed files is broad for one review; 1 AgentLoop evidence file(s) also present (27 total). Non-evidence review areas: Source 14, Tests 8, Documentation 4.',
      }),
    );
    expect(result.warnings).toContain('Large non-evidence change set; consider splitting before review.');
  });
});
