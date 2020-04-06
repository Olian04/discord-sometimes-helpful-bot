import { IEventParticipant } from './eventParticipant.interface';

export type EventStatus = 'new' | 'active' | 'archived' | 'toBeArchived';

export interface IEvent {
  status: EventStatus;
  id: string;
  title: string;
  guildID: string;
  channelID: string;
  messageID: string | null;
  participants: IEventParticipant[];
}
