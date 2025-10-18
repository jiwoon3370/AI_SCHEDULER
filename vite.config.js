import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: ".", // ✅ index.html 위치
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      external: [], // 기본값 유지 (여기에 react-calendar 있으면 안 됨)
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  optimizeDeps: {
    include: ["react-calendar"], // ✅ vite이 react-calendar를 미리 번들링
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
