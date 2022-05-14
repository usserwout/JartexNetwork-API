const fetch = require("node-fetch")

class Cookies {
  cookies = {}
  #cookie_cache = {}
  #account = {}

  set(name, value) {
    this.cookies[name] = value
  }
  get(name) {
    return this.cookies[name]
  }
  toString() {
    return Object.entries(this.cookies)
      .map(([name, value]) => `${name}=${value}`)
      .join("; ")
  }

  hasCookies() {
    return Object.keys(this.cookies).length > 0
  }

  isLoggedIn() {
    return this.get("xf_session") && this.get("xf_user")
  }

  setAccount(account) {
    this.#account = account
  }

  get account() {
    return this.#account
  }

  getId() {
    return Number(this.get("xf_user")?.match(/^[0-9]+/)?.[0])
  }

  parse(cookiesHeader) {
    if (typeof cookiesHeader != "string") return {}
    cookiesHeader = cookiesHeader.replace("HttpOnly, ", "")
    const cookies = cookiesHeader.split(/;\s*/)
    const parsedCookie = {}
    for (let i = 0; i < cookies.length; i++) {
      const [key, value] = cookies[i].split("=")
      parsedCookie[key] = value
    }
    return JSON.parse(JSON.stringify(parsedCookie))
  }

  async update(url = "https://jartexnetwork.com/login") {
    if (this.#cookie_cache[url]) {
      this.set("xf_csrf", this.#cookie_cache[url].xf_csrf)
      this.set("_xfToken", this.#cookie_cache[url]._xfToken)
    } else {
      const res = await fetch(url, { headers: { cookie: this.toString() } })
      if (res.headers.get("set-cookie")) {
        const xf_csrf = res.headers.get("set-cookie").match(/^xf_csrf=(?<key>[A-z0-9-]+)/)?.groups?.key
        if (xf_csrf) this.set("xf_csrf", xf_csrf)
      }
      const html = await res.text()
      this.set("_xfToken", html.match(/data-csrf="(?<token>[^"]+)"/)?.groups.token)
      this.#cookie_cache[url] = {
        xf_csrf: this.get("xf_csrf"),
        _xfToken: this.get("_xfToken"),
      }
    }
  }
}

module.exports = Cookies
