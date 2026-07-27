import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    server: {
      allowedHosts: true,
    },
    resolve: {
      tsconfigPaths: true,
    },
  },
  tanstackStart: {
    server: { entry: "server" },
  },
});
