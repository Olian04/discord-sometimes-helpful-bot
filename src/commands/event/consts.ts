import { Message } from 'discord.js';

export interface IParticipant {
  attend: 'yes' | 'no' | 'maybe';
  name: string;
  timestamp?: number;
}

export enum ResponseEmoji {
  YES = '👍',
  NO = '👎',
  MAYBE = '❔',
  EDIT_TITLE =  '🔧', // TODO: Implement this (see readme for more info)
}

export interface IUpdateHandlerArguments {
  participants: IParticipant[];
  title: string;
  eventMessage: Message;
}
