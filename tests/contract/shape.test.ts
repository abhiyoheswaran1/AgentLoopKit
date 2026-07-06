import { describe, expect, test } from 'vitest';
import { shapeOf } from './shape.js';

describe('shapeOf', () => {
  test('reduces values to a stable key/type skeleton', () => {
    const input = {
      command: 'agentloop verify',
      count: 3,
      ok: true,
      items: [{ path: '/tmp/x', n: 1 }],
      missing: null,
    };
    expect(shapeOf(input)).toEqual({
      command: 'string',
      count: 'number',
      items: [{ n: 'number', path: 'string' }],
      missing: 'null',
      ok: 'boolean',
    });
  });
});
