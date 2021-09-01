import { ParticipationStatus } from './ParticipationStatus';

export interface UpdateParticipation {
  type: 'updateParticipation';
  userID: string;
  userNamer: string;
  participationStatus: ParticipationStatus;
}
export interface UpdateTitle {
  type: 'updateTitle';
  title: string;
}

export type EventAction =
  UpdateParticipation |
  UpdateTitle;