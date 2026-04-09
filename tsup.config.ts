import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    engine: "src/engine.ts",
    schema: "src/schema.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  splitting: true,
  clean: true,
  external: ["react", "react-dom", "drizzle-orm", "drizzle-orm/pg-core"],
  banner: {
    js: '"use client";',
  },
});
