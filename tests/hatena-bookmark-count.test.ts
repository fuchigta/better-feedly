import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, test } from "vitest"

import HatenaBookarkCount from "../src/contents/hatena-bookmark-count"

function render(href: string) {
  const element = document.createElement("a")
  element.href = href
  return renderToStaticMarkup(
    createElement(HatenaBookarkCount, { anchor: { element, type: "inline" } })
  )
}

describe("HatenaBookarkCount", () => {
  test("リンク先のはてなブックマーク数の画像を描画する", () => {
    expect(render("https://example.com/articles/1")).toBe(
      '<span><img src="https://b.hatena.ne.jp/entry/image/https://example.com/articles/1" class="bcounter" alt="はてなブックマーク数"/></span>'
    )
  })

  test("リンク先のクエリ文字列とフラグメントは画像の URL に含めない", () => {
    expect(render("https://example.com/articles/1?utm_source=feedly#top")).toBe(
      '<span><img src="https://b.hatena.ne.jp/entry/image/https://example.com/articles/1" class="bcounter" alt="はてなブックマーク数"/></span>'
    )
  })
})
