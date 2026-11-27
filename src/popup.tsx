import { useEffect } from "react"

export function getFeedURL() {
  const rssLink: any = document.querySelector(
    'link[type="application/rss+xml"], link[type="application/atom+xml"]'
  )
  if (rssLink) {
    return rssLink.href
  }

  return null
}

async function getCurrentTabFeedURL() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  })

  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: getFeedURL
  })

  return result
}

function IndexPopup() {
  // 依存配列 [] を ["Stryker was here"] に変えても、定数だけの依存配列なので初回マウント時に
  // 1 回だけ実行されることは変わらず、区別できない（等価ミュータント）。この範囲の配列リテラルは
  // 依存配列だけなので、ArrayDeclaration の除外は他のミュータントを隠さない。
  // Stryker disable ArrayDeclaration: 定数だけの依存配列は [] と等価
  useEffect(() => {
    getCurrentTabFeedURL().then((res) => {
      if (!res) {
        window.close()
        return
      }

      window.open(
        `https://feedly.com/i/subscription/feed${encodeURIComponent("/" + res)}`
      )
    })
  }, [])
  // Stryker restore ArrayDeclaration
  return null
}

export default IndexPopup
