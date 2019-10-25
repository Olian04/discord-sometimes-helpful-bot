export interface IParticipant {
  attend: 'yes' | 'no' | 'maybe';
  name: string;
  timestamp?: number;
}
