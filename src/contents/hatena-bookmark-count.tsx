import type {
  PlasmoCSConfig,
  PlasmoCSUIProps,
  PlasmoGetInlineAnchorList,
  PlasmoGetStyle
} from "plasmo"

export const config: PlasmoCSConfig = {
  matches: [
    "https://feedly.com/i/*",
    "https://connpass.com/*",
    "https://www.google.com/*"
  ]
}

export const getInlineAnchorList: PlasmoGetInlineAnchorList = async () => {
  const url = window.location.href

  if (url.startsWith("https://feedly.com/i/")) {
    return Array.from(document.querySelectorAll("a.EntryTitleLink")).map(
      (element) => ({
        element,
        insertPosition: "beforebegin"
      })
    )
  }

  if (url.startsWith("https://connpass.com/")) {
    return Array.from(document.querySelectorAll(".event_title > a")).map(
      (element) => ({
        element,
        insertPosition: "beforebegin"
      })
    )
  }

  if (url.startsWith("https://www.google.com/")) {
    return Array.from(
      document.querySelectorAll('#rso div[data-snhf="0"] a')
    ).map((element) => ({
      element,
      insertPosition: "afterend"
    }))
  }

  return null
}

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = `
    #plasmo-shadow-container {
      z-index: 1 !important
    }
  `
  return style
}

function HatenaBookarkCount({ anchor }: PlasmoCSUIProps) {
  const href = (anchor.element as any).href
  return (
    <span>
      <img
        src={`https://b.hatena.ne.jp/entry/image/${href}`}
        className="bcounter"
        alt="はてなブックマーク数"
      />
    </span>
  )
}

export default HatenaBookarkCount
