const User = require("./User")
const createConversation = require("./actions/createConversation")
const Conversation = require("./actions/Conversation")
const postMessage = require("./actions/postMessage")
const Thread = require("./actions/Thread")
const getMessage = require("./actions/getPost")
const createBugReport = require("./actions/bugReport")
const gameplayReport = require("./actions/gameplayReport")
const chatReport = require("./actions/chatReport")
const createThread = require("./actions/createThread")

class Account extends User {
  #cookies = {}

  constructor(id, cookies) {
    super(id)
    this.#cookies = cookies
    cookies.setAccount(this)
  }

  async fetch() {
    return await super.fetch(this.#cookies)
  }

  /**
   * @param {titel: string,body: string,recipients: string[],locked?: boolean,open_invite?: boolean} details
   * @returns {Conversation}
   */
  async createConversation(details) {
    this.#authCheck()
    return await createConversation(details, this.#cookies)
  }

  #authCheck() {
    if (!this.#cookies.isLoggedIn()) throw new Error("You must be logged in")
  }

  getCookies() {
    return this.#cookies
  }

  /**
   * @param {String} url
   * @returns {Thread}
   */
  async getThread(url) {
    const thread = new Thread(url, this.#cookies)
    await thread.fetch()
    return thread
  }

  async getPost(id) {
    return await getMessage({ id, type: "post" }, this.#cookies)
  }

  async getMessage(id) {
    return await getMessage({ id, type: "conversation" }, this.#cookies)
  }

  /**
   * @param {url} url
   * @returns {Conversation}
   */
  async getConversation(url) {
    this.#authCheck()
    const conversation = new Conversation(url, this.#cookies)
    await conversation.fetch()
    return conversation
  }

  /**
   * @param {{url: string, content: string}} options
   */
  async post(url, content) {
    this.#authCheck()
    return await postMessage({ url, content }, this.#cookies)
  }

  /**
   * @param {username:String, mcVersion:String, bug:String, bug_description:String, steps:String, extra_information?:String, gamemode:[String], screenshot:boolean } options
   */
  async createBugReport(options) {
    this.#authCheck()
    return await createBugReport(options, this.#cookies)
  }

  /**
   * @param { username:string, gamebreaker:string, rule:string, gamemode:string, evidence:string, extra_information?:string} options
   */
  async createGameplayReport(options) {
    this.#authCheck()
    return await gameplayReport(options, this.#cookies)
  }

  /**
   * @param { username:string, gamebreaker:string, rule:string, gamemode:string, evidence:string, extra_information?:string} options
   */
  async createChatReport(options) {
    this.#authCheck()
    return await chatReport(options, this.#cookies)
  }

  /**
   * @param {message:string, title:string, type:string, discussion_type?: String} options
   */
  async createThread(options) {
    return await createThread(options, this.#cookies)
  }
}

module.exports = Account
