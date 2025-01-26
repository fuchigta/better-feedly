import { useEffect } from "react"

function getFeedURL() {
  const rssLink: any = document.querySelector(
    'link[type="application/rss+xml"]'
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
  return null
}

export default IndexPopup
