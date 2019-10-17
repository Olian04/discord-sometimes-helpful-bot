export interface IConfig {
  meta: {
    channelID: string;
    displayMessageID: string;
  };
  [section: string]: {
    [key: string]: any;
  };
}
