import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/IA-generativa-Profesor-de-Ritmo/',
  build: {
    outDir: 'dist',
  },
});
