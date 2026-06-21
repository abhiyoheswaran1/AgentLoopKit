import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    pool: 'forks',
    // Integration tests spawn nested CLI processes; cap forks to avoid local/CI contention.
    maxWorkers: 4,
    testTimeout: 90000,
  },
});
