
import { Client } from 'discord.js';
import { onMessage } from './onMessage';

export const setup = (app: Client) => {
  app.on('message', onMessage(app));
}
