import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwind()],
  base: "./",
  build: {
    rolldownOptions: {
      input: ["index.html", "scene.html", "adoption-example.html"],
    },
  },
});
