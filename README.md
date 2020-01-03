# discord-sometimes-helpful-bot

A discord chat bot that provides tools for organizing and managing events.

## `!event [title]`

State that you are planning an event, then ppl may react with :thumbsup: / :thumbsdown: or :grey_question: depending on if they plan to attend or not. The event comment will update with a list of the ppl who have responded & in the order they responded.
Reacting with a :wrench: will alow you to change the title of the event. The bot the sends a DM to the user providing further instructions.

![](assets/event2.png)

## `!poll [title]; [voteOption1]; [voteOption2]; ...[voteOptionN];`

Starts a poll with the specified title, that allows users to vote on one or more of the provided vote options.
The title & each vote option must end with a semicolon.

Ex: `!poll This is a demo poll!; Option 1; Option 2; Option 3;`

## `!emote [emoteName]`

Since emoji are really small on discord, this command will turn emotes into larger versions of them selfs (as long as the bot has them stored locally). In other words, if you have an emote called `:uldren_nooo:` on your discord server, and you have an associated image with the name `unldren_nooo.png` in the folder `assets/emotes` on the server with your bot; then the command `!emote :uldren_nooo:` or `!emote uldren_nooo` will post a large version of the emote.

## Planned features

### General Features

* Mark text channels as "command only" and delete all messages that does not contain commands.

### New Commands

* Ready check: Starting a ready check for a given voice chanel. Will display a checklist for all players in the voice channel. Will check as READY when a player reacts to the comment.
* Automatic roll assignment based on the reacted emoji.
* Help command that shows what the bot can do.

## Prerequisite

* [nodejs](https://nodejs.org)
* [npm (included in newer versions of nodejs)](https://github.com/npm/cli/releases/tag/v6.10.0)
* [firebase account](https://firebase.google.com/)

## Install & Run

1. Make sure you have installed all prerequisite software
2. Grab your firebase [service account](https://firebase.google.com/docs/admin/setup) credentials.
3. Grab your discord-bot secret from the [discord developer portal](https://discordapp.com/developers/applications)
4. Create a `secrets.json` file and store your discord-bot secret as `discord_token` inside it, and store the firebase service account credentials as `firebaseConfig`.
5. Start the bot: `npm run start:prod`
