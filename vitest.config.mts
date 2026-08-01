import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const root = import.meta.dirname;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      lib: path.resolve(root, 'lib'),
      components: path.resolve(root, 'components'),
      data: path.resolve(root, 'data'),
      styles: path.resolve(root, 'styles'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
});
