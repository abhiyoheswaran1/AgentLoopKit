import { describe, expect, test } from 'vitest';
import { renderTemplateString } from '../src/core/template-renderer.js';

describe('template renderer', () => {
  test('replaces simple placeholders', () => {
    expect(renderTemplateString('Hello {{ name }}.', { name: 'AgentLoopKit' })).toBe(
      'Hello AgentLoopKit.',
    );
  });

  test('leaves unknown placeholders visible', () => {
    expect(renderTemplateString('{{ known }} {{ unknown }}', { known: 'ok' })).toBe(
      'ok {{ unknown }}',
    );
  });
});
