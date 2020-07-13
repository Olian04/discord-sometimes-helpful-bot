import { Message } from 'discord.js';
import { emoji } from 'node-emoji';

export const attachReactions = (message: Message) => Promise.resolve()
  .then(() => message.react(emoji.thumbsup))
  .then(() => message.react(emoji.thumbsdown))
  .then(() => message.react(emoji.grey_question))
  .catch(console.warn);
