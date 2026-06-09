import { describe, expect, test } from 'vitest';
import { slugify } from '../src/core/slug.js';

describe('slugify', () => {
  test('creates filesystem-safe lowercase slugs', () => {
    expect(slugify('Add Settings Page!')).toBe('add-settings-page');
    expect(slugify('  API: OAuth callback  ')).toBe('api-oauth-callback');
  });
});
