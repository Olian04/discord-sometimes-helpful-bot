
import { Client } from 'discord.js';
import eventCommand from './commands/event';
import { onReactionAdd } from './onReactionAdd';
import { onMessageDeleted } from './onMessageDeleted';
import { registerCommandInGuilds } from '../../util/registerCommand';
import { delegateCommandInteraction } from '../../util/delegateCommandInteraction';

export const setup = (app: Client) => {
  registerCommandInGuilds(app, eventCommand.config);
  app.on('interaction', delegateCommandInteraction(app, [ eventCommand ]));
  app.on('messageReactionAdd', onReactionAdd(app));
  app.on('messageDelete', onMessageDeleted(app));
}
