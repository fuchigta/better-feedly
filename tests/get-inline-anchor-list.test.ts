import type { Window as HappyDOMWindow } from "happy-dom"
import { afterEach, describe, expect, test } from "vitest"

import { getInlineAnchorList } from "../src/contents/hatena-bookmark-count"

// happy-dom ではオリジンをまたいだ history.replaceState が SecurityError になるため、
// happy-dom の setURL で現在ページの URL を差し替える。
function setPageURL(url: string) {
  ;(window as unknown as HappyDOMWindow).happyDOM.setURL(url)
}

afterEach(() => {
  document.body.innerHTML = ""
  setPageURL("http://localhost:3000/")
})

describe("getInlineAnchorList", () => {
  test("Feedly ではエントリのタイトルリンクの前に差し込む", async () => {
    setPageURL("https://feedly.com/i/latest")
    document.body.innerHTML =
      '<a class="EntryTitleLink" href="https://example.com/1">1</a>' +
      '<a class="EntryTitleLink" href="https://example.com/2">2</a>' +
      '<a class="OtherLink" href="https://example.com/3">3</a>'
    const links = document.querySelectorAll("a.EntryTitleLink")

    const anchors = await getInlineAnchorList()

    expect(anchors).toEqual([
      { element: links[0], insertPosition: "beforebegin" },
      { element: links[1], insertPosition: "beforebegin" }
    ])
  })

  test("Feedly でも /i/ 配下でなければ null を返す", async () => {
    setPageURL("https://feedly.com/about")
    document.body.innerHTML =
      '<a class="EntryTitleLink" href="https://example.com/1">1</a>'

    expect(await getInlineAnchorList()).toBeNull()
  })

  test("connpass ではイベントタイトルのリンクの前に差し込む", async () => {
    setPageURL("https://connpass.com/explore/")
    document.body.innerHTML =
      '<p class="event_title"><a href="https://example.connpass.com/event/1/">1</a></p>' +
      '<p class="event_title"><span><a href="https://example.com/nested">x</a></span></p>' +
      '<p class="other"><a href="https://example.com/other">y</a></p>'
    const link = document.querySelector(".event_title > a")

    const anchors = await getInlineAnchorList()

    expect(anchors).toEqual([{ element: link, insertPosition: "beforebegin" }])
  })

  test("Google 検索では検索結果のリンクの後ろに差し込む", async () => {
    setPageURL("https://www.google.com/search?q=feedly")
    document.body.innerHTML =
      '<div id="rso">' +
      '<div data-snhf="0"><a href="https://example.com/1">1</a></div>' +
      '<div data-snhf="1"><a href="https://example.com/2">2</a></div>' +
      "</div>" +
      '<div data-snhf="0"><a href="https://example.com/outside">3</a></div>'
    const link = document.querySelector('#rso div[data-snhf="0"] a')

    const anchors = await getInlineAnchorList()

    expect(anchors).toEqual([{ element: link, insertPosition: "afterend" }])
  })

  test("gacco ではコースカードのリンクの前に差し込む", async () => {
    setPageURL("https://gacco.org/course/")
    document.body.innerHTML =
      '<a class="c-card" href="https://gacco.org/course/ga001/">1</a>' +
      '<a class="other" href="https://gacco.org/course/ga002/">2</a>'
    const link = document.querySelector("a.c-card")

    const anchors = await getInlineAnchorList()

    expect(anchors).toEqual([{ element: link, insertPosition: "beforebegin" }])
  })

  test("gacco では /course/ 配下のページでもコースカードのリンクの前に差し込む", async () => {
    setPageURL("https://gacco.org/course/ga001/")
    document.body.innerHTML =
      '<a class="c-card" href="https://gacco.org/course/ga002/">1</a>' +
      '<a class="other" href="https://gacco.org/course/ga003/">2</a>'
    const link = document.querySelector("a.c-card")

    const anchors = await getInlineAnchorList()

    expect(anchors).toEqual([{ element: link, insertPosition: "beforebegin" }])
  })

  test("対象サイトでも該当するリンクが無ければ空配列を返す", async () => {
    setPageURL("https://feedly.com/i/latest")

    expect(await getInlineAnchorList()).toEqual([])
  })

  test("対象外のサイトでは null を返す", async () => {
    setPageURL("https://example.com/")
    document.body.innerHTML =
      '<a class="EntryTitleLink" href="https://example.com/1">1</a>'

    expect(await getInlineAnchorList()).toBeNull()
  })
})
