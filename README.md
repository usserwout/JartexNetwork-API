# JartexNetwork forums API

This is an unofficial jartex forum API. This API is made for [JNbot](https://jnbot.netlify.app/). 


### What can this API do?

- Login to your forum account
- Fetch threads, messages, conversations and users.
- Post messages to threads or conversations.
- Delete, edit, react messages
- Make bug reports, gameplay reports and chat reports.
- Much more.

## Installation


You can install this module using:
```bash
npm i jartexnetwork-api
```

* * *

# Usage

## Getting started


```javascript
const forums = require("jartexnetwork-api")

main()
async function main() {
    const thread = await forums.getThread(276933) 
    // or forums.getThread("https://jartexnetwork.com/threads/hello-human.276933/")
    
    const account = await forums.login({username:"username",password:"password"})
    
    const message = await thread.post("hi")
    
    await message.edit("hello!")
}
```

## Docs
### Forums
##### forums.login({username, password})
login into your forum account, username may also be your email. 
Returns Account

##### forums.isLoggedIn()
Returns a whether or not you're logged in.

##### forums.getUser(id)
The id is the forum id of a user (a number).
Returns User

##### forums.name2id(username)
Takes a username of a forum account as input and return the forum id of the user.

##### forums.getRules()
Returns all the rules.

##### forums.getPunishments(username, type?)
Get the punishments of a specific user. The type must be in ["all", "bans", "kicks", "mutes", "warns", "issued"] and is by default "all".

##### forums.getStaff()
Get all current staff and their rank.

##### forums.getThreads(type, page?)
Get all thread from specific page. Type must be 1 of the forum list items (eg "news" or "skyblock"). The page is by default 1.

##### forums.getThread(url)
Url could also be the thread id (see example).

##### forums.getAllMembers()
Fetches all the members that have registered on the forums.

##### forums.getAllThreads()
Fetches all the threads created on the forums.

##### forums.getAllSpecialThreads()
Fetches all the threads where the url doesn't include the /thread/.

### Account
```js
const account = await forums.login({username:"username",password:"password"})
```
##### account.getPost(id)
Get the message you posted on a thread. The id is the message id.

##### account.getMessage(id)
Get the message you posted in a conversation.

##### account.getConversation(url)
Get conversation, url is either the conversation url or conversation id.

##### account.createConversation(options)
`options` is an object:
- title: Title of conversation
- body: First message content
- recipients: An array of usernames (String) 
- locked?: boolean (default false)
- open_invite?: boolean (default false)

##### account.createThread(options)
options is an object:
- title
- message
- type: section of forums you want to create the thread (eg 'prison' or 'off-topic')
- discussion_type?: by default 'discussion'

##### account.createChatReport(options)
`options` is an object:
- username: your username
- gamebreaker: gamebreakers username
- rule: rule that the gamebreaker has broken (eg 'Character Spam')
- gamemode: (eg 'SkyBlock Dream')
- evidence
- extra_information?

##### account.createGameplayReport(options)
`options` is an object and is the same as `account.createChatReport`

##### account.createBugReport(options)
`options` is an object:
- username: your username
- mcVersion
- bug: Title of bug report
- bug_description
- steps: explain how to reproduce this bug
- extra_information?
- gamemodes: Array of gamemodes (eg ['SBD','Survival','Global'])
- screenshot?: whether or not you provided screenshot (boolean)

##### account.post(url, content)
Post message to specific thread.

##### account.getThread(url)
Does the same as `forums.getThread`

### Thread
```js
const thread = account.getThread(276933)
//or 
const thread = forums.getThread("https://jartexnetwork.com/threads/hello-human.276933/")
```

##### thread.post(content)
Post a message to the thread

##### thread.delete(reason?)
Delete thread

##### thread.getPage(page)
Get the messages from a specific page.

##### thread.fetch()
Update the thread. This doesn't do anything to the thread, it should fetches the messages again.


### Conversation
```js
const conversation = await account.getConversation(23243)
// or 
const conversation = await account.getConversation("https://jartexnetwork.com/conversations/name.23243/")
```
`Conversation` has the same methodes then `Thread`.

##### conversation.invite(users)
`users` is an array of usernames.


### Message
```js
const message = await account.getPost(432421)
// or 
const thread = await account.getThread(23243)
const message = thread.messages[0]
```

##### message.edit(content)
##### message.delete(reason?)
##### message.addReaction(reaction_id)
`reaction_id` must be one of [1, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 20, 21, 22, 23, 24, 25, 26, 28, 29, 30, 31, 32, 33]



* * * 




See a bug? - [File an issue](https://github.com/usserwout/JartexNetwork-API/issues)

Open to contributions - [GitHub](https://github.com/usserwout/JartexNetwork-API.git) 
