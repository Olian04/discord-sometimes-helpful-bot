import { IParticipant } from './participant.interface';

export type EventStatus = 'new' | 'active' | 'archived' | 'toBeArchived';

export interface IEvent {
  status: EventStatus;
  id: string;
  title: string;
  guildID: string;
  channelID: string;
  messageID: string | null;
  participants: IParticipant[];
}
