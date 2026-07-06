// (imports from ./task-contract.js are added in Task 3 when the rules need them)

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

// Detection rules are added in later tasks and pushed in this fixed order.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function analyzeContract(markdown: string): SoftSpot[] {
  const spots: SoftSpot[] = [];
  return spots;
}
