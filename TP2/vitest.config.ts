import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/app.ts',
        'src/server.ts',
        'src/types.ts'
      ],
      thresholds: { lines: 0.8, statements: 0.8, functions: 0.8, branches: 0.7 }
    },
  },
});
