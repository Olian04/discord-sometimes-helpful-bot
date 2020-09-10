import { Message, Client } from 'discord.js';
import { db } from '../../database';
import { attachReactions } from './util/attachReactions';
import { constructBody } from './util/constructBody';
import { deferDelete } from '../../util/defer';
import { isWhitelisted } from '../config/api';

export const onMessage = (app: Client) => async (message: Message) => {
  if (message.channel.type !== 'text') { return; }
  if (! message.content.startsWith('!event ')) { return; }
  if (! await isWhitelisted('event', message)) { return; }

  deferDelete(message);

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
};