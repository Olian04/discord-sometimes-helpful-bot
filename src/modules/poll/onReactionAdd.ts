import { Client, MessageReaction, PartialUser, User } from 'discord.js';
import { db, getSnap } from '../../database';
import { VoteData } from './interfaces/VoteData';
import { constructBody } from './util/constructBody';
import { emojiNumberMap } from './util/emojiNumberMap';
import { resolvePartialMessage, resolvePartialReaction, resolvePartialUser } from '../../util/resolvePartials';

export const onReactionAdd = (app: Client) => async (reaction: MessageReaction, user: User | PartialUser) => {
  await resolvePartialReaction(reaction);
  await resolvePartialMessage(reaction.message);
  user = await resolvePartialUser(user);

  if (reaction.message.channel.type !== 'text') { return; }
  if (reaction.message.author.id !== app.user.id) { return; }
  if (user.bot) { return; }

  const snap = await getSnap(`poll/${reaction.message.id}`);
  if ( !(snap.exists()) ) {
    console.debug(`Skipping reaction (added) ${reaction.emoji.name} on message ${reaction.message.id} because no POLL database entry was found for it.`);
    // This message was sent by the bot, but its not a poll message.
    return;
  }

  const message = reaction.message;

  const voteData = snap.toJSON() as VoteData;

  const emojiNumber = emojiNumberMap.indexOf(reaction.emoji.name);
  if (emojiNumber < 0) { return Promise.resolve(); }

  voteData.options[emojiNumber].voteCount += 1;

  db.child(`poll/${message.id}`).set(voteData)
    .then(() => console.log(`Updated voting data in db: (id) ${message.id}`))
    .catch(console.error);

  message.edit(
    constructBody(voteData),
  ).then(() => console.log(`Updated voting message: ${voteData.title}`))
    .catch(console.warn);
}