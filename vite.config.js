import {buildClientVersion} from './server/clientVersion.js';
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    __LAB_CLIENT_VERSION__: JSON.stringify(buildClientVersion()),
    "import.meta.env.VERCEL": JSON.stringify(process.env.VERCEL === "1" ? "1" : ""),
  },
  server: {
    proxy: {
      "/api/telemetry": "http://127.0.0.1:5185",
      "/api/ai": "http://127.0.0.1:5184",
    },
  },
});
