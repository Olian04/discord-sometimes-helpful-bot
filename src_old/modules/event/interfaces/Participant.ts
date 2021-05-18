export type ParticipationStatus = 'yes' | 'no' | 'maybe';

export interface Participant {
  name: string;
  status: ParticipationStatus;
  lastUpdated: number;
}