import { describe, expect, test } from "vitest"

import { removeQueryParams } from "../src/contents/hatena-bookmark-count"

describe("removeQueryParams", () => {
  test("クエリ文字列を取り除く", () => {
    expect(
      removeQueryParams("https://example.com/articles/1?utm_source=feedly")
    ).toBe("https://example.com/articles/1")
  })

  test("フラグメントを取り除く", () => {
    expect(removeQueryParams("https://example.com/articles/1#comments")).toBe(
      "https://example.com/articles/1"
    )
  })

  test("クエリ文字列とフラグメントを両方取り除く", () => {
    expect(
      removeQueryParams("https://example.com/articles/1?page=2#comments")
    ).toBe("https://example.com/articles/1")
  })

  test("クエリもフラグメントも無い URL はそのまま返す", () => {
    expect(removeQueryParams("https://example.com/articles/1")).toBe(
      "https://example.com/articles/1"
    )
  })

  test("ポート番号はオリジンの一部として残す", () => {
    expect(removeQueryParams("http://localhost:8080/path?q=1")).toBe(
      "http://localhost:8080/path"
    )
  })

  test("パスがルートのときは末尾のスラッシュを残す", () => {
    expect(removeQueryParams("https://example.com/?q=1")).toBe(
      "https://example.com/"
    )
  })

  test("URL として解釈できない文字列は例外を投げる", () => {
    expect(() => removeQueryParams("not a url")).toThrow(TypeError)
  })
})
