import { createElement } from "react"
import { createRoot, type Root } from "react-dom/client"
import { act } from "react-dom/test-utils"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import IndexPopup, { getFeedURL } from "../src/popup"

// React 18 の act を使うときに必要な宣言

;(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true

let root: Root

beforeEach(() => {
  root = createRoot(document.createElement("div"))
  vi.spyOn(window, "open").mockImplementation(() => null)
  vi.spyOn(window, "close").mockImplementation(() => {})
})

afterEach(() => {
  act(() => root.unmount())
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

// ポップアップが使う chrome.tabs.query と chrome.scripting.executeScript だけを差し替える
function stubChrome(feedURL: string | null) {
  const chrome = {
    tabs: { query: vi.fn().mockResolvedValue([{ id: 42 }]) },
    scripting: {
      executeScript: vi.fn().mockResolvedValue([{ result: feedURL }])
    }
  }
  vi.stubGlobal("chrome", chrome)
  return chrome
}

describe("IndexPopup", () => {
  test("現在のウィンドウのアクティブなタブを問い合わせる", async () => {
    const chrome = stubChrome("https://example.com/rss.xml")

    act(() => root.render(createElement(IndexPopup)))

    await vi.waitFor(() =>
      expect(chrome.tabs.query).toHaveBeenCalledWith({
        active: true,
        currentWindow: true
      })
    )
  })

  test("アクティブなタブで getFeedURL を実行する", async () => {
    const chrome = stubChrome("https://example.com/rss.xml")

    act(() => root.render(createElement(IndexPopup)))

    await vi.waitFor(() =>
      expect(chrome.scripting.executeScript).toHaveBeenCalledWith({
        target: { tabId: 42 },
        func: getFeedURL
      })
    )
  })

  test("フィードがあれば Feedly の購読ページを開き、ポップアップは閉じない", async () => {
    stubChrome("https://example.com/rss.xml")

    act(() => root.render(createElement(IndexPopup)))

    await vi.waitFor(() =>
      expect(window.open).toHaveBeenCalledWith(
        "https://feedly.com/i/subscription/feed%2Fhttps%3A%2F%2Fexample.com%2Frss.xml"
      )
    )
    expect(window.close).not.toHaveBeenCalled()
  })

  test("フィードが無ければポップアップを閉じ、ページは開かない", async () => {
    stubChrome(null)

    act(() => root.render(createElement(IndexPopup)))

    await vi.waitFor(() => expect(window.close).toHaveBeenCalled())
    expect(window.open).not.toHaveBeenCalled()
  })
})
