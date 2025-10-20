import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    // Allow binding to network interfaces (required for some preview hosts)
    host: true,
    // Add Netlify preview host so requests from Netlify devserver aren't blocked
    allowedHosts: ["devserver-main--aischeduler.netlify.app"],
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

