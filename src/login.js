const fetch = require("node-fetch")

async function login({ username, password }, cookies) {
  const response = await fetch("https://jartexnetwork.com/login/login", {
    headers: {
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "content-type": "application/x-www-form-urlencoded",
      cookie: "xf_csrf=" + cookies.get("xf_csrf"),
    },
    body: `login=${username}&password=${password}&_xfRedirect=/&remember=1&_xfToken=${cookies.get("_xfToken")}`,
    method: "POST",
    redirect: "manual", // We need this to get the 303 status instead of 200 ( status 303 contains the set cookie header)
  })
  if (response.status === 400) {
    throw new Error("Incorrect username or password")
  } else if (response.status !== 303) {
    throw new Error("Failed to login")
  }
  const cookieHeader = response.headers.get("set-cookie")
  let c = cookies.parse(cookieHeader)
  if (!c.xf_session) throw new Error("Failed to get the xf_session cookie")
  cookies.set("xf_session", c.xf_session)
  if (!c.xf_user) throw new Error("Failed to get the xf_user cookie")
  cookies.set("xf_user", c.xf_user)
  if (!cookies) throw new Error("Didn't get xf_user and xf_session cookie")
}

module.exports = login
