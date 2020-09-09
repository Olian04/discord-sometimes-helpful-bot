import { Client } from 'discord.js';

import * as disableCmd from './commands/disable';
import * as disableAdminCmd from './commands/disable_admin';
import * as enableCmd from './commands/enable';
import * as enableAdminCmd from './commands/enable_admin';
import * as listCmd from './commands/list';
import * as listAdminCmd from './commands/list_admin';

export const setup = (app: Client) => {
  app.on('message', disableCmd.onMessage);
  app.on('message', disableAdminCmd.onMessage);

  app.on('message', enableCmd.onMessage);
  app.on('message', enableAdminCmd.onMessage);

  app.on('message', listCmd.onMessage);
  app.on('message', listAdminCmd.onMessage);
};
