import { MessageReaction, Client } from 'discord.js';
import { db, getSnap } from '../../database';
import { Event } from './interfaces/Event';
import { reactionMap } from './util/reactionMap';
import { runEditSequence } from './util/runEditSequence';
import { constructBody } from './util/constructBody';

export const onReactionAdd = (app: Client) => async (_reaction: MessageReaction) => {
  if (_reaction.partial) { await _reaction.fetch(); }
  if (_reaction.message.partial) { await _reaction.message.fetch(); }

  if (_reaction.message.channel.type !== 'text') { return; }
  if (_reaction.message.author.id !== app.user.id) { return; }

  const message = _reaction.message;

  if (! (await getSnap(`event/${_reaction.message.id}`)).exists()) {
    // This message was sent by the bot, but its no an event message.
    // This message was probably sent by en earlier version of the bot.
    return;
  }

  const reactions = _reaction.message.reactions.cache;

  await Promise.all(
    reactions.map(async (reaction) => {
      if (reaction.partial) {
        await reaction.fetch()
          .catch(console.warn);
      }
      if (! (reaction.emoji.name in reactionMap)) { return Promise.resolve(); }

      const status = reactionMap[reaction.emoji.name];
      const users = await reaction.users.fetch()
        .catch(console.warn);

      if (! users) { return; }

      const { title: eventTitle } = (await getSnap(`event/${message.id}`)).toJSON() as Event;

      return Promise.all(
        users.map((user) => {
          if (user.bot) { return Promise.resolve(); }
          reaction.users.remove(user)
            .catch(console.warn);

          if (status === 'start_edit_session') {
            /* Run edit sequence will return a promise,
            but DO NOT await it!
            Run edit sequence is async in order to be able to "await"
            user response. If you await the promise returned by runEditSequence,
            then you will freeze execution unnecessarily.
            */
            runEditSequence(_reaction.message, user);
            return Promise.resolve();
          }

          const nickName = reaction.message.guild.member(user).displayName;
          return db.child(`event/${reaction.message.id}/participant/${user.id}`).set({
            name: nickName,
            status,
            lastUpdated: Date.now(),
          }).then(() => console.log(`Participation on event "${eventTitle}" for user  "${nickName}" set to "${status}"`))
            .catch(console.warn);
        }),
        );
    }),
  );

  const event = (await getSnap(`event/${message.id}`)).toJSON() as Event;

  if (! event) {
    console.error(`Failed to fetch event data from db after reaction update: (id) ${message.id}`);
    return;
  }

  // Convert participant object to array of participants
  const participants = Object.values(event.participant || {});

  message.edit(
    constructBody(event.title, participants),
  ).then(() => console.log(`Updated event message: ${event.title}`))
    .catch(console.warn);
};