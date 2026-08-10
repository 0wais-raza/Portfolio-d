import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";

export default defineConfig({
  plugins: [
    // tanstackStart() registers the TanStack Router plugin (route generation +
    // code-splitting) internally, and must run BEFORE any JSX transformation
    // plugin (@vitejs/plugin-react uses `enforce: "pre"`, so it would
    // otherwise be hoisted ahead of it).
    tanstackStart({ server: { entry: "server" } }),
    // Official TanStack Start deployment path for Vercel (see
    // tanstack.com/start hosting docs — "Vercel: follow the Nitro
    // instructions"). The `vercel` preset makes `vite build` emit a
    // `.vercel/output` directory (Build Output API v3): an SSR serverless
    // function that renders every route plus the static client assets, so
    // client-side routes are served by the server instead of 404ing.
    // No vercel.json rewrites are needed — routing lives in
    // `.vercel/output/config.json`.
    nitro({ preset: "vercel" }),
    react(),
    tailwindcss(),
  ],
  // Resolve the "@/*" alias from tsconfig.json paths.
  resolve: {
    tsconfigPaths: true,
  },
});
