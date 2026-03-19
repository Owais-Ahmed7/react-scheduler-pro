import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/lib/index.tsx'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  outDir: 'dist',
  splitting: false,
  treeshake: true,
  minify: false,
  // Don't bundle dependencies
  noExternal: [],
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
});
