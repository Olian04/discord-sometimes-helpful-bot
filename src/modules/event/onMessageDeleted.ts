import { Client, Message } from 'discord.js';
import { db } from '../../database';

export const onMessageDeleted = (app: Client) => async (message: Message) => {
  if (message.partial) { await message.fetch(); }

  if (message.channel.type !== 'text') { return; }
  if (message.author.id !== app.user.id) { return; }

  db.child(`event/${message.id}`).remove()
    .then(()  => console.log(`Deleted event from db: (id) ${message.id}`))
    .catch(console.warn);
}