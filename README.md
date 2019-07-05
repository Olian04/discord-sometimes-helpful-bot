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
