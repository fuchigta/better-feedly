import { defineConfig } from "vitest/config"

export default defineConfig({
  // plasmo/templates/tsconfig.base は jsx を preserve にしているため、そのままだと
  // Vite が .tsx を変換できない。テスト時だけ React 17+ の automatic runtime で変換する。
  oxc: {
    jsx: { runtime: "automatic" }
  },
  test: {
    environment: "happy-dom",
    include: ["tests/**/*.test.ts"]
  }
})
