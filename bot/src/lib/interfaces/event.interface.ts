import { IEventParticipant } from './eventParticipant.interface';

export type EventStatus = 'new' | 'active' | 'archived';

export interface IEvent {
  title: string;
  status: EventStatus;
  participants: IEventParticipant[];
  eventID: string;
  guildID: string;
  channelID: string;
  messageID: string | null;
}
