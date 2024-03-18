import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    port: 1313,
    cors: true,
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "http://vms.makonissoft.com:1919/", //server
        // target: 'http///192.168.1.15:1919', // charan local
        // target: 'http://192.168.1.23:1919', // Ganesh local
        // target: 'https://tradingapp-jsir.onrender.com',
        changeOrigin: true,
        // secure: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
