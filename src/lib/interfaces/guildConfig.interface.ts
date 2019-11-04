export interface IGuildConfig {
  channels: {
    [channelID: string]: IChannelConfig,
  };
}

export interface IChannelConfig {
  isCommandOnly: boolean;
}
