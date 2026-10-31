import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
const proxy = {
  "/api": {
    target: process.env.API_PROXY_TARGET ?? "http://127.0.0.1:4000",
    changeOrigin: true,
  },
};
export default defineConfig({
  plugins: [react()],
  base: "/admin/",
  envDir: fileURLToPath(new URL("../../", import.meta.url)),
  server: { host: "127.0.0.1", port: 3000, strictPort: true, proxy },
  preview: { host: "127.0.0.1", port: 3000, strictPort: true, proxy },
  build: { sourcemap: true },
});
