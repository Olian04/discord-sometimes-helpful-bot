import { ParticipantState } from './ParticipantState';

export interface EventState {
  authorID: string;
  title: string;
  participants: {
    [id: string]: ParticipantState
  };
  groupSize?: number;
  [id: string]: any;
}
