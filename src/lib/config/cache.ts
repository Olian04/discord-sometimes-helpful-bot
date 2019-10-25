import { Guild } from 'discord.js';
import { Config } from './configObject';

const configs = new Map<string, Config>();
export const getConfig = async (guild: Guild) => {
  if (! configs.has(guild.id)) {
    configs.set(guild.id, new Config(guild));
    await configs.get(guild.id).fetchLatestConfig();
  }
  return configs.get(guild.id);
};
