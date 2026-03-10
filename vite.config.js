import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // allows external access
    port: 5173, // dev server port
    strictPort: true,
    allowedHosts: ["elaine-warded-tamisha.ngrok-free.dev"], // your ngrok URL
  },
});
