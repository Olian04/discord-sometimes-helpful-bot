import { config } from '@/config';
import { db } from '@/database';
import { Guild } from 'discord.js';

export const setup = (guild: Guild) =>  {
  // Keep configs updated
  db(guild.id).config.onChange((conf) => {
    config.guildConfigs[guild.id] = conf;
  });
};
