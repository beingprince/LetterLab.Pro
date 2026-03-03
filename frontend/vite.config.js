import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    strictPort: true,
    port: 5173,

    // allow ngrok host(s)
    allowedHosts: [
      ".ngrok-free.dev",
      "fuseless-tonja-intelligently.ngrok-free.dev",
    ],

    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
        timeout: 0,
      },
    },
  },
});
