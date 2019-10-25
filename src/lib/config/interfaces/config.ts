export interface IConfig {
  meta: {
    channelID: string;
    displayMessageID: string;
  };
  channel: {
    default: {
      commands: string[];
      isOnlyCommand: boolean;
    },
    [channelID: string]: {
      commands: string[];
      isOnlyCommand: boolean;
    };
  };
}
