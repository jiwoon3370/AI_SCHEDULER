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
    // Optionally allow hosts from an env var to avoid hardcoding site names in the repo
    // Set VITE_ALLOWED_HOSTS as a comma-separated list if needed in development/preview.
    allowedHosts: process.env.VITE_ALLOWED_HOSTS
      ? process.env.VITE_ALLOWED_HOSTS.split(',').map(h => h.trim())
      : [],
    // Do not hardcode a proxy target with a numeric port in the repo. During local
    // development you can set VITE_DEV_PROXY_TARGET to override where /api should
    // be proxied. This prevents embedding a real port value in the repo that Netlify
    // might treat as a secret value.
    proxy: process.env.VITE_DEV_PROXY_TARGET
      ? {
          "/api": {
            target: process.env.VITE_DEV_PROXY_TARGET,
            changeOrigin: true,
            secure: false,
          },
        }
      : {},
  },
});

