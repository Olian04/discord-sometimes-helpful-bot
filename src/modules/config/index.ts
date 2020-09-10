import { Client } from 'discord.js';

import * as disableCmd from './commands/disable';
import * as enableCmd from './commands/enable';
import * as listCmd from './commands/list';

export const setup = (app: Client) => {
  app.on('message', disableCmd.onMessage);
  app.on('message', enableCmd.onMessage);
  app.on('message', listCmd.onMessage);
};
