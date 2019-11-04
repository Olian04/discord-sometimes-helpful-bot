export interface IGuildConfig {
  channels: {
    [channelID: string]: IChannelConfig,
  };
}

export interface IChannelConfig {
  channelDisplayName: string;
  isCommandOnly: boolean;
}
