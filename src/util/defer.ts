import { Message } from 'discord.js';

export const defer = (cb: () => void) => setTimeout(cb, 0);

export const deferDelete = (message: Message) => defer(() => {
  message.delete()
    .then(() => console.log(`Deleted message: (id) ${message.id}`))
    .catch(console.warn);
});