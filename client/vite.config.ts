import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "../shared"),
      "@assets": path.resolve(__dirname, "../attached_assets"),
    },
  },
  server: {
    port: 2020,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5600',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      external: ['@mui/material', '@emotion/react', '@emotion/styled'],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material', '@emotion/react', '@emotion/styled'],
        },
        globals: {
          '@mui/material': 'MaterialUI',
          '@emotion/react': 'emotionReact',
          '@emotion/styled': 'emotionStyled'
        }
      },
    },
  },
  optimizeDeps: {
    include: ['@mui/material', '@emotion/react', '@emotion/styled'],
    exclude: ['@mui/material', '@emotion/react', '@emotion/styled']
  },
  base: '/',
}); 