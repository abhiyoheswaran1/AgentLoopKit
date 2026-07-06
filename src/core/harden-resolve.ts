import { AgentLoopError } from './errors.js';
import { analyzeContract, type SoftSpot } from './harden.js';

const EMPTY_LINE = /^-\s*(none recorded yet\.|none\.|add acceptance criteria before implementation starts\.)?\s*$/i;

export class HardenResolutionError extends AgentLoopError {
  constructor(message: string) {
    super(message, 'HARDEN_UNKNOWN_SPOT');
    this.name = 'HardenResolutionError';
  }
}

function appendToSection(markdown: string, heading: string, entry: string): string {
  const lines = markdown.split('\n');
  const headingIndex = lines.findIndex((l) => l.trim() === `## ${heading}`);
  if (headingIndex === -1) {
    return `${markdown.trimEnd()}\n\n## ${heading}\n${entry}\n`;
  }
  let end = headingIndex + 1;
  while (end < lines.length && !/^##\s+/.test(lines[end])) end += 1;
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

export function applyResolution(markdown: string, spotId: string, answer: string): string {
  const spot: SoftSpot | undefined = analyzeContract(markdown).find((s) => s.id === spotId);
  if (!spot) {
    throw new HardenResolutionError(`No open soft spot with id "${spotId}".`);
  }
  const clean = answer.trim();
  const withAnswer = appendToSection(markdown, spot.section, `- ${clean}`);
  return appendToSection(withAnswer, 'Hardening Log', `- [${spotId}] ${clean}`);
}
