import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 8080,
    cors: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ["phaser"],
        },
      },
    },
  },
});
