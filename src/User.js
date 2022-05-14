const fetch = require("node-fetch")
const { parse } = require("node-html-parser")

class User {
  #url = ""
  constructor(id) {
    if (typeof id === "number") {
      this.#url = `https://jartexnetwork.com/members/someone_.${id}/`
      this.id = id
    } else if (id && typeof id === "string") {
      this.#url = id
      this.id = Number(id.match(/[0-9]+\/$/)?.[0].replace("/", ""))
    } else throw Error("Argument must either be the id or the url")
  }

  async fetch(cookies) {
    const response = await fetch(this.#url, {
      headers: { cookie: cookies.toString() },
    })

    if (response.status !== 200) throw Error("Failed to fetch user")
    const html = await response.text()
    const document = parse(html)

    // General info
    let data = JSON.parse(document.querySelector("script[type='application/ld+json']").text)
    this.username = data.name
    this.avatar = data.image

    // Banners
    this.banners = document.querySelectorAll(".memberHeader-banners").map((b) => b.text.trim())

    // stats
    this.stats = {}
    document.querySelector(".memberHeader-stats > div").childNodes.forEach((node) => {
      if (!node.childNodes.length) return
      let stat_name = node.childNodes[1]?.text.trim()
      let stat_val = node.childNodes[3]?.text.trim()
      if (stat_name && stat_val) this.stats[stat_name] = stat_val
    })

    // Badges
    this.badges =
      document
        .querySelector(".featuredBadges")
        ?.childNodes.map((node) => node?.getAttribute?.("title"))
        .filter((e) => e) ?? []

    // join date
    this.join_date = new Date(document.querySelector(".memberHeader-blurb > dl time").getAttribute("datetime"))
  }
}

module.exports = User

// fetch("https://jartexnetwork.com/members/maybeitsdestiny_.41752/", {
//   headers: {
//     "sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="100", "Google Chrome";v="100"',
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": '"macOS"',
//     "upgrade-insecure-requests": "1",
//   },
//   referrerPolicy: "strict-origin-when-cross-origin",
//   body: null,
//   method: "GET",
// })
