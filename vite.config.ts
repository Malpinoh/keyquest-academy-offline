// The online site uses server rendering. The desktop edition uses TanStack Start's
// SPA shell so the entire interface can be bundled into the native application.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
    spa: {
      enabled: true,
      prerender: {
        outputPath: "/index.html",
        crawlLinks: false,
        retryCount: 0,
      },
    },
  },
  vite: {
    // WebView2 109 is the final runtime available for Windows 7 and 8/8.1.
    // Compile JavaScript for that browser engine in this legacy-only branch.
    build: {
      target: "chrome109",
    },
    server: {
      host: "127.0.0.1",
      port: 1420,
      strictPort: true,
    },
  },
});
