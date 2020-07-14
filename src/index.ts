import './setup';

import { Client } from 'discord.js';
import { emoji } from 'node-emoji';
import { db, getSnap } from './database';
import { attachReactions, constructBody, runEditSequence } from './event';
import { Event } from './interfaces/Event';

const app = new Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

const reactionMap = {
  [emoji.thumbsup]: 'yes',
  [emoji.thumbsdown]: 'no',
  [emoji.grey_question]: 'maybe',
  [emoji.wrench]: 'start_edit_session',
};

app.on('ready', ()  => {
  console.info(`Client ready`);

  // Set presence message
  app.user.setPresence({
    afk: false,
    activity: {
      type: 'LISTENING',
      name: `!event`,
      url: 'https://github.com/Olian04/discord-sometimes-helpful-bot',
    },
    status: 'online',
  }).catch(console.warn);
});

app.on('rateLimit', (data)  => {
  console.warn(`Rate limiting in effect`, data);
});

app.on('message', async (message) => {
  if (message.channel.type !== 'text') { return; }
  if (! message.content.startsWith('!event ')) { return; }
  const title =  message.content.substring('!event '.length);

  const eventMessage = await message.channel.send(
    constructBody(title, []),
  ).then((val) => {
    console.log(`Sent event message to discord: ${title}`);
    return val;
  }).catch(console.warn);

  if (! eventMessage) { return; }

  attachReactions(eventMessage)
    .then(() => `Attached reactions to event message: ${title}`);

  db.child(`event/${eventMessage.id}`).set({
    title,
    participant: {},
  }).then(() => console.log(`Committed event to db: ${title}`))
    .catch(console.warn);

  message.delete()
    .then(() => console.log(`Deleted message: (id) ${message.id}`))
    .catch(console.warn);
});

app.on('messageReactionAdd', async (_reaction) => {
  if (_reaction.partial) { await _reaction.fetch(); }
  if (_reaction.message.partial) { await _reaction.message.fetch(); }

  if (_reaction.message.channel.type !== 'text') { return; }
  if (_reaction.message.author.id !== app.user.id) { return; }

  const message = _reaction.message;
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

      return Promise.all(
        users.map((user) => {
          if (user.bot) { return Promise.resolve(); }
          reaction.users.remove(user)
            .catch(console.warn);

          if (status === 'start_edit_session') {
            runEditSequence(_reaction.message, user);
            return Promise.resolve();
          }

          return db.child(`event/${reaction.message.id}/participant/${user.id}`).set({
            name: reaction.message.guild.member(user).displayName,
            status,
            lastUpdated: Date.now(),
          }).catch(console.warn);
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
});

app.on('messageDelete', async (message) => {
  if (message.partial) { await message.fetch(); }

  if (message.channel.type !== 'text') { return; }
  if (message.author.id !== app.user.id) { return; }

  db.child(`event/${message.id}`).remove()
    .then(()  => console.log(`Deleted event from db: (id) ${message.id}`))
    .catch(console.warn);
});

app.login(process.env.DISCORD_SECRET)
  .then(() => console.info(`Login successful`))
  .catch((err) => console.error(`Login failed: ${err}`));
