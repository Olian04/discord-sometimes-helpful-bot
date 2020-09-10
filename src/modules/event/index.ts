
import { Client } from 'discord.js';
import { onMessage } from './onMessage';
import { onReactionAdd } from './onReactionAdd';
import { onMessageDeleted } from './onMessageDeleted';

export const setup = (app: Client) => {
  app.on('message', onMessage(app));
  app.on('messageReactionAdd', onReactionAdd(app));
  app.on('messageDelete', onMessageDeleted(app));
}
