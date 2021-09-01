import { ParticipationStatus } from './ParticipationStatus';

export interface ParticipantState {
  name: string;
  status: ParticipationStatus;
  lastUpdated: number;
}