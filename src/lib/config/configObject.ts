import { getAllConfig } from '@/core/database';
import { Guild } from 'discord.js';
import { IConfig } from './interfaces/config';
import { DisplayConfig } from './messages/DisplayConfig';

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
    if (this.cache.channel === undefined) {
      this.cache.channel = {
        default: {
          commands: [],
          isOnlyCommand: false,
        },
      };
    }
  }
}
