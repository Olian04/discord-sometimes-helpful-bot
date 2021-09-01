import { SlashCommandBuilder } from '@discordjs/builders';

export const eventCommand = new SlashCommandBuilder()
  .setName('event')
  .setDescription('Create an event that users may sign up to')
  .addStringOption(_=>_
    .setName('title')
    .setDescription('The title of your event')
    .setRequired(true)
  )
  .addIntegerOption(_=>_
    .setName('group_size')
    .setDescription('How maybe people can join the event')
    .setRequired(false)
  );
