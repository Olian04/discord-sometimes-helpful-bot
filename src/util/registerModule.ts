import { Client } from 'discord.js';
import { Module } from '../types/Module';
import { delegateCommandInteraction } from './delegateCommandInteraction';
import { registerCommandInGuilds } from './registerCommand';

export const registerModule = (app: Client, module: Module) => {
  console.info(`Registering ${module.commands.length} commands from module ${module.name}`);

  app.once('ready', () => {
    module.commands.forEach(command =>
      registerCommandInGuilds(app, command.config),
    );
  });

  app.on('interaction', delegateCommandInteraction(app, module.commands));
}