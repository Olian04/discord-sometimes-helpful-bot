import { args } from '../preStartConfig';

const commandToken = args.env === 'development' ? '$' : '!';

export const isCommand = (message: string) => message.startsWith(commandToken);

export const tokenizeCommand = (message: string) => message
  .substr(commandToken.length) // skips commandToken
  .split(' ');
