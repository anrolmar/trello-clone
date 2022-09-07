import { URL, fileURLToPath } from "url";

import Components from "unplugin-vue-components/vite";
import Pages from "vite-plugin-pages";
import { defineConfig } from "vite";
import graphql from "@rollup/plugin-graphql";
// plugins
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), graphql(), Pages(), Components()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
