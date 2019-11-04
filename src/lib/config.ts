import { args, discord_token, firebase_config } from '@/preStartConfig';
import { Record } from '@/util/record';
import { LogLevels } from 'discord-commander';
import * as path from 'path';
import { IGuildConfig } from './interfaces/guildConfig.interface';

class Config extends Record<Config> {
  public commander: {
    prefix: string;
    deleteUnknownCommands: boolean;
    allowBots: boolean;
    deleteProcessedCommands: boolean;
    logLevel: LogLevels
  };
  public secret: {
    firebase: typeof firebase_config;
    discord: string;
  };
  public guildConfigs: { [guildID: string]: IGuildConfig };
  public assetsRoot: string;
}

export const config = new Config({
  commander: {
    prefix: args.env === 'development' ? '$' : '!',
    deleteUnknownCommands: false,
    allowBots: false,
    deleteProcessedCommands: true,
    logLevel: args.env === 'development' ? 'debug' : args.verbose ? 'verbose' : 'info',
  },
  secret: {
    firebase: firebase_config,
    discord: discord_token,
  },
  guildConfigs: {},
  assetsRoot: path.join(__dirname, '..', '..', 'assets'),
});
