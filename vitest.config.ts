// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globalSetup: ['./tests/setup.ts'],

    // To avoid test database conflict, we temporarily switch to sequential execution (Sequential)
    // Although slower, this is the safest approach for integration tests with a single DB
    fileParallelism: false,
  },
});