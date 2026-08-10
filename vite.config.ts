import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

export default defineConfig({
  plugins: [
    // tanstackStart() registers the TanStack Router plugin (route generation +
    // code-splitting) internally, and must run BEFORE any JSX transformation
    // plugin (@vitejs/plugin-react uses `enforce: "pre"`, so it would
    // otherwise be hoisted ahead of it).
    tanstackStart({ server: { entry: "server" } }),
    react(),
    tailwindcss(),
  ],
  // Resolve the "@/*" alias from tsconfig.json paths.
  resolve: {
    tsconfigPaths: true,
  },
});
