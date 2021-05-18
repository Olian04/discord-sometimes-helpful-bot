import { Participant } from './Participant';

export interface Event {
  authorID: string;
  title: string;
  participant: { [id: string]: Participant };
}