import type { GitFileStatus } from './git.js';
import { isAgentLoopEvidenceFile } from './agentloop-evidence.js';
import { renderChangeAreaCounts } from './change-areas.js';
import { listItems as markdownListItems, sectionContent } from './markdown-sections.js';

export type ReadinessGateStatus = 'pass' | 'warn' | 'fail';

export type ReadinessTaskInput = {
  path: string;
  title: string;
  status: string;
  content: string;
};

export type ReadinessVerificationInput = {
  status: 'pass' | 'fail' | 'missing' | 'unknown';
  fresh: boolean;
  path?: string;
};

export type ReadinessGateInput = {
  id: string;
  name: string;
  status: ReadinessGateStatus;
  message: string;
  path?: string;
};

export type ReadinessGatesInput = {
  overallStatus: ReadinessGateStatus;
  gates: ReadinessGateInput[];
};

export type ReadinessHandoffInput = {
  path: string;
};

export type ReadinessScoreInput = {
  task: ReadinessTaskInput | null;
  changedFiles: GitFileStatus[];
  verification: ReadinessVerificationInput;
  gates: ReadinessGatesInput | null;
  handoff: ReadinessHandoffInput | null;
};

export type ReadinessDimension = {
  id:
    | 'task-clarity'
    | 'scope-control'
    | 'verification-evidence'
    | 'evidence-freshness'
    | 'policy-gate-compliance'
    | 'handoff-readiness'
    | 'risk-flags';
  label: string;
  score: number;
  weight: number;
  reason: string;
};

export type ReviewReadinessResult = {
  totalScore: number;
  dimensions: ReadinessDimension[];
  strengths: string[];
  warnings: string[];
  blockers: string[];
  recommendedNextActions: string[];
  claims: string[];
};

const READINESS_CLAIMS = [
  'This is a review-readiness score, not a code-quality score.',
  'The score is deterministic and based only on local AgentLoopKit evidence.',
];

function listItems(section: string) {
  return markdownListItems(section).filter((line) => !/^none recorded yet\.$/i.test(line));
}

function hasMeaningfulText(value: string, placeholders: RegExp[]) {
  const clean = value.trim();
  return Boolean(clean) && !placeholders.some((pattern) => pattern.test(clean));
}

function uniquePush(values: string[], value: string) {
  if (!values.includes(value)) values.push(value);
}

function taskClarity(input: ReadinessScoreInput, strengths: string[], blockers: string[]) {
  if (!input.task) {
    blockers.push('No task contract found.');
    return dimension(
      'task-clarity',
      'Task clarity',
      0,
      15,
      'No task contract is active or discoverable.',
    );
  }

  const content = input.task.content;
  let score = 0;
  const problem = sectionContent(content, 'Problem Statement');
  const outcome = sectionContent(content, 'Desired Outcome');
  const acceptance = listItems(sectionContent(content, 'Acceptance Criteria'));
  const verification = listItems(sectionContent(content, 'Verification Commands'));
  const risk = listItems(sectionContent(content, 'Risk Notes'));
  const rollback = sectionContent(content, 'Rollback Notes');

  if (hasMeaningfulText(problem, [/^describe the problem/i])) score += 20;
  if (hasMeaningfulText(outcome, [/^describe the concrete result/i])) score += 20;
  if (acceptance.length > 0 && !acceptance.some((item) => /^add acceptance criteria/i.test(item))) {
    score += 30;
  }
  if (verification.length > 0 && !verification.some((item) => /^no verification command/i.test(item))) {
    score += 20;
  }
  if (risk.length > 0 && hasMeaningfulText(rollback, [/^document how to revert/i])) score += 10;

  if (score >= 90) {
    strengths.push(
      'Task contract has problem, outcome, acceptance criteria, verification commands, risk notes, and rollback notes.',
    );
  }

  return dimension('task-clarity', 'Task clarity', score, 15, `${score}/100 task evidence present.`);
}

