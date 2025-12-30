// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globalSetup: ['./tests/setup.ts'],

    // To avoid test database conflict, we temporarily switch to sequential execution (Sequential)
    // Although slower, this is the safest approach for integration tests with a single DB
    fileParallelism: false,
    coverage: {
      provider: 'v8', // 使用 V8 引擎
      reporter: ['text', 'json', 'html'], // 產出報告格式
      exclude: ['node_modules/', 'src/db/migrations/'], // 排除不需要測的檔案
    },
  },
});