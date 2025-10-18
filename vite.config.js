import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: ".", // ✅ 루트를 프로젝트 최상단으로 (index.html이 있는 곳)
  build: {
    outDir: "dist", // ✅ 빌드 파일 저장 위치
    emptyOutDir: true, // ✅ 기존 dist 자동 비우기
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // ✅ 절대 경로 import 지원
    },
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
