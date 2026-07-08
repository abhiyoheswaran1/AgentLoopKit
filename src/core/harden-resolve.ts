import { AgentLoopError } from './errors.js';
import { analyzeContract, type SoftSpot } from './harden.js';
import { escapeMarkdownProse } from './markdown-format.js';
import {
  findSectionBodyEnd,
  isFenceDelimiterLine,
  normalizeTaskSectionLine,
  REVIEW_CRITICAL_TASK_PLACEHOLDERS,
} from './task-contract.js';

const EMPTY_LINE = /^-\s*(none recorded yet\.|none\.|add acceptance criteria before implementation starts\.)?\s*$/i;
const ACCEPTANCE_PLACEHOLDER = 'add acceptance criteria before implementation starts.';

export class HardenResolutionError extends AgentLoopError {
  constructor(message: string) {
    super(message, 'HARDEN_UNKNOWN_SPOT');
    this.name = 'HardenResolutionError';
  }
}

// Find the [start, end) body-line range of a `## <heading>` section within
// `lines`. `start` is the first line after the heading; `end` is the next
// `## ` heading (or end of file), fence-aware so a `###`/`##` line pasted
// inside a fenced code block does not truncate the section early. Returns
// undefined when the heading is absent.
function sectionBodyRange(lines: string[], heading: string): { start: number; end: number } | undefined {
  const headingIndex = lines.findIndex((l) => l.trim() === `## ${heading}`);
  if (headingIndex === -1) return undefined;
  return { start: headingIndex + 1, end: findSectionBodyEnd(lines, headingIndex + 1) };
}

function appendToSection(markdown: string, heading: string, entry: string): string {
  const lines = markdown.split('\n');
  const headingIndex = lines.findIndex((l) => l.trim() === `## ${heading}`);
  if (headingIndex === -1) {
    return `${markdown.trimEnd()}\n\n## ${heading}\n${entry}\n`;
  }
  const end = findSectionBodyEnd(lines, headingIndex + 1);
  const body = lines.slice(headingIndex + 1, end);
  const placeholderIndex = body.findIndex((l) => EMPTY_LINE.test(l.trim()) && l.trim() !== '');
  if (placeholderIndex >= 0) {
    body[placeholderIndex] = entry;
  } else {
    while (body.length && body[body.length - 1].trim() === '') body.pop();
    body.push(entry);
  }
  return [...lines.slice(0, headingIndex + 1), ...body, ...lines.slice(end)].join('\n');
}

// Replace the qualifying acceptance line at `ordinal` in place. The qualifying
// set matches `acceptanceLines()` in harden.ts: within the Acceptance Criteria
// body, lines that are non-empty after stripping a leading `- ` and are not the
// acceptance placeholder, skipping fence-delimiter lines (``` / ~~~) the same
// way harden.ts does so ordinals stay aligned between the two files — and so
// a fence delimiter can never itself be selected for in-place replacement,
// which would corrupt the fence. In-place replacement keeps other lines'
// ordinals stable, which is what makes the spot converge.
function replaceAcceptanceLine(markdown: string, ordinal: number, entry: string): string {
  const lines = markdown.split('\n');
  const range = sectionBodyRange(lines, 'Acceptance Criteria');
  if (!range) {
    throw new HardenResolutionError('No "Acceptance Criteria" section to resolve against.');
  }
  let count = -1;
  for (let i = range.start; i < range.end; i += 1) {
    const trimmed = lines[i].trim();
    if (!trimmed) continue;
    if (isFenceDelimiterLine(trimmed)) continue;
    const stripped = trimmed.replace(/^-\s*/, '').trim();
    if (!stripped) continue;
    if (stripped.toLowerCase() === ACCEPTANCE_PLACEHOLDER) continue;
    count += 1;
    if (count === ordinal) {
      lines[i] = entry;
      return lines.join('\n');
    }
  }
  throw new HardenResolutionError(`Acceptance line ordinal ${ordinal} is out of range.`);
}

// Replace this section's template placeholder line in place, preserving format:
// list sections keep their leading `- `, paragraph sections stay dash-free.
function replacePlaceholderLine(markdown: string, section: string, clean: string): string {
  const placeholder = REVIEW_CRITICAL_TASK_PLACEHOLDERS.find((p) => p.heading === section)?.placeholder;
  if (!placeholder) {
    throw new HardenResolutionError(`No known placeholder for section "${section}".`);
  }
  const lines = markdown.split('\n');
  const range = sectionBodyRange(lines, section);
  if (!range) {
    throw new HardenResolutionError(`No "${section}" section to resolve against.`);
  }
  for (let i = range.start; i < range.end; i += 1) {
    const trimmed = lines[i].trim();
    if (!trimmed) continue;
    const hadDash = /^-\s*/.test(trimmed);
    if (normalizeTaskSectionLine(trimmed) === placeholder) {
      lines[i] = hadDash ? `- ${clean}` : clean;
      return lines.join('\n');
    }
  }
  throw new HardenResolutionError(`Placeholder for section "${section}" not found.`);
}

export function applyResolution(markdown: string, spotId: string, answer: string): string {
  const spot: SoftSpot | undefined = analyzeContract(markdown).find((s) => s.id === spotId);
  if (!spot) {
    throw new HardenResolutionError(`No open soft spot with id "${spotId}".`);
  }
  // Sanitize once, up front, and reuse everywhere the answer is spliced into
  // the contract. An answer is always a single bullet/line — collapsing
  // newlines prevents it from introducing new markdown line structure, and
  // escapeMarkdownProse (which escapes a leading/embedded `#`, among other
  // markdown-structural characters) prevents it from forging a new heading.
  // Without this, an answer containing "\n\n## Verification Commands\n- ..."
  // could inject a forged section that downstream parsers (e.g. the first
  // `## Verification Commands` block picked up by verification tooling)
  // would treat as real — a local command-injection / verification-bypass
  // vector via a supported CLI flag.
  const clean = escapeMarkdownProse(answer.replace(/[\r\n]+/g, ' ').trim());

  let withAnswer: string;
  switch (spot.type) {
    case 'untestable-acceptance':
    case 'contradiction': {
      const ordinal = Number(spotId.split(':').pop());
      if (!Number.isInteger(ordinal)) {
        throw new HardenResolutionError(`Malformed soft-spot id "${spotId}".`);
      }
      withAnswer = replaceAcceptanceLine(markdown, ordinal, `- ${clean}`);
      break;
    }
    case 'placeholder': {
      withAnswer = replacePlaceholderLine(markdown, spot.section, clean);
      break;
    }
    case 'unbounded-scope':
    case 'unstated-assumption':
    default: {
      withAnswer = appendToSection(markdown, spot.section, `- ${clean}`);
      break;
    }
  }

  const result = appendToSection(withAnswer, 'Hardening Log', `- [${spotId}] ${clean}`);

  // Only record genuine resolutions. If the same soft spot is still present
  // after the write-back, the answer didn't actually converge (e.g. an
  // "untestable-acceptance" resolved with another vague, unverifiable line) —
  // throw instead of returning the mutated markdown so the CLI writes
  // nothing and the Hardening Log never claims a spot was cleared when it
  // wasn't.
  const remaining = analyzeContract(result);
  if (remaining.some((s) => s.id === spotId)) {
    throw new HardenResolutionError(
      `Resolution did not clear soft spot ${spotId}: the answer still triggers ${spot.type}. Provide a more concrete answer.`,
    );
  }

  return result;
}
