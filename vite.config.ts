import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    // Tarayıcı cache'ini daha iyi kullan
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React çekirdeği — en kritik, ayrı chunk
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom") || id.includes("node_modules/react-router-dom")) {
            return "vendor-react";
          }
          // Radix UI bileşenleri
          if (id.includes("@radix-ui")) {
            return "vendor-radix";
          }
          // Yardımcı kütüphaneler
          if (id.includes("lucide-react") || id.includes("clsx") || id.includes("tailwind-merge") || id.includes("class-variance-authority")) {
            return "vendor-utils";
          }
          // Veri/form kütüphaneleri
          if (id.includes("@tanstack") || id.includes("react-hook-form") || id.includes("@hookform") || id.includes("zod")) {
            return "vendor-data";
          }
          // Helmet / SEO
          if (id.includes("react-helmet")) {
            return "vendor-seo";
          }
          // Admin sayfası — ayrı chunk (lazy load ile eşleşir)
          if (id.includes("/pages/admin/")) {
            return "page-admin";
          }
        },
        // Chunk dosya adlarında hash ekle — cache busting
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
  },
});