export interface IGuildConfig {
  commands: {
    [commandName: string]: {
      includeChannels: IChannelData[],
      excludeChannels: IChannelData[],
    },
  };
}

interface IChannelData {
  id: string;
  displayName: string;
}
