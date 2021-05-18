import { ApplicationCommandData } from 'discord.js';

export const config: ApplicationCommandData = {
  name: 'echo',
  description: 'Replies with your input',
  options: [
    {
      name: 'msg',
      description: 'The input which should be echoed back',
      type: 'STRING',
    }
  ]
};