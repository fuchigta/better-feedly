// StrykerJS の JSON レポート（reports/mutation/mutation.json）を読み、
// 生き残り上限のラチェットで合否を決める。
//
// - 終了コード 0 だけでは「空振り」（変異対象が 0 件でも Stryker は成功する）を
//   見分けられないため、試されたミュータントが 1 件以上あることも確かめる。
// - 「見逃し」は Survived と NoCoverage の合計。Ignored（// Stryker disable で
//   除外した等価ミュータント）は数えない。
// - 上限は実測値。テストを足して見逃しが減ったら MAX_UNDETECTED も下げる。
import { readFileSync } from "node:fs"

const REPORT = "reports/mutation/mutation.json"
// 2026-11-27 の実測: 有効ミュータント 71 件、検出 43、Survived 7、NoCoverage 21
const MAX_UNDETECTED = 28

const report = JSON.parse(readFileSync(REPORT, "utf8"))

const counts = {}
for (const [file, { mutants }] of Object.entries(report.files)) {
  for (const { status } of mutants) {
    counts[status] = (counts[status] ?? 0) + 1
  }
  console.log(`${file}: ${mutants.length} mutants`)
}
console.log("status breakdown:", counts)

const ignored = counts.Ignored ?? 0
const tested = Object.values(counts).reduce((a, b) => a + b, 0) - ignored
const undetected = (counts.Survived ?? 0) + (counts.NoCoverage ?? 0)

if (tested === 0) {
  console.error("No mutants were tested. The mutate pattern may match nothing.")
  process.exit(1)
}

console.log(
  `tested: ${tested}, undetected: ${undetected} (max ${MAX_UNDETECTED})`
)
if (undetected > MAX_UNDETECTED) {
  console.error(
    `Undetected mutants increased: ${undetected} > ${MAX_UNDETECTED}. ` +
      "Add tests that kill the new survivors."
  )
  process.exit(1)
}
