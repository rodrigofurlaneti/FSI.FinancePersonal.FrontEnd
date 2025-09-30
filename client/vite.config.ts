// vite.config.ts
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://localhost:60820",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});