export interface IGuildConfig {
  channels: {
    [channelID: string]: IChannelConfig,
  };
}

export interface IChannelConfig {
  channelDisplayName: string;
  isCommandOnly: boolean;
  allowCommand_event: boolean;
  allowCommand_emote: boolean;
  allowCommand_poll: boolean;
}
