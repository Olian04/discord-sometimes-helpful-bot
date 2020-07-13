import { Participant } from './Participant';

export interface Event {
  title: string;
  participant: { [id: string]: Participant };
}