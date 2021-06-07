import { ApplicationCommandData } from 'discord.js';

export const config: ApplicationCommandData = {
  name: 'event',
  description: 'Create a new event',
  options: [
    {
      type: 'STRING',
      name: 'title',
      description: 'What the title of the event should be',
      required: true,
    }
  ]
};