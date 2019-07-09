# discord-sometimes-helpful-bot
A discord chat bot that provides tools for organizing and managing raiding.

## `!event [title]`

State that you are planning an event, then ppl may react with thumbs up/down or questionmark depending on if they plan to attend or not. The event comment will update with a list of the ppl who have responded & in the order they responded.

![](assets/event2.png)

## Planned features

* When, where & what does Xur bring next. [Using this api](https://api.braytech.org/?request=xur&get=history) and fetching images like [this](https://www.bungie.net/common/destiny2_content/icons/1e6af1d4e6ec8568434b1c8f8604b122.jpg)
* Ready check: Starting a ready check for a given voice chanel. Will display a checklist for all players in the voice channel. Will check as READY when a player reacts to the comment.
* Automatic roll assignment based on the reacted emoji. 
* Help command that shows what the bot can do.

## Prerequisite

* [nodejs](https://nodejs.org)
* [npm (included in newer versions of nodejs)](https://github.com/npm/cli/releases/tag/v6.10.0)
* [sqlite](https://www.sqlite.org)

## Install & Run

1. Make sure you have installed all prerequisite software
2. Initialize database: `npm run db:init`
3. Grab your discord-bot secret from the [discord developer portal](https://discordapp.com/developers/applications)
4. Create a `secrets.json` file and store your discord-bot secret as `discord_token` inside it.
5. Start the bot: `npm run start:prod`
