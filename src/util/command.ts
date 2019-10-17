import { Message } from 'discord.js';
import { args } from '../preStartConfig';

export const commandToken = args.env === 'development' ? '$' : '!';

export const deleteIfAble = async (message: Message) => {
  if (message.deletable) {
    try {
      await message.delete();
      return 'successful';
    } catch {
      return 'failed';
    }
  } else {
    return 'disallowed';
  }
};

export const isCommand = (message: string) => message.startsWith(commandToken);

export const isDirectMessage =  (message: Message) => message.guild === null;

export const tokenizeCommand = (message: string) => message
  .substr(commandToken.length) // skips commandToken
  .split(' ');
