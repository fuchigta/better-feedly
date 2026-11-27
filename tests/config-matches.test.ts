import { describe, expect, test } from "vitest"

import { config } from "../src/contents/hatena-bookmark-count"

// config.matches は Chrome のマッチパターン。ここで使っているパターンは
// どれも「* だけがワイルドカード」の形なので、* を任意の文字列とみなして照合する。
function matchesAnyPattern(url: string) {
  return config.matches.some((pattern) => {
    const escaped = pattern.replace(/[.+?^${}()|[\]\\/]/g, "\\$&")
    return new RegExp(`^${escaped.replace(/\*/g, ".*")}$`).test(url)
  })
}

// getInlineAnchorList が差し込み先を返すページで、コンテンツスクリプトが
// 実際に読み込まれる（config.matches に当てはまる）ことを確かめる。
// matches と getInlineAnchorList の分岐がずれると、ここで落ちる。
describe("config.matches", () => {
  test("Feedly の /i/ 配下のページに当てはまる", () => {
    expect(matchesAnyPattern("https://feedly.com/i/latest")).toBe(true)
  })

  test("connpass のページに当てはまる", () => {
    expect(matchesAnyPattern("https://connpass.com/explore/")).toBe(true)
  })

  test("Google 検索のページに当てはまる", () => {
    expect(matchesAnyPattern("https://www.google.com/search?q=feedly")).toBe(
      true
    )
  })

  test("gacco の /course/ 配下のページに当てはまる", () => {
    expect(matchesAnyPattern("https://gacco.org/course/ga001/")).toBe(true)
  })

  test("対象外のサイトには当てはまらない", () => {
    expect(matchesAnyPattern("https://example.com/")).toBe(false)
  })
})
