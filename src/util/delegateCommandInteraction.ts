import { Client, CommandInteraction } from 'discord.js';
import { ModuleCommand } from '../types/ModuleCommand';

export const delegateCommandInteraction = (app: Client, commands: ModuleCommand[]) => async (interaction: CommandInteraction) => {
  if (!interaction.isCommand()) return;

  const command = commands.find(cmd => cmd.config.name === interaction.commandName);
  if (!command) {
    console.warn(`Failed to process command interaction (ID: ${interaction.id}) because of an unknown command (Name: ${interaction.commandName})`);
    return;
  }
  // Will await promisees, but instantly resolve none promises
  await Promise.resolve(command.handler(interaction, app));

  /*
  try {
  } catch (err) {
    console.warn(`Failed to process command interaction (ID: ${interaction.id}) because of an error in an interaction handler:`, err);
  }
  */
}