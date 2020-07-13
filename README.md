# discord-sometimes-helpful-bot

A discord chat bot that provides tools for organizing and managing events.

## `!event [title]`

State that you are planning an event, then ppl may react with :thumbsup: / :thumbsdown: or :grey_question: depending on if they plan to attend or not. The event comment will update with a list of the ppl who have responded & in the order they responded.
Reacting with a :wrench: will alow you to change the title of the event. The bot the sends a DM to the user providing further instructions.

![](assets/event2.png)

## Prerequisite

* [nodejs](https://nodejs.org)
* [npm (included in newer versions of nodejs)](https://github.com/npm/cli/releases/tag/v6.10.0)
* [firebase account](https://firebase.google.com/)

## Install & Run

1. Make sure you have installed all prerequisite software
2. Grab your firebase [service account](https://firebase.google.com/docs/admin/setup) credentials.
3. Grab your discord-bot secret from the [discord developer portal](https://discordapp.com/developers/applications)
4. Setup environment variables as seen in `.env.example`
5. Start the bot: `npm run start:prod`
