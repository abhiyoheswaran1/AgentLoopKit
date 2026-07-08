import {
  extractMarkdownSectionLines,
  findPlaceholderTaskSections,
  isFenceDelimiterLine,
  type TaskType,
} from './task-contract.js';
import { stripVerifiedByTag } from './criteria-coverage.js';

export type SoftSpotType =
  | 'placeholder'
  | 'untestable-acceptance'
  | 'unbounded-scope'
  | 'unstated-assumption'
  | 'contradiction';

export type SoftSpotSeverity = 'blocking' | 'advisory';

export interface SoftSpot {
  id: string;
  type: SoftSpotType;
  section: string;
  question: string;
  severity: SoftSpotSeverity;
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function makeSoftSpotId(type: SoftSpotType, section: string, ordinal: number): string {
  return `${type}:${slug(section)}:${ordinal}`;
}

const ASSUMPTION_SENSITIVE_TYPES: TaskType[] = ['feature', 'refactor', 'migration', 'dependency-upgrade'];
const EMPTY_MARKERS = new Set(['none recorded yet.', 'none.', '']);

const STOPWORDS = new Set([
  'the', 'and', 'for', 'with', 'this', 'that', 'from', 'into', 'when', 'must',
  'works', 'work', 'new', 'add', 'adds', 'change', 'changes', 'flow', 'well', 'feature',
]);

// A line is "verifiable" if it references a command, path, number/comparison, or a proof verb.
const PROOF_HINTS = /`[^`]+`|\bnpm\b|\bnpx\b|\.(ts|js|md|json)\b|\d|\b(?:passes|returns|exit|output|snapshot|matches|equals)\b|>=|<=|<|>/i;

function readTaskType(markdown: string): TaskType | undefined {
  const match = markdown.match(/^- Task type:\s*(.+)$/m);
  return match ? (match[1].trim() as TaskType) : undefined;
}

function isEmptySection(markdown: string, heading: string): boolean {
  const lines = extractMarkdownSectionLines(markdown, heading)
    .map((l) => l.replace(/^-\s*/, '').trim().toLowerCase());
  return lines.length === 0 || lines.every((l) => EMPTY_MARKERS.has(l));
}

function placeholderRule(markdown: string): SoftSpot[] {
  return findPlaceholderTaskSections(markdown).map((heading) => ({
    id: makeSoftSpotId('placeholder', heading, 0),
    type: 'placeholder',
    section: heading,
    question: `"${heading}" still holds its template placeholder — fill it in with real content.`,
    severity: 'blocking',
  }));
}

function unboundedScopeRule(markdown: string): SoftSpot[] {
  const section = 'Files or Areas Not to Touch';
  if (!isEmptySection(markdown, section)) return [];
  return [{
    id: makeSoftSpotId('unbounded-scope', section, 0),
    type: 'unbounded-scope',
    section,
    question: 'Which files or areas must this change NOT touch? An empty list means guard cannot flag scope creep.',
    severity: 'blocking',
  }];
}

function unstatedAssumptionRule(markdown: string): SoftSpot[] {
  const type = readTaskType(markdown);
  if (!type || !ASSUMPTION_SENSITIVE_TYPES.includes(type)) return [];
  if (!isEmptySection(markdown, 'Assumptions')) return [];
  return [{
    id: makeSoftSpotId('unstated-assumption', 'Assumptions', 0),
    type: 'unstated-assumption',
    section: 'Assumptions',
    question: `This is a "${type}" task with no assumptions listed — what are you taking for granted that could be wrong?`,
    severity: 'advisory',
  }];
}

function significantTokens(line: string): Set<string> {
  return new Set(
    line.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/)
      .filter((w) => w.length > 3 && !STOPWORDS.has(w)),
  );
}

function acceptanceLines(markdown: string): string[] {
  return extractMarkdownSectionLines(markdown, 'Acceptance Criteria')
    // A fenced code block's opening/closing delimiter is markdown syntax
    // scaffolding, not a criterion in its own right — without this it would
    // itself get flagged as "untestable" (in harden-resolve.ts's matching
    // replaceAcceptanceLine ordinal loop, skipping it too keeps the two
    // files' line-counting aligned so in-place replacement can't land on a
    // fence marker and corrupt it).
    .filter((l) => !isFenceDelimiterLine(l))
    .map((l) => l.replace(/^-\s*/, '').trim())
    .filter(Boolean)
    .filter((l) => l.toLowerCase() !== 'add acceptance criteria before implementation starts.')
    // Strip the `(verified by: ...)` tag before it reaches the untestable/
    // contradiction rules — the tag's own tokens/digits must not mask an
    // untestable line or manufacture a false contradiction with Non-Goals.
    .map((l) => stripVerifiedByTag(l));
}

function untestableAcceptanceRule(markdown: string): SoftSpot[] {
  return acceptanceLines(markdown)
    .map((line, i) => ({ line, i }))
    .filter(({ line }) => !PROOF_HINTS.test(line))
    .map(({ line, i }) => ({
      id: makeSoftSpotId('untestable-acceptance', 'Acceptance Criteria', i),
      type: 'untestable-acceptance' as const,
      section: 'Acceptance Criteria',
      question: `"${line}" has no checkable predicate — what command or observable output proves it?`,
      severity: 'blocking' as const,
    }));
}

function contradictionRule(markdown: string): SoftSpot[] {
  const nonGoalTokens = extractMarkdownSectionLines(markdown, 'Non-Goals')
    .filter((l) => !EMPTY_MARKERS.has(l.replace(/^-\s*/, '').trim().toLowerCase()))
    .flatMap((l) => [...significantTokens(l)]);
  const nonGoalSet = new Set(nonGoalTokens);
  if (nonGoalSet.size === 0) return [];
  const spots: SoftSpot[] = [];
  acceptanceLines(markdown).forEach((line, i) => {
    const shared = [...significantTokens(line)].find((t) => nonGoalSet.has(t));
    if (shared) {
      spots.push({
        id: makeSoftSpotId('contradiction', 'Acceptance Criteria', i),
        type: 'contradiction',
        section: 'Acceptance Criteria',
        question: `Acceptance criterion "${line}" overlaps Non-Goals on "${shared}" — which one wins?`,
        severity: 'blocking',
      });
    }
  });
  return spots;
}

// Detection rules are added in later tasks and pushed in this fixed order.
export function analyzeContract(markdown: string): SoftSpot[] {
  return [
    ...placeholderRule(markdown),
    ...unboundedScopeRule(markdown),
    ...unstatedAssumptionRule(markdown),
    ...untestableAcceptanceRule(markdown),
    ...contradictionRule(markdown),
  ];
}

export function hasBlockingSoftSpots(spots: SoftSpot[]): boolean {
  return spots.some((s) => s.severity === 'blocking');
}

export function hardenNextAction(blockingCount: number): { command: string; reason: string } {
  return {
    command: 'agentloop harden',
    reason: `${blockingCount} blocking soft spot(s) in the task contract — harden it before implementing or verifying.`,
  };
}

export function toHardenJson(spots: SoftSpot[]) {
  return {
    blocking: spots.filter((s) => s.severity === 'blocking').length,
    advisory: spots.filter((s) => s.severity === 'advisory').length,
    softSpots: spots,
  };
}

export function renderSoftSpotsText(spots: SoftSpot[]): string {
  if (spots.length === 0) return 'No soft spots — this contract is hardened.';
  const group = (arr: SoftSpot[]) =>
    arr.map((s) => `  [${s.id}] ${s.question}`).join('\n');
  const blocking = spots.filter((s) => s.severity === 'blocking');
  const advisory = spots.filter((s) => s.severity === 'advisory');
  const parts: string[] = [];
  if (blocking.length) parts.push(`${blocking.length} blocking soft spot(s):\n${group(blocking)}`);
  if (advisory.length) parts.push(`${advisory.length} advisory soft spot(s):\n${group(advisory)}`);
  return parts.join('\n\n');
}
