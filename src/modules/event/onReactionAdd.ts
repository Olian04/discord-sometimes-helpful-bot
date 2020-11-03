import { MessageReaction, Client } from 'discord.js';
import { db, exists, getSnap } from '../../database';
import { Event } from './interfaces/Event';
import { reactionMap } from './util/reactionMap';
import { runEditSequence } from './util/runEditSequence';
import { constructBody } from './util/constructBody';
import { Participant, ParticipationStatus } from './interfaces/Participant';
import { resolvePartialMessage, resolvePartialReaction, resolvePartialGuildMember, resolvePartialUser } from '../../util/resolvePartials';

export const onReactionAdd = (app: Client) => async (_reaction: MessageReaction) => {
  const message = await resolvePartialMessage(
    (await resolvePartialReaction(_reaction)).message
  );

  if (message.channel.type !== 'text') { return; }
  if (message.author.id !== app.user.id) { return; }

  if (!exists(`event/${message.id}`)) {
    console.debug(`Skipping reaction (added) ${_reaction.emoji.name} on message ${message.id} because no EVENT database entry was found for it.`);
    // This message was sent by the bot, but its not an event message.
    return;
  }

  const reactions = _reaction.message.reactions.cache;

  await Promise.all(
    reactions.map(async (reaction) => {
      await resolvePartialReaction(reaction);

      if (! (reaction.emoji.name in reactionMap)) { return Promise.resolve(); }

      const status = reactionMap[reaction.emoji.name];
      const users = await reaction.users.fetch()
        .catch(console.warn);

      if (! users) { return; }

      const { title: eventTitle } = (await getSnap(`event/${message.id}`)).toJSON() as Event;

      return Promise.all(
        users.map(async (user) => {
          await resolvePartialUser(user);
          if (user.bot) { return Promise.resolve(); }
          reaction.users.remove(user)
            .then(() =>
              console.log(`Removed reaction ${reaction.emoji.name} by user "${user.username}" from message (id) ${message.id}`)
            )
            .catch(console.warn);

          if (status === 'start_edit_session') {
            /* runEditSequence will return a promise,
            but DO NOT await it!
            runEditSequence is async in order to be able to "await"
            user response. If you await the promise returned by runEditSequence,
            then you will freeze execution until the user responds
            or an arbitrary timeout occurs.
            */
            runEditSequence(message, user);
            return Promise.resolve();
          }

          const participant = ((await getSnap(`event/${message.id}/participant/${user.id}`))
            .val() as Participant) ?? { lastUpdated: null, name: null, status: null };

          if (participant.status !== status) {
            participant.status = status as ParticipationStatus;
            participant.lastUpdated = Date.now();
          }
          const { displayName } = await resolvePartialGuildMember(message.guild.member(user));
          participant.name = displayName;

          return db.child(`event/${message.id}/participant/${user.id}`).set(participant)
            .then(() =>
              console.log(`Participation on event "${eventTitle}" for user  "${participant.name}" set to "${status}"`)
            )
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