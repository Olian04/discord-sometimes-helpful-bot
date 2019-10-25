import { Message } from 'discord.js';
import { args } from '../core/preStartConfig';

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

export const extractCommand = (message: string) => message.substr(commandToken.length).match(/^\w*/i)[0];

export const isDirectMessage =  (message: Message) => message.guild === null;

export const tokenizeCommand = (message: string) => message
  .substr(commandToken.length) // skips commandToken
  .split(' ');
