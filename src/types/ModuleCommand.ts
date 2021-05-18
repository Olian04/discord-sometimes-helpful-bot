import { ApplicationCommandData } from 'discord.js';
import { CommandHandler } from './CommandHandler';

export interface ModuleCommand {
  config: ApplicationCommandData;
  handler: CommandHandler;
}
