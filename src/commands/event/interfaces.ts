import { Message, MessageReaction } from 'discord.js';

export interface IParticipant {
  attend: 'yes' | 'no' | 'maybe';
  name: string;
  timestamp?: number;
}

export interface IEditHandlerArguments {
  title: string;
  participants: IParticipant[];
  eventMessage: Message;
  reaction: MessageReaction;
}
