import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.test.js', '**/*.spec.js', 'test-hello-vitest.js'],
    exclude: ['node_modules', 'dist', 'test-login*.js', 'test-mobile-links.js'],
  },
});
