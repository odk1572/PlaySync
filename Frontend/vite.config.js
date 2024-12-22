// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  build: {
    sourcemap: true, // Enable for development; set to false for production
  },
  server: {
    host: true, // Allows connections from the network (useful for LAN testing)
    port: 5173, // Ensure the port is not blocked
    strictPort: true, // Ensures Vite will not try different ports
    hmr: {
      protocol: 'ws', // WebSocket protocol
      host: 'localhost', // Ensure it matches your environment
      port: 5173, // Matches the server port
    },
  },
});
