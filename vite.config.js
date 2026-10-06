import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    "import.meta.env.VERCEL": JSON.stringify(process.env.VERCEL === "1" ? "1" : ""),
  },
  server: {
    proxy: {
      "/api/ai": "http://127.0.0.1:5184",
    },
  },
});