function riskSensitiveFiles(changedFiles: GitFileStatus[]) {
  return changedFiles
    .map((file) => file.path.replace(/\\/g, '/'))
    .filter((filePath) => {
      if (/^tests?\//.test(filePath) || /(^|\/)__tests__\//.test(filePath)) return false;
      return (
        /(^|\/)(migrations?|migration)(\/|\.|-|_|$)/.test(filePath) ||
        /(^|\/)(auth|security|billing|deploy|deployment)(\/|\.|-|_|$)/.test(filePath) ||
        /(^|\/)\.env(\.|$)/.test(filePath) ||
        /(^|\/)(package-lock\.json|pnpm-lock\.yaml|yarn\.lock|bun\.lockb?|Cargo\.lock|poetry\.lock)$/.test(
          filePath,
        )
      );
    });
}

function scopeControl(input: ReadinessScoreInput, warnings: string[]) {
  const totalCount = input.changedFiles.length;
  const nonEvidenceFiles = input.changedFiles.filter((file) => !isAgentLoopEvidenceFile(file.path));
  const count = nonEvidenceFiles.length;
  const evidenceCount = totalCount - count;
  const risky = riskSensitiveFiles(input.changedFiles);
  let score = 100;
  let reason =
    evidenceCount > 0
      ? `${count} non-evidence changed file(s); ${evidenceCount} AgentLoop evidence file(s) also present (${totalCount} total).`
      : `${count} changed file(s).`;

  if (count === 0) {
    score = 60;
    if (totalCount === 0) {
      reason = 'No changed files detected.';
      warnings.push('No changed files detected.');
    } else {
      reason = `No non-evidence changed files detected; ${evidenceCount} AgentLoop evidence file(s) also present (${totalCount} total).`;
      warnings.push('No non-evidence changed files detected.');
    }
  } else if (count > 25) {
    score = 45;
    const areaCounts = renderChangeAreaCounts(nonEvidenceFiles);
    const areaSuffix = areaCounts ? ` Non-evidence review areas: ${areaCounts}.` : '';
    reason =
      evidenceCount > 0
        ? `${count} non-evidence changed files is broad for one review; ${evidenceCount} AgentLoop evidence file(s) also present (${totalCount} total).${areaSuffix}`
        : `${count} changed files is broad for one review.${areaSuffix}`;
    warnings.push(
      evidenceCount > 0
        ? 'Large non-evidence change set; consider splitting before review.'
        : 'Large change set; consider splitting before review.',
    );
  } else if (count > 10) {
    score = 75;
    reason =
      evidenceCount > 0
        ? `${count} non-evidence changed files is reviewable but not small; ${evidenceCount} AgentLoop evidence file(s) also present (${totalCount} total).`
        : `${count} changed files is reviewable but not small.`;
    warnings.push(
      evidenceCount > 0
        ? 'Medium-sized non-evidence change set; check scope carefully.'
        : 'Medium-sized change set; check scope carefully.',
    );
  }

  if (risky.length > 0) score = Math.max(0, score - 15);
  return dimension('scope-control', 'Scope control', score, 15, reason);
}

function verificationEvidence(
  input: ReadinessScoreInput,
  strengths: string[],
  blockers: string[],
  actions: string[],
) {
  if (input.verification.status === 'pass') {
    strengths.push('Verification evidence is passing.');
    return dimension(
      'verification-evidence',
      'Verification evidence',
      100,
      25,
      'Latest verification report passed.',
    );
  }

  blockers.push('No passing verification evidence found.');
  uniquePush(actions, 'Run verification with agentloop verify.');
  return dimension(
    'verification-evidence',
    'Verification evidence',
    input.verification.status === 'fail' ? 20 : 0,
    25,
    input.verification.status === 'fail'
      ? 'Latest verification report failed.'
      : 'No verification report was found.',
  );
}

function evidenceFreshness(input: ReadinessScoreInput, blockers: string[], actions: string[]) {
  if (input.verification.status === 'pass' && input.verification.fresh) {
    return dimension(
      'evidence-freshness',
      'Evidence freshness',
      100,
      15,
      'Verification evidence matches current task timing.',
    );
  }

  if (input.verification.status !== 'missing' && !input.verification.fresh) {
    blockers.push('Verification evidence is stale.');
    uniquePush(actions, 'Rerun verification for the current task.');
  }

  return dimension(
    'evidence-freshness',
    'Evidence freshness',
    0,
    15,
    'Fresh passing verification evidence is missing.',
  );
}

function gateCompliance(
  input: ReadinessScoreInput,
  strengths: string[],
  warnings: string[],
  blockers: string[],
  actions: string[],
) {
  if (!input.gates) {
    warnings.push('Review gates were not run.');
    uniquePush(actions, 'Run agentloop check-gates and resolve failures.');
    return dimension(
      'policy-gate-compliance',
      'Policy and gate compliance',
      40,
      15,
      'No gate evidence was provided.',
    );
  }

  if (input.gates.overallStatus === 'fail') {
    blockers.push('Review gates failed.');
    uniquePush(actions, 'Run agentloop check-gates and resolve failures.');
    return dimension(
      'policy-gate-compliance',
      'Policy and gate compliance',
      0,
      15,
      'At least one review gate failed.',
    );
  }

  if (input.gates.overallStatus === 'warn') {
    warnings.push('Review gates have warnings.');
    return dimension(
      'policy-gate-compliance',
      'Policy and gate compliance',
      70,
      15,
      'Review gates passed with warnings.',
    );
  }

  strengths.push('Review gates pass.');
  return dimension(
    'policy-gate-compliance',
    'Policy and gate compliance',
    100,
    15,
    'Review gates passed.',
  );
}

function handoffReadiness(
  input: ReadinessScoreInput,
  strengths: string[],
  warnings: string[],
  actions: string[],
) {
  if (input.handoff) {
    strengths.push('Reviewer handoff exists.');
    return dimension(
      'handoff-readiness',
      'Handoff readiness',
      100,
      10,
      'Reviewer handoff evidence exists.',
    );
  }

  warnings.push('No reviewer handoff found.');
  uniquePush(actions, 'Generate a reviewer handoff with agentloop handoff.');
  return dimension(
    'handoff-readiness',
    'Handoff readiness',
    40,
    10,
    'Reviewer handoff evidence is missing.',
  );
}

function riskFlags(input: ReadinessScoreInput, warnings: string[], actions: string[]) {
  const risky = riskSensitiveFiles(input.changedFiles);
  if (risky.length === 0) {
    return dimension('risk-flags', 'Risk flags', 100, 5, 'No risk-sensitive files detected.');
  }

  warnings.push(`Risk-sensitive files changed: ${risky.join(', ')}`);
  uniquePush(actions, 'Review risk-sensitive files before merge.');
  const hasRiskNotes = input.task
    ? listItems(sectionContent(input.task.content, 'Risk Notes')).length > 0
    : false;
  return dimension(
    'risk-flags',
    'Risk flags',
    hasRiskNotes ? 70 : 40,
    5,
    hasRiskNotes
      ? 'Risk-sensitive files changed and risk notes are present.'
      : 'Risk-sensitive files changed without risk notes.',
  );
}

function dimension(
  id: ReadinessDimension['id'],
  label: string,
  score: number,
  weight: number,
  reason: string,
): ReadinessDimension {
  return {
    id,
    label,
    score: Math.max(0, Math.min(100, Math.round(score))),
    weight,
    reason,
  };
}

function totalScore(dimensions: ReadinessDimension[]) {
  const weighted = dimensions.reduce((sum, item) => sum + item.score * item.weight, 0);
  const weights = dimensions.reduce((sum, item) => sum + item.weight, 0);
  return Math.round(weighted / weights);
}

export function evaluateReviewReadiness(input: ReadinessScoreInput): ReviewReadinessResult {
  const strengths: string[] = [];
  const warnings: string[] = [];
  const blockers: string[] = [];
  const recommendedNextActions: string[] = [];

  if (!input.task) {
    uniquePush(
      recommendedNextActions,
      'Create or pin a task contract with agentloop create-task or agentloop task set <path>.',
    );
  }

  const dimensions = [
    taskClarity(input, strengths, blockers),
    scopeControl(input, warnings),
    verificationEvidence(input, strengths, blockers, recommendedNextActions),
    evidenceFreshness(input, blockers, recommendedNextActions),
    gateCompliance(input, strengths, warnings, blockers, recommendedNextActions),
    handoffReadiness(input, strengths, warnings, recommendedNextActions),
    riskFlags(input, warnings, recommendedNextActions),
  ];

  return {
    totalScore: totalScore(dimensions),
    dimensions,
    strengths,
    warnings,
    blockers,
    recommendedNextActions,
    claims: READINESS_CLAIMS,
  };
}
