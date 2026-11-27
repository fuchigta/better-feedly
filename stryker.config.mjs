// @ts-check
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
  packageManager: "pnpm",
  // pnpm の node_modules 構成では Stryker が @stryker-mutator/* を自動検出できないため、
  // 読み込むプラグインを明示する（Stryker 公式 troubleshooting の pnpm の項）。
  plugins: ["@stryker-mutator/vitest-runner"],
  testRunner: "vitest",
  vitest: { configFile: "vitest.config.mts" },
  mutate: ["src/**/*.tsx"],
  reporters: ["clear-text", "progress", "json"],
  coverageAnalysis: "perTest",
  tempDirName: ".stryker-tmp"
}
export default config
