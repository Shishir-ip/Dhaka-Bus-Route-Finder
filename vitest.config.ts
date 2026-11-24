import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    // The completeness sweeps search thousands of real hub pairs.
    testTimeout: 180_000,
    hookTimeout: 180_000,
  },
});