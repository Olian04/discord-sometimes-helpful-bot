import { CommandInteraction } from 'discord.js';
import { CommandHandler } from '../../../../types/CommandHandler';

const helpMessage = 'What do you want me to echo? You never told me.'

export const onCommand: CommandHandler = (interaction, app) => {
  const input = interaction.options[0]?.value as string;
  if (input) {
    interaction.reply(input);
  } else {
    interaction.reply(helpMessage, {
      ephemeral: true,
    });
  }
}