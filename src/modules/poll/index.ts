import { Client } from 'discord.js';

import { onMessage } from './onMessage';
import { onReactionAdd } from './onReactionAdd';
import { onReactionRemove } from './onReactionRemove';

export const setup = (app: Client) => {
  app.on('message', onMessage(app));
  app.on('messageReactionAdd', onReactionAdd(app));
  app.on('messageReactionRemove', onReactionRemove(app));
};
