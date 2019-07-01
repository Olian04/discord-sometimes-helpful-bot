const commandToken = '!';

export const isCommand = (message: string) => message.startsWith(commandToken);

export const tokenizeCommand = (message: string) => message
  .substr(commandToken.length) // skips commandToken
  .split(' ');
