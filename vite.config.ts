import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': {}, // Mock the process.env object for the browser
  },
  plugins: [react()],
  resolve: {
    alias: {
      'lucide-react': 'lucide-react/dist/esm/icons',
      "@": path.resolve(__dirname, "./src"),
    }
  },
  optimizeDeps: {
    include: ['lucide-react'],
    // Ensure Lucide React is pre-bundled
    esbuildOptions: {
      target: 'es2020'
    }
  }
});