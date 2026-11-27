import { describe, expect, test } from "vitest"

import { getStyle } from "../src/contents/hatena-bookmark-count"

describe("getStyle", () => {
  test("style 要素を返す", async () => {
    const style = await getStyle({} as any)

    expect(style.tagName).toBe("STYLE")
  })

  test("シャドウ DOM のコンテナを前面に出す CSS を含む", async () => {
    const style = await getStyle({} as any)

    expect(style.textContent).toMatch(
      /#plasmo-shadow-container\s*{\s*z-index: 1 !important;\s*}/
    )
  })

  test("はてなブックマーク数の画像を上下反転する CSS を含む", async () => {
    const style = await getStyle({} as any)

    expect(style.textContent).toMatch(
      /\.bcounter\s*{\s*transform: scaleY\(-1\) !important;\s*}/
    )
  })
})
