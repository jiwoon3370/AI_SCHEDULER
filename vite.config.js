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

