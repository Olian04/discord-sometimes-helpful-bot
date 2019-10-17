import { Guild } from 'discord.js';
import { getAllConfig } from '../../database';
import { IConfig } from './consts';
import { DisplayConfig } from './DisplayConfig';

export class Config {
  public guild: Guild;
  public dynamicMessage: DisplayConfig;
  public cache: IConfig;

  constructor(guild: Guild) {
    this.guild = guild;
  }

  public async fetchLatestConfig() {
    this.cache = await getAllConfig(this.guild.id) as IConfig;
    if (this.cache.meta === undefined) {
      this.cache.meta = {
        channelID: null,
        displayMessageID: null,
      };
    }
  }
}
