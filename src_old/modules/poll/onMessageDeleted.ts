import { Client, Message } from 'discord.js';
import { db } from '../../database';
import { resolvePartialMessage } from '../../util/resolvePartials';

export const onMessageDeleted = (app: Client) => async (message: Message) => {
  await resolvePartialMessage(message);

  if (message.channel.type !== 'text') { return; }
  if (message.author.id !== app.user.id) { return; }

  db.child(`poll/${message.id}`).remove()
    .then(()  => console.log(`Deleted poll from db: (id) ${message.id}`))
    .catch(console.warn);
}