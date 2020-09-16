import { Client, MessageReaction, PartialUser, User } from 'discord.js';
import { db, getSnap } from '../../database';
import { VoteData } from './interfaces/VoteData';
import { constructBody } from './util/constructBody';
import { emojiNumberMap } from './util/emojiNumberMap';

export const onReactionRemove = (app: Client) => async (reaction: MessageReaction, user: User | PartialUser) => {
  if (reaction.partial) { await reaction.fetch(); }
  if (reaction.message.partial) { await reaction.message.fetch(); }
  if (user.partial) { await user.fetch(); }

  if (reaction.message.channel.type !== 'text') { return; }
  if (reaction.message.author.id !== app.user.id) { return; }
  if (user.bot) { return; }

  const snap = await getSnap(`poll/${reaction.message.id}`);
  if ( !(snap.exists()) ) {
    // This message was sent by the bot, but its no a voting message.
    return;
  }

  const message = reaction.message;

  const voteData = snap.toJSON() as VoteData;

  const emojiNumber = emojiNumberMap.indexOf(reaction.emoji.name);
  if (emojiNumber < 0) { return Promise.resolve(); }

  voteData.options[emojiNumber].voteCount -= 1;

  db.child(`poll/${message.id}`).set(voteData)
    .then(() => console.log(`Updated voting data in db: (id) ${message.id}`))
    .catch(console.error);

  message.edit(
    constructBody(voteData),
  ).then(() => console.log(`Updated voting message: ${voteData.title}`))
    .catch(console.warn);
}