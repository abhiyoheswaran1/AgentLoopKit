import { listItems, sectionContent } from './markdown-sections.js';

const NOTHING_SKIPPED_VALUES = new Set(['nothing skipped', 'nothing skipped.']);

export function verificationNotRunItems(markdown: string | undefined) {
  if (!markdown) return [];
  return listItems(sectionContent(markdown, 'Not Run')).filter(
    (item) => !NOTHING_SKIPPED_VALUES.has(item.trim().toLowerCase()),
  );
}
