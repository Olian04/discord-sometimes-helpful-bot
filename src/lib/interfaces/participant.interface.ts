export type Attendance =  'yes' | 'no' | 'maybe';

export interface IParticipant {
  userID: string;
  nickname: string;
  attendance: Attendance;
  timestamp: number;
}
