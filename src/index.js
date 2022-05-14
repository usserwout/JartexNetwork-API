const login = require("./login")
const Cookies = require("./Cookies")
const User = require("./User")
const Account = require("./Account")
const { getMembers, getThreads, getSpecialThreads } = require("./actions/getSiteMap")
const getStaff = require("./actions/getStaff")
const name2id = require("./actions/name2id")
const getSectionThreads = require("./actions/getThreads")
const getRules = require("./actions/getRules")
const getPunishments = require("./actions/punishments")
const Thread = require("./actions/Thread")

class Forums {
  constructor() {
    this.cookies = new Cookies()
  }

  isLoggedIn() {
    return this.cookies.isLoggedIn()
  }

  async login(form) {
    if (this.cookies.isLoggedIn()) return
    await this.cookies.update()

    if (this.cookies.hasCookies()) await login(form, this.cookies)
    const account = new Account(this.cookies.getId(), this.cookies)
    await account.fetch()
    return account
  }
  async getCookie() {
    if (!this.cookies.hasCookies()) {
      await getCookie(this.cookies)
    }
  }

  async getUser(id) {
    this.#auth()
    const user = new User(id)
    await user.fetch(this.cookies)
    return user
  }

  #auth() {
    if (!this.cookies.isLoggedIn()) {
      throw new Error("You must be logged in")
    }
  }

  async getAllMembers() {
    return await getMembers()
  }
  async getAllThreads() {
    return await getThreads()
  }
  async getAllSpecialThreads() {
    return await getSpecialThreads()
  }
  async getStaff() {
    return await getStaff()
  }
  async name2id(username) {
    return await name2id(username, this.cookies)
  }

  /**
   * @param {type:string,page:number} options
   */
  async getThreads(options) {
    return await getSectionThreads(options, this.cookies)
  }
  async getRules() {
    return await getRules()
  }

  async getPunishments(name, type) {
    return await getPunishments(name, type)
  }

  /**
   * @param {String} url
   * @returns {Thread}
   */
  async getThread(url) {
    const thread = new Thread(url, this.cookies)
    await thread.fetch()
    return thread
  }
}

module.exports = new Forums()
