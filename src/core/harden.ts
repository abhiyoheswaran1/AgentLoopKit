import {
  extractMarkdownSectionLines,
  findPlaceholderTaskSections,
  type TaskType,
} from './task-contract.js';

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
  return findPlaceholderTaskSections(markdown).map((heading, i) => ({
    id: makeSoftSpotId('placeholder', heading, i),
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

// Detection rules are added in later tasks and pushed in this fixed order.
export function analyzeContract(markdown: string): SoftSpot[] {
  return [
    ...placeholderRule(markdown),
    ...unboundedScopeRule(markdown),
    ...unstatedAssumptionRule(markdown),
  ];
}
