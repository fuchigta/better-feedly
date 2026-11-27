import { afterEach, describe, expect, test } from "vitest"

import { getFeedURL } from "../src/popup"

afterEach(() => {
  document.head.innerHTML = ""
})

describe("getFeedURL", () => {
  test("RSS の link 要素があればその href を返す", () => {
    document.head.innerHTML =
      '<link rel="alternate" type="application/rss+xml" href="https://example.com/rss.xml">'

    expect(getFeedURL()).toBe("https://example.com/rss.xml")
  })

  test("Atom の link 要素があればその href を返す", () => {
    document.head.innerHTML =
      '<link rel="alternate" type="application/atom+xml" href="https://example.com/atom.xml">'

    expect(getFeedURL()).toBe("https://example.com/atom.xml")
  })

  test("RSS と Atom が両方あれば文書内で先に現れる方を返す", () => {
    document.head.innerHTML =
      '<link rel="alternate" type="application/atom+xml" href="https://example.com/atom.xml">' +
      '<link rel="alternate" type="application/rss+xml" href="https://example.com/rss.xml">'

    expect(getFeedURL()).toBe("https://example.com/atom.xml")
  })

  test("RSS・Atom 以外の type の link 要素しか無ければ null を返す", () => {
    document.head.innerHTML =
      '<link rel="alternate" type="application/feed+json" href="https://example.com/feed.json">'

    expect(getFeedURL()).toBeNull()
  })

  test("link 要素が無ければ null を返す", () => {
    expect(getFeedURL()).toBeNull()
  })
})
