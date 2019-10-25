import { Message, MessageReaction } from 'discord.js';
import { IParticipant } from './participant';

export interface IEditHandlerArguments {
  title: string;
  participants: IParticipant[];
  eventMessage: Message;
  reaction: MessageReaction;
}
