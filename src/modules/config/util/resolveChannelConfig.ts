import { ChannelConfig } from '../interfaces/ChannelConfig';

const defaultChannelConfig = (): ChannelConfig => ({
  command_whitelist: [],
});

export const resolveChannelConfig = (conf: ChannelConfig): ChannelConfig => {
  if (!conf) {
    return defaultChannelConfig();
  }
  return conf;
}