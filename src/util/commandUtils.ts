import { Message } from 'discord.js';
import { args } from '../preStartConfig';

const commandToken = args.env === 'development' ? '$' : '!';

export const isCommand = (message: string) => message.startsWith(commandToken);

export const isDirectMessage =  (message: Message) => message.guild === null;
export const directMessageGuildID = 'direct message';
export const getGuildID = (message: Message) => (message.guild || { id: directMessageGuildID }).id;

export const tokenizeCommand = (message: string) => message
  .substr(commandToken.length) // skips commandToken
  .split(' ');
