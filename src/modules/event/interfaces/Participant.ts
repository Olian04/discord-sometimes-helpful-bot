export interface Participant {
  name: string;
  status: 'yes' | 'no' | 'maybe';
  lastUpdated: number;
}