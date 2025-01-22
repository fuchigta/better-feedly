import type {
  PlasmoCSConfig,
  PlasmoCSUIProps,
  PlasmoGetInlineAnchorList,
  PlasmoGetStyle
} from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://feedly.com/i/*"]
}

export const getInlineAnchorList: PlasmoGetInlineAnchorList = async () =>
  Array.from(document.querySelectorAll("a.EntryTitleLink")).map((element) => ({
    element,
    insertPosition: "beforebegin"
  }))

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
