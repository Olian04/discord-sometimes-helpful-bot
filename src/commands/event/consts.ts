import { Message } from 'discord.js';

export interface IParticipant {
  attend: 'yes' | 'no' | 'maybe';
  name: string;
}

export enum ResponseEmoji {
  YES = '👍',
  NO = '👎',
  MAYBE = '❔',
}

export interface IUpdateHandlerArguments {
  participants: IParticipant[];
  title: string;
  eventMessage: Message;
}
